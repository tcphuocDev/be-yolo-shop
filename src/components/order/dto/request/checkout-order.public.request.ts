import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/constants/gender.enum';
import { CreateOrderRequest } from './create-order.request';

export class CheckoutOrderPublicRequest extends CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEnum(GenderEnum)
  // @IsNotEmpty()
  gender: GenderEnum;

  // @IsInt()
  // @Transform(({ value }) => Number(value))
  // @IsOptional()
  // couponId: number;
}
