import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UserRequest extends BaseDto {
  @Transform((obj) => Number(obj.value))
  @IsInt()
  id: number;

  phone: string;
}
