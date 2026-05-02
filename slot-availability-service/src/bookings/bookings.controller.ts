import { Controller, Post, Body, Patch, Param, Get, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, RescheduleBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Req() req: Request, @Body() dto: CreateBookingDto) {
    // Note: req.user is populated by JwtAuthGuard with { user_id, role, email }
    const user = (req as any).user;
    const data = await this.bookingsService.createBooking(user.user_id, dto);

    return {
      success: true,
      message: data.payment_required ? 'Payment required' : 'Booking confirmed',
      data,
      error: null,
    };
  }

  @Patch(':id/cancel')
  async cancelBooking(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const data = await this.bookingsService.cancelBooking(id, user.user_id);

    return {
      success: true,
      message: 'Booking cancelled successfully',
      data,
      error: null,
    };
  }

  @Patch(':id/reschedule')
  async rescheduleBooking(@Req() req: Request, @Param('id') id: string, @Body() dto: RescheduleBookingDto) {
    const user = (req as any).user;
    const data = await this.bookingsService.rescheduleBooking(id, user.user_id, dto);

    return {
      success: true,
      message: 'Booking rescheduled successfully',
      data,
      error: null,
    };
  }

  @Get('my-bookings')
  async getMyBookings(@Req() req: Request) {
    const user = (req as any).user;
    const data = await this.bookingsService.getMyBookings(user.user_id);

    return {
      success: true,
      message: 'Bookings retrieved successfully',
      data,
      error: null,
    };
  }

  @Get(':id')
  async getBooking(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    const data = await this.bookingsService.getBooking(id, user.user_id);

    return {
      success: true,
      message: 'Booking retrieved successfully',
      data,
      error: null,
    };
  }
}
