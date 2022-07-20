import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateProductRequest } from './create-product.request';
export class UpdateProductBodyDto extends CreateProductRequest {}
export class UpdateProductRequest extends UpdateProductBodyDto {
  @IsOptional()
  keepImages: string[];

  @IsNotEmpty()
  @Transform((value) => Number(value.value))
  @IsNumber()
  id: number;
}
