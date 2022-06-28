import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateSizeRequest } from './create-size.request';

export class UpdateSizeBodyRequest extends CreateSizeRequest {}
export class UpdateSizeRequest extends UpdateSizeBodyRequest {
  @IsNumber()
  @Transform((value) => Number(value.value))
  @IsNotEmpty()
  id: number;
}
