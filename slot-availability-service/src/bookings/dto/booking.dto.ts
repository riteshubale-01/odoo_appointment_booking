import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @IsUUID()
  @IsNotEmpty()
  slot_id: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  // The prompt asked for "capacity: 1", but slot capacity reduces by 1 per booking as per slots service.
  // We accept it, though the lock logic implicitly locks 1 spot right now.
  @IsOptional()
  capacity?: number;

  @IsOptional()
  @IsObject()
  answers?: Record<string, any>;
}

export class RescheduleBookingDto {
  @IsUUID()
  @IsNotEmpty()
  new_slot_id: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'new_date must be in YYYY-MM-DD format' })
  new_date: string;
}
