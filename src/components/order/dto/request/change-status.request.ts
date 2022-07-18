import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ChangeStatusRequest extends BaseDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  status: number;
}
