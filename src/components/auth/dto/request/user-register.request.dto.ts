import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { GenderEnum } from 'src/constants/gender.enum';
export class UserRegisterRequest extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ example: '0789-789-7890', description: 'phone' })
  phone: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'example', description: 'full name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullname: string;

  @ApiProperty({ example: '0:Nam , 1:nu', description: 'Nam, nu' })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
