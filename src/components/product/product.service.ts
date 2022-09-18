import { CategoryRepositoryInterface } from '@components/category/interface/category.repository.interface';
import { ColorRepositoryInterface } from '@components/color/interface/color.repository.interface';
import { SizeRepositoryInterface } from '@components/size/interface/size.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ApiError } from '@utils/api.error';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { first, uniq } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { Connection, In } from 'typeorm';
import { ListProductQuery } from './dto/query/list-product.query';
import { CreateProductRequest } from './dto/request/create-product.request';
import { UpdateProductRequest } from './dto/request/update-product.request';
import { DetailProductResponse } from './dto/response/detail-product.response';
import { ListProductResponse } from './dto/response/list-product.response';
import { ProductImageRepositoryInterface } from './interface/product-image.repository.interface';
import { ProductVersionRepositoryInterface } from './interface/product-version.repository.interface';
import { ProductRepositoryInterface } from './interface/product.repository.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,

    @Inject('ProductImageRepositoryInterface')
    private readonly productImageRepository: ProductImageRepositoryInterface,

    @Inject('ProductVersionRepositoryInterface')
    private readonly productVersionRepository: ProductVersionRepositoryInterface,

    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,

    @Inject('ColorRepositoryInterface')
    private readonly colorRepository: ColorRepositoryInterface,

    @Inject('SizeRepositoryInterface')
    private readonly sizeRepository: SizeRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {}

  async createProduct(
    request: CreateProductRequest,
    files: any,
  ): Promise<ResponsePayload<any>> {
    try {
      const colorIds = [];
      const sizeIds = [];
      request.productVersions.map((e) => {
        colorIds.push(e.colorId);
        sizeIds.push(e.sizeId);
      });

      const category = await this.categoryRepository.findOneById(
        request.categoryId,
      );
      if (!category) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const colors = await this.colorRepository.findByCondition({
        id: In(colorIds),
      });

      if (colors.length !== uniq(colorIds).length) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const sizes = await this.sizeRepository.findByCondition({
        id: In(sizeIds),
      });

      if (sizes.length !== uniq(sizeIds).length) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const productEntity = this.productRepository.createEntity(request);
        const product = await this.productRepository.create(productEntity);
        const productVersionEntities = request.productVersions.map((e) =>
          this.productVersionRepository.createProductVersion(
            product.id,
            e.sizeId,
            e.colorId,
            e.quantity,
          ),
        );
        await queryRunner.manager.save(productVersionEntities);
        const productImageEntities = files.map((file) =>
          this.productImageRepository.createProductImage(
            product.id,
            file.filename,
          ),
        );
        await queryRunner.manager.save(productImageEntities);

        await queryRunner.commitTransaction();
      } catch (error) {
        console.log('error', error);
        await queryRunner.rollbackTransaction();
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
          .build();
      } finally {
        await queryRunner.release();
      }
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      console.log('erorr', error);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async list(request: ListProductQuery): Promise<any> {
    const [data, count] = await this.productRepository.list(request);
    const dataReturn = plainToClass(ListProductResponse, data, {
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

  async detail(id: number): Promise<any> {
    const product = await this.productRepository.detail(id);
    if (!product) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailProductResponse, product, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async update(
    request: UpdateProductRequest,
    files: any,
  ): Promise<ResponsePayload<any>> {
    const product = await this.productRepository.findOneById(request.id);
    if (!product) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const colorIds = [];
    const sizeIds = [];

    request.productVersions.forEach((e) => {
      colorIds.push(e.colorId);
      sizeIds.push(e.sizeId);
    });

    const category = await this.categoryRepository.findOneById(
      request.categoryId,
    );
    if (!category) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const colors = await this.colorRepository.findByCondition({
      id: In(colorIds),
    });
    if (colors.length !== uniq(colorIds).length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const storages = await this.sizeRepository.findByCondition({
      id: In(sizeIds),
    });
    if (storages.length !== uniq(sizeIds).length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    for (const key in request) {
      if (key !== 'id' && key !== 'productVersions') {
        product[key] = request[key];
      }
    }

    const productVersionMap = new Map();
    const productVersionFlag = new Map();

    request.productVersions.forEach((e) => {
      productVersionMap.set(`${e.colorId}_${e.sizeId}`, e);
    });

    const productVersionExists =
      await this.productVersionRepository.findByCondition({
        productId: product.id,
      });

    const productVersionUpdate = [];
    const productVersionDelete = [];
    productVersionExists.forEach((e) => {
      productVersionFlag.set(`${e.colorId}_${e.sizeId}`, true);
      if (
        productVersionMap.get(`${e.colorId}_${e.sizeId}`) !== null ||
        productVersionMap.get(`${e.colorId}_${e.sizeId}`) !== undefined
      ) {
        productVersionUpdate.push(e);
      } else {
        productVersionDelete.push(e);
      }
    });

    const productImageExists =
      await this.productImageRepository.findByCondition({
        productId: product.id,
      });
    const imageRemoves = [];
    productImageExists.forEach((e) => {
      if (!request.keepImages.includes(e.url)) {
        imageRemoves.push(e);
      }
    });

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(productVersionUpdate);
      await queryRunner.manager.remove(productVersionDelete);

      const productVersionEntities = request.productVersions
        .map((e) => {
          if (!productVersionFlag.get(`${e.colorId}_${e.sizeId}`))
            return this.productVersionRepository.createProductVersion(
              product.id,
              e.sizeId,
              e.colorId,
              e.quantity,
            );
          return null;
        })
        .filter((e) => e !== null);
      await queryRunner.manager.save(productVersionEntities);

      await queryRunner.manager.save(product);

      await queryRunner.manager.remove(imageRemoves);

      const productImageEntities = files.map((file) =>
        this.productImageRepository.createProductImage(
          product.id,
          file.filename,
        ),
      );
      await queryRunner.manager.save(productImageEntities);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err.message)
        .build();
    } finally {
      await queryRunner.release();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async delete(request: DetailRequest): Promise<any> {
    const product = await this.productRepository.findOneById(request.id);
    if (!product) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    product.deletedAt = new Date();
    await this.productRepository.remove(product.id);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }
}
