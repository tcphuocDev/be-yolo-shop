import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCouponRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
