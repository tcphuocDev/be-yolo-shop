import { DetailRequest } from '@utils/detail.request';
import { ResponsePayload } from '@utils/response-payload';
import { ListProductQuery } from '../dto/query/list-product.query';
import { CreateProductRequest } from '../dto/request/create-product.request';
import { UpdateProductRequest } from '../dto/request/update-product.request';

export interface ProductServiceInterface {
  createProduct(request: CreateProductRequest, files: any): Promise<any>;
  list(request: ListProductQuery): Promise<any>;
  detail(id: number): Promise<any>;
  update(
    request: UpdateProductRequest,
    files: any,
  ): Promise<ResponsePayload<any>>;
  delete(request: DetailRequest): Promise<any>;
}
