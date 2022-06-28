import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'src/constants/gender.enum';
export class UserRegisterRequest extends BaseDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
