import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ProductVersionEntity } from '@entities/product/product-version.entity';

export interface ProductVersionRepositoryInterface
  extends BaseAbstractRepository<ProductVersionEntity> {
  createProductVersion(
    productId: number,
    sizeId: number,
    colorId: number,
    quantity: number,
  ): ProductVersionEntity;
  getProductIdsByOrderId(orderId: number): Promise<any>;
  countQuantity(): Promise<any>
}
