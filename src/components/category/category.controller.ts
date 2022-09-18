import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { Public } from '@core/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { CategoryService } from './category.service';
import { GetCategoriesQuery } from './dto/query/get-categories.query';
import { CreateCategoryRequest } from './dto/request/create-category.request';
import { UpdateCategoryRequest } from './dto/request/update-category.request';
import { GetCategoriesResponse } from './dto/response/get-categories.response';
import { CategoryServiceInterface } from './interface/category.service.interface';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('CategoryServiceInterface')
    private readonly categoryService: CategoryServiceInterface,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(@Body() payload: CreateCategoryRequest) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.categoryService.createCategory(request);
  }
  @Public()
  @Get('')
  public async getList(
    @Query()
    payload: GetCategoriesQuery,
  ): Promise<ResponsePayload<GetCategoriesResponse | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.categoryService.getCategories(request);
  }

  @Public()
  @Get(':id')
  getCategory(@Param('id', new ParseIntPipe()) id: number) {
    return this.categoryService.getCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateCategory(
    @Body() payload: UpdateCategoryRequest,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.categoryService.updateCategory({
      id,
      ...request,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(
    @Param() payload: DetailRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.categoryService.delete(request);
  }
}
