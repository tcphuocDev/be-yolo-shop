import { IsOptional } from 'class-validator';
import { CreateProductRequest } from './create-product.request';

export class UpdateProductRequest extends CreateProductRequest {
  @IsOptional()
  keepImages: string[];
}
