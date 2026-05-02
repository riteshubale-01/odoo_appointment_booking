import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { GenerateSlotsDto } from './dto/generate-slots.dto';
import { GetSlotsDto } from './dto/get-slots.dto';
import { addMinutes, parseISO, format, parse, isBefore, isSameDay, addDays } from 'date-fns';

@Injectable()
export class SlotsService {
  private readonly logger = new Logger(SlotsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async generateSlots(dto: GenerateSlotsDto) {
    const { service_id, start_date, end_date } = dto;
    
    // 1. Fetch Service
    const service = await this.prisma.service.findUnique({
      where: { id: service_id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${service_id} not found`);
    }

    const duration = service.duration_minutes;
    const workingHours: any = service.working_hours; // Expected { "monday": [{ "start": "09:00", "end": "17:00" }] }
    const capacity = service.total_capacity;

    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);

    if (isBefore(endDate, startDate)) {
      throw new BadRequestException('end_date cannot be before start_date');
    }

    let currentDate = startDate;
    let generatedCount = 0;
    const slotsToCreate: any[] = [];

    // 2. Iterate through each day
    while (!isBefore(endDate, currentDate) || isSameDay(currentDate, endDate)) {
      const dayOfWeek = format(currentDate, 'EEEE').toLowerCase();
      const daySchedule = workingHours[dayOfWeek];

      if (daySchedule && Array.isArray(daySchedule)) {
        for (const shift of daySchedule) {
          const shiftStart = parse(shift.start, 'HH:mm', currentDate);
          const shiftEnd = parse(shift.end, 'HH:mm', currentDate);
          
          let currentSlotTime = shiftStart;

          while (isBefore(addMinutes(currentSlotTime, duration), shiftEnd) || isSameDay(addMinutes(currentSlotTime, duration), shiftEnd) && currentSlotTime < shiftEnd) {
            
            const nextSlotTime = addMinutes(currentSlotTime, duration);
            if (nextSlotTime > shiftEnd) break;

            slotsToCreate.push({
              service_id,
              date: currentDate,
              start_time: currentSlotTime,
              end_time: nextSlotTime,
              available_capacity: capacity,
              total_capacity: capacity,
              status: 'available',
            });

            currentSlotTime = nextSlotTime;
            generatedCount++;
          }
        }
      }
      currentDate = addDays(currentDate, 1);
    }

    // 3. Batch Insert using Prisma (ignoring duplicates via raw query or createMany if supported)
    // Prisma createMany skipDuplicates is supported in PostgreSQL
    if (slotsToCreate.length > 0) {
      let createdCount = 0;
      for (const slotData of slotsToCreate) {
        try {
          await this.prisma.slot.create({ data: slotData });
          createdCount++;
        } catch (e) {
          // Ignore duplicates (unique constraint violation)
          this.logger.debug(`Skipping duplicate slot: ${slotData.start_time}`);
        }
      }
      return { generated_count: createdCount };
    }

    return { generated_count: 0 };
  }

  async getAvailability(dto: GetSlotsDto) {
    const { service_id, date } = dto;
    const parsedDate = parseISO(date);

    const slots = await this.prisma.slot.findMany({
      where: {
        service_id,
        date: parsedDate,
        status: 'available',
        available_capacity: {
          gt: 0
        }
      },
      orderBy: {
        start_time: 'asc'
      }
    });

    return slots.map(slot => ({
      slot_id: slot.id,
      service_id: slot.service_id,
      date: format(slot.date, 'yyyy-MM-dd'),
      start_time: format(slot.start_time, 'HH:mm'),
      end_time: format(slot.end_time, 'HH:mm'),
      available_capacity: slot.available_capacity,
      total_capacity: slot.total_capacity,
      status: slot.status,
    }));
  }

  // Internal method to be called by Person 2 (Booking Engine)
  async lockAndBookSlot(slot_id: string): Promise<boolean> {
    const lockKey = `slot:lock:${slot_id}`;
    
    // Try to acquire Redis lock for 10 seconds
    const locked = await this.redis.acquireLock(lockKey, 10);
    if (!locked) {
      throw new BadRequestException('Slot is currently being booked by someone else');
    }

    try {
      // Use DB transaction to decrement capacity
      const slot = await this.prisma.$transaction(async (tx) => {
        const currentSlot = await tx.slot.findUnique({
          where: { id: slot_id },
        });

        if (!currentSlot || currentSlot.available_capacity <= 0 || currentSlot.status !== 'available') {
          throw new BadRequestException('Slot is no longer available');
        }

        const newCapacity = currentSlot.available_capacity - 1;
        const newStatus = newCapacity === 0 ? 'full' : 'available';

        return tx.slot.update({
          where: { id: slot_id },
          data: {
            available_capacity: newCapacity,
            status: newStatus,
          },
        });
      });

      return !!slot;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }
}
