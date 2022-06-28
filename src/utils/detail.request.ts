import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DetailRequestBody extends BaseDto {}
export class DetailRequest extends DetailRequestBody {
  @IsNumber()
  @Transform((value) => Number(value.value))
  @IsNotEmpty()
  id: number;
}
