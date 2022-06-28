import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenRequest extends BaseDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
