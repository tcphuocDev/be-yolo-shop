import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ProductImageEntity } from '@entities/product/product-image.entity';

export interface ProductImageRepositoryInterface
  extends BaseAbstractRepository<ProductImageEntity> {
  createProductImage(productId: number, url: string): ProductImageEntity;
  
}
