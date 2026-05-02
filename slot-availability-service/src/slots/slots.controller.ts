import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { GenerateSlotsDto } from './dto/generate-slots.dto';
import { GetSlotsDto } from './dto/get-slots.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateSlots(@Body() dto: GenerateSlotsDto) {
    const data = await this.slotsService.generateSlots(dto);
    return {
      success: true,
      message: 'Slots generated successfully',
      data,
      error: null,
    };
  }

  @Get()
  async getAvailability(@Query() dto: GetSlotsDto) {
    const data = await this.slotsService.getAvailability(dto);
    return {
      success: true,
      message: 'Slots retrieved successfully',
      data,
      error: null,
    };
  }

  // NOTE: Person 2 (Booking Engine) will call this internal endpoint,
  // or use the SlotsService directly if in the same monolithic application.
  // We expose it via HTTP just in case microservices architecture is used.
  @Post('internal/book')
  @HttpCode(HttpStatus.OK)
  async bookSlot(@Body('slot_id') slot_id: string) {
    const success = await this.slotsService.lockAndBookSlot(slot_id);
    return {
      success: true,
      message: success ? 'Slot booked successfully' : 'Failed to book slot',
      data: { success },
      error: null,
    };
  }
}
