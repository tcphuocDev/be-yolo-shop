import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateOrderRequest } from './create-order.request';
export class UpdateOrderBodyDto extends CreateOrderRequest {}

export class UpdateOrderRequest extends UpdateOrderBodyDto {
  @IsNumber()
  @Transform((value) => Number(value.value))
  @IsNotEmpty()
  id: number;
}
