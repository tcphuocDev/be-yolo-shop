import { DetailRequest } from '@utils/detail.request';
import { ResponsePayload } from '@utils/response-payload';
import { GetCategoriesQuery } from '../dto/query/get-categories.query';
import { CreateCategoryRequest } from '../dto/request/create-category.request';
import { UpdateCategoryRequest } from '../dto/request/update-category.request';

export interface CategoryServiceInterface {
  createCategory(request: CreateCategoryRequest): Promise<any>;
  getCategories(request: GetCategoriesQuery): Promise<any>;
  getCategory(id: number): Promise<any>;
  delete(id: number): Promise<ResponsePayload<any>>;
  updateCategory(request: UpdateCategoryRequest): Promise<any>;
}
