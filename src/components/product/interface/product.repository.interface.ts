import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ProductEntity } from '@entities/product/product.entity';
import { DetailRequest } from '@utils/detail.request';
import { ListProductQuery } from '../dto/query/list-product.query';
import { CreateProductRequest } from '../dto/request/create-product.request';

export interface ProductRepositoryInterface
  extends BaseAbstractRepository<ProductEntity> {
  createEntity(request: CreateProductRequest): ProductEntity;
  list(request: ListProductQuery): Promise<any>;
  detail(id: number): Promise<any>;
}
