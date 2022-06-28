import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { SizeEntity } from '@entities/size/size.entity';
import { ListSizeQuery } from '../dto/query/list-size.request';
import { CreateSizeRequest } from '../dto/request/create-size.request';

export interface SizeRepositoryInterface
  extends BaseAbstractRepository<SizeEntity> {
  createEntity(request: CreateSizeRequest): SizeEntity;
  list(request: ListSizeQuery): Promise<any>;
}
