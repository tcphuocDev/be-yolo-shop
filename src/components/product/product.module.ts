import { CategoryEntity } from '@entities/category/category.entity';
import { ColorEntity } from '@entities/color/color.entity';
import { ProductImageEntity } from '@entities/product/product-image.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { ProductEntity } from '@entities/product/product.entity';
import { SizeEntity } from '@entities/size/size.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '@repositories/category/category.repository';
import { ColorRepository } from '@repositories/color/color.repository';
import { ProductImageRepository } from '@repositories/product/product-image.repository';
import { ProductVersionRepository } from '@repositories/product/product-version.repository';
import { ProductRepository } from '@repositories/product/product.repository';
import { SizeRepository } from '@repositories/size/size.repository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductVersionEntity,
      ColorEntity,
      SizeEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductServiceInterface',
      useClass: ProductService,
    },
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
    {
      provide: 'ColorRepositoryInterface',
      useClass: ColorRepository,
    },
    {
      provide: 'SizeRepositoryInterface',
      useClass: SizeRepository,
    },
    {
      provide: 'ProductImageRepositoryInterface',
      useClass: ProductImageRepository,
    },
    {
      provide: 'ProductVersionRepositoryInterface',
      useClass: ProductVersionRepository,
    },
  ],
})
export class ProductModule {}
