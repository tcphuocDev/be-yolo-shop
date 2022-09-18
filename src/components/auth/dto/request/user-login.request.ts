import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserLoginRequest extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  // @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'aaaaaaaaaaaaaa', description: 'password' })
  @IsString()
  password: string;
}
