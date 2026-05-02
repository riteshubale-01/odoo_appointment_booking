import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class GenerateSlotsDto {
  @IsString()
  @IsNotEmpty()
  service_id: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: string; // YYYY-MM-DD

  @IsDateString()
  @IsNotEmpty()
  end_date: string; // YYYY-MM-DD
}
