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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DetailRequest } from '@utils/detail.request';
import { isEmpty } from 'lodash';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ListProductQuery } from './dto/query/list-product.query';
import { CreateProductRequest } from './dto/request/create-product.request';
import {
  UpdateProductBodyDto,
  UpdateProductRequest,
} from './dto/request/update-product.request';
import { ProductServiceInterface } from './interface/product.service.interface';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('ProductServiceInterface')
    private readonly productService: ProductServiceInterface,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: async (req, file, cb) => {
          console.log('file', file);
          const filename: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${Date.now()}${extension}`);
        },
      }),
    }),
  )
  createProduct(@Body() payload: CreateProductRequest, @UploadedFiles() files) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.productService.createProduct(request, files);
  }

  @Public()
  @Get('/list')
  list(@Query() query: ListProductQuery) {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.productService.list(request);
  }

  @Public()
  @Get('/:id')
  detail(@Param('id') id: number) {
    return this.productService.detail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: async (req, file, cb) => {
          console.log('file', file);

          const filename: string = path
            .parse(file.originalname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${Date.now()}${extension}`);
        },
      }),
    }),
  )
  update(
    @Body() body: UpdateProductBodyDto,
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFiles() files: any,
  ) {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.productService.update({ ...request, id }, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param() param: DetailRequest) {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.productService.delete(request);
  }
}
