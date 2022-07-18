import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateCouponRequest } from './create-coupon.request.dto';

export class UpdateCouponBodyDto extends CreateCouponRequest {}
export class UpdateCouponRequest extends UpdateCouponBodyDto {
  @IsNotEmpty()
  @Transform((value) => Number(value.value))
  @IsNumber()
  id: number;
}
