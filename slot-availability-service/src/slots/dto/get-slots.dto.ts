import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class GetSlotsDto {
  @IsString()
  @IsNotEmpty()
  service_id: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD
}
