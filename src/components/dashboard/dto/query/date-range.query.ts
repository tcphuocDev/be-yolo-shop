import { BaseDto } from '@core/dto/base.dto';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DateRangeQuery extends BaseDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
