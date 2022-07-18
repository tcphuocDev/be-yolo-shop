import { ProductImageRepositoryInterface } from '@components/product/interface/product-image.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ProductImageEntity } from '@entities/product/product-image.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
export class ProductImageRepository
  extends BaseAbstractRepository<ProductImageEntity>
  implements ProductImageRepositoryInterface
{
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImgaeRepository: Repository<ProductImageEntity>,
  ) {
    super(productImgaeRepository);
  }
  public createProductImage(
    productId: number,
    url: string,
  ): ProductImageEntity {
    const entity = new ProductImageEntity();
    entity.productId = productId;
    entity.url = url;
    return entity;
  }
}
