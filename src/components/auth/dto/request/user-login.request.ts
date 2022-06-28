import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserLoginRequest extends BaseDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
