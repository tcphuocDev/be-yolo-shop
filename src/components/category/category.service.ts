import { CategoryEntity } from '@entities/category/category.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '@repositories/category/category.repository';
import { ApiError } from '@utils/api.error';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { GetCategoriesQuery } from './dto/query/get-categories.query';
import { CreateCategoryRequest } from './dto/request/create-category.request';
import { GetCategoriesResponse } from './dto/response/get-categories.response';
import { CategoryRepositoryInterface } from './interface/category.repository.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  async createCategory(request: CreateCategoryRequest): Promise<any> {
    const categoryEntity = this.categoryRepository.createEntity(request);
    const category = await this.categoryRepository.create(categoryEntity);
    return new ResponseBuilder(category)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(
        await this.i18n.translate('message.defineCategory.createSuccess'),
      )
      .build();
  }

  async getCategories(
    request: GetCategoriesQuery,
  ): Promise<ResponsePayload<any>> {
    const [data, count] = await this.categoryRepository.getCategories(request);

    const dataReturn = plainToClass(GetCategoriesResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: {
        total: count,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async getCategory(id: number): Promise<any> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const dataReturn = plainToClass(GetCategoriesResponse, category, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async delete(id: number): Promise<any> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    try {
      await this.categoryRepository.remove(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_DELETE'),
      ).toResponse();
    }
  }

  public async updateCategory(request: any): Promise<any> {
    const category = await this.categoryRepository.findOneById(request.id);
    if (!category) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    category.name = request.name;
    category.description = request.description;

    const data = await this.categoryRepository.create(category);

    const response = plainToClass(GetCategoriesResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withMessage(await this.i18n.translate('message.define.updateSuccess'))
      .build();
  }
}
