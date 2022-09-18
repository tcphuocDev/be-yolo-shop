import { ProductVersionRepositoryInterface } from '@components/product/interface/product-version.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVersionRepository
  extends BaseAbstractRepository<ProductVersionEntity>
  implements ProductVersionRepositoryInterface
{
  constructor(
    @InjectRepository(ProductVersionEntity)
    private readonly productVersionRepository: Repository<ProductVersionEntity>,
  ) {
    super(productVersionRepository);
  }

  public createProductVersion(
    productId: number,
    sizeId: number,
    colorId: number,
    quantity?: number,
  ): ProductVersionEntity {
    const entity = new ProductVersionEntity();
    entity.productId = productId;
    entity.sizeId = sizeId;
    entity.colorId = colorId;
    entity.quantity = quantity;
    return entity;
  }
  countQuantity(): Promise<any> {
    return this.productVersionRepository
      .createQueryBuilder('p')
      .select(['SUM(p.quantity) AS quantity'])
      .getRawOne();
  }

  getProductIdsByOrderId(orderId: number): Promise<any> {
    return this.productVersionRepository
      .createQueryBuilder('pr')
      .select(['pr.product_id AS "productId"', 'SUM(qb.quantity) AS quantity'])
      .innerJoin(
        (qb) =>
          qb
            .select([
              'od.product_version_id AS product_version_id',
              'od.quantity AS quantity',
            ])
            .from(OrderDetailEntity, 'od')
            .where('od.order_id = :orderId', { orderId }),
        'qb',
        'qb.product_version_id = pr.id',
      )
      .distinct(true)
      .groupBy('pr.product_id')
      .getRawMany();
  }
}
