import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
