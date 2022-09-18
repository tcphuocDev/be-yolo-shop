import { BaseDto } from '@core/dto/base.dto';
import { Transform, Type } from 'class-transformer';
import {
  MinLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { isJson } from 'src/helper/string.helper';

class ProductVersion {
  @IsInt()
  @IsNotEmpty()
  sizeId: number;

  @IsInt()
  @IsNotEmpty()
  colorId: number;

  @IsOptional()
  @Transform((obj) => Number(obj.value))
  @IsInt()
  quantity: number;
}

export class CreateProductRequest extends BaseDto {
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  tag: string;

  @Min(0)
  @IsNotEmpty()
  @Transform((obj) => Number(obj.value))
  @IsInt()
  price: number;

  @IsOptional()
  // @Min(0)
  // @Transform((obj) => Number(obj.value))
  // @IsInt()
  salePrice: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  categoryId: number;

  @Type(() => ProductVersion)
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
  productVersions: ProductVersion[];
}
