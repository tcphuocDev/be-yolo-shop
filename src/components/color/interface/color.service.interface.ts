import { ColorEntity } from '@entities/color/color.entity';
import { DetailRequest } from '@utils/detail.request';
import { ListColorQuery } from '../dto/query/list-color.query';
import { CreateColorRequest } from '../dto/request/create-color.request';
import { UpdateColorRequest } from '../dto/request/update-color.request';

export interface ColorServiceInterface {
  createColor(request: CreateColorRequest): Promise<any>;
  updateColor(request: UpdateColorRequest): Promise<any>;
  list(request: ListColorQuery): Promise<any>;
  detail(request: DetailRequest): Promise<any>;
  delete(request: DetailRequest): Promise<any>;
}
