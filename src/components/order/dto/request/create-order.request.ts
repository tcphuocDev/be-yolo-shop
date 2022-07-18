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
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  productVersionId: number;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsOptional()
  price: number;
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
