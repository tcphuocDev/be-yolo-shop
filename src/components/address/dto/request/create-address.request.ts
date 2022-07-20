import { AddressIsMainEnum } from '@components/address/address.constans';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressRequest extends BaseDto {
  @ApiProperty({ example: 'Ha Noi' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
