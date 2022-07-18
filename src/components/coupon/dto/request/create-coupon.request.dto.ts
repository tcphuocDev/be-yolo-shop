import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCouponRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  planQuantity: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
