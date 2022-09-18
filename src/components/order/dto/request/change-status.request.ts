import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
export class ChangeStatusBodyDto extends BaseDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  status: number;
}
export class ChangeStatusRequest extends ChangeStatusBodyDto {
  @Transform((value) => Number(value.value))
  @IsInt()
  @IsNotEmpty()
  id: number;
}
