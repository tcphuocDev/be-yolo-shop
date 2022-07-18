import { AddressIsMainEnum } from '@components/address/address.constans';
import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}
