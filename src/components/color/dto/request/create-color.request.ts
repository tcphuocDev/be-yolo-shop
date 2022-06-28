import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
