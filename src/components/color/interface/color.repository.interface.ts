import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ColorEntity } from '@entities/color/color.entity';
import { ListColorQuery } from '../dto/query/list-color.query';
import { CreateColorRequest } from '../dto/request/create-color.request';

export interface ColorRepositoryInterface
  extends BaseAbstractRepository<ColorEntity> {
  createEntity(request: CreateColorRequest): ColorEntity;
  list(request: ListColorQuery): Promise<any>;
}
