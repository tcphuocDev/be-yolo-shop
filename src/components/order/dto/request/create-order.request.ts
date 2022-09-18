import { BaseDto } from '@core/dto/base.dto';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { isJson } from 'src/helper/string.helper';

class OrderDetailRequest {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  productVersionId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderRequest extends BaseDto {
  @Type(() => OrderDetailRequest)
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    if (value) value = value.replace(/\\/g, '');

    if (isJson(value)) {
      const decodedData = decodeURIComponent(value);
      return JSON.parse(decodedData);
    }
  })
  @ArrayNotEmpty()
  @ArrayUnique<OrderDetailRequest>((item) => item.productVersionId)
  products: OrderDetailRequest[];
}
