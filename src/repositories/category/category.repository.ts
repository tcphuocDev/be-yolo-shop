import { GetCategoriesQuery } from '@components/category/dto/query/get-categories.query';
import { CreateCategoryRequest } from '@components/category/dto/request/create-category.request';
import { CategoryRepositoryInterface } from '@components/category/interface/category.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CategoryEntity } from '@entities/category/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository
  extends BaseAbstractRepository<CategoryEntity>
  implements CategoryRepositoryInterface
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }

  public createEntity(request: CreateCategoryRequest): CategoryEntity {
    const newCategoryEntity = new CategoryEntity();
    newCategoryEntity.name = request.name;
    newCategoryEntity.description = request.description;
    return newCategoryEntity;
  }

  public async getCategories(
    request: GetCategoriesQuery,
  ): Promise<[any[], number]> {
    const query = this.categoryRepository
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.description AS description',
        'c.slug AS slug',
        'c.created_at AS "createdAt"',
        'c.updated_at AS "updatedAt"',
      ]);

    const data = await query
      .orderBy('c.created_at', 'DESC')
      .limit(request.take)
      .offset(request.skip)
      .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }

  updateEntity(id: number, data: any): CategoryEntity {
    const { name, description } = data;
    const entity = new CategoryEntity();
    entity.name = name;
    entity.description = description;
    return entity;
  }
}
