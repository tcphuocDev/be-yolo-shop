import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CategoryEntity } from '@entities/category/category.entity';
import { ResponsePayload } from '@utils/response-payload';
import { GetCategoriesQuery } from '../dto/query/get-categories.query';
import { CreateCategoryRequest } from '../dto/request/create-category.request';

export interface CategoryRepositoryInterface
  extends BaseAbstractRepository<CategoryEntity> {
  createEntity(request: CreateCategoryRequest): CategoryEntity;
  getCategories(request: GetCategoriesQuery): Promise<any>;
  updateEntity(id: number, data: any): CategoryEntity;
}
