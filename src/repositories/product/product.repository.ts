import { ListProductQuery } from '@components/product/dto/query/list-product.query';
import { CreateProductRequest } from '@components/product/dto/request/create-product.request';
import { ProductRepositoryInterface } from '@components/product/interface/product.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CategoryEntity } from '@entities/category/category.entity';
import { ColorEntity } from '@entities/color/color.entity';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { ProductImageEntity } from '@entities/product/product-image.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { ProductEntity } from '@entities/product/product.entity';
import { SizeEntity } from '@entities/size/size.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeCharForSearch } from '@utils/common';
import { DetailRequest } from '@utils/detail.request';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository
  extends BaseAbstractRepository<ProductEntity>
  implements ProductRepositoryInterface
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super(productRepository);
  }

  public createEntity(request: CreateProductRequest): ProductEntity {
    const entity = new ProductEntity();
    entity.name = request.name;
    entity.categoryId = request.categoryId;
    entity.description = request.description;
    entity.tag = request.tag;
    entity.price = request.price;
    entity.salePrice = request.salePrice;
    return entity;
  }

  async detail(id: number): Promise<any> {
    return await this.productRepository
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.category_id AS categoryId',
        'p.description AS description',
        'p.slug AS slug',
        'p.price AS price',
        'p.tag AS tag',
        'p.sell AS sell',
        'p.sale_price AS "salePrice"',
        'p.created_at AS "createdAt"',
        'p.updated_at AS "updatedAt"',
        `JSON_BUILD_OBJECT('id', c.id , 'name', c.name,'slug', c.slug) AS category`,
        `CASE WHEN COUNT(qb1) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'id', qb1.id, 'url', qb1.url
      )) END AS "productImages"`,
        `CASE WHEN COUNT(qb2) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'id', qb2.id,'color', qb2.color, 'size', qb2.size
      )) END AS "productVersions"`,
      ])
      .leftJoin(
        (qb) =>
          qb
            .select([
              'pi.id AS id',
              'pi.product_id AS product_id',
              'pi.url AS url',
            ])
            .from(ProductImageEntity, 'pi')
            .where('pi.product_id = :id', { id }),
        'qb1',
        'qb1.product_id = p.id',
      )
      .leftJoin(
        (qb) =>
          qb
            .select([
              'pv.id AS id',
              'pv.product_id AS product_id',
              `JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS color`,
              `JSON_BUILD_OBJECT('id', s.id, 'name', s.name) AS size`,
            ])
            .from(ProductVersionEntity, 'pv')
            .leftJoin(ColorEntity, 'c', 'c.id = pv.color_id')
            .leftJoin(SizeEntity, 's', 's.id = pv.size_id')
            .where('pv.product_id = :id', { id }),
        'qb2',
        'qb2.product_id = p.id',
      )
      .innerJoin(CategoryEntity, 'c', 'c.id = p.category_id')
      .where('p.id = :id', { id })
      .groupBy('p.id')
      .addGroupBy('c.id')
      .getRawOne();
  }

  public async list(request: ListProductQuery): Promise<any> {
    let query = this.productRepository
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.category_id AS categoryId',
        'p.description AS description',
        'p.slug AS slug',
        'p.price AS price',
        'p.tag AS tag',
        'p.sell AS sell',
        'p.sale_price AS "salePrice"',
        'p.created_at AS createdAt',
        'p.updated_at AS updatedAt',
        `CASE WHEN COUNT(qb1) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'id', qb1.id, 'url', qb1.url
        )) END AS "productImages"`,
        `JSON_BUILD_OBJECT('id', c.id , 'name', c.name) AS category`,
        `CASE WHEN COUNT(qb2) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'id', qb2.id,'color', qb2.color, 'size', qb2.size
        )) END AS "productVersions"`,
      ])
      .leftJoin(
        (qb) =>
          qb
            .select([
              'pi.id AS id',
              'pi.product_id AS product_id',
              'pi.url AS url',
            ])
            .from(ProductImageEntity, 'pi'),
        'qb1',
        'qb1.product_id = p.id',
      )
      .innerJoin(
        (qb) => {
          qb.select([
            'pv.id AS id',
            'pv.product_id AS product_id',
            `JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS color`,
            `JSON_BUILD_OBJECT('id', s.id, 'name', s.name) AS size`,
          ])
            .from(ProductVersionEntity, 'pv')
            .innerJoin(ColorEntity, 'c', 'c.id = pv.color_id')
            .innerJoin(SizeEntity, 's', 's.id = pv.size_id');
          if (request.sizeId) {
            qb.andWhere('s.id = :sizeId', { sizeId: request.sizeId });
          }

          if (request.price) {
            switch (request.price) {
              case 1:
                qb.andWhere('p.sale_price < :price', { price: 3000000 });
                break;
              case 2:
                qb.andWhere('p.sale_price >= :priceFrom', {
                  priceFrom: 3000000,
                }).andWhere('p.sale_price < :priceTo', { priceTo: 6000000 });
                break;
              case 3:
                qb.andWhere('p.sale_price >= :priceFrom', {
                  priceFrom: 6000000,
                }).andWhere('p.sale_price < :priceTo', { priceTo: 9000000 });
                break;
              case 4:
                qb.andWhere('p.sale_price >= :priceFrom', {
                  priceFrom: 9000000,
                }).andWhere('p.sale_price < :priceTo', { priceTo: 12000000 });
                break;
              case 5:
                qb.andWhere('p.sale_price > :price', { price: 12000000 });
                break;

              default:
                break;
            }
          }
          return qb;
        },
        'qb2',
        'qb2.product_id = p.id',
      )
      .innerJoin(CategoryEntity, 'c', 'c.id = p.category_id')
      .where('p.deleted_at IS NULL');

    if (request.keyword) {
      query.andWhere(
        `LOWER(unaccent("p"."name")) LIKE LOWER(unaccent(:name)) ESCAPE '\\'`,
        {
          name: `%${escapeCharForSearch(request.keyword)}%`,
        },
      );
    }

    if (request.categoryId) {
      query.andWhere('p.category_id = :categoryId', {
        categoryId: request.categoryId,
      });
    } else {
      query.orderBy('p.created_at', 'DESC');
    }

    if (request.orderPrice) {
      query.orderBy('p.sale_price', request.orderPrice === 1 ? 'ASC' : 'DESC');
    } else if (request?.orderSell) {
      query.orderBy('p.sell', request.orderSell === 1 ? 'ASC' : 'DESC');
    } else {
      query.orderBy('p.created_at', 'DESC');
    }

    const data = await query
      .addGroupBy('p.id')
      .addGroupBy('c.id')
      .limit(request.take)
      .offset(request.skip)
      .getRawMany();
    const count = await query.getCount();

    return [data, count];
  }

  // public updateView(id: number): Promise<any> {
  //   return this.productRepository
  //     .createQueryBuilder()
  //     .where('id = :id', { id })
  //     .update()
  //     .set({
  //       view: () => 'view + 1',
  //     })
  //     .execute();
  // }
}
