import { DetailRequest } from '@utils/detail.request';
import { ListSizeQuery } from '../dto/query/list-size.request';
import { CreateSizeRequest } from '../dto/request/create-size.request';
import { UpdateSizeRequest } from '../dto/request/update-size.request';

export interface SizeServiceInterface {
  create(request: CreateSizeRequest): Promise<any>;
  list(request: ListSizeQuery): Promise<any>;
  detail(request: DetailRequest): Promise<any>;
  update(request: UpdateSizeRequest): Promise<any>;
  delete(request: DetailRequest): Promise<any>;
}
