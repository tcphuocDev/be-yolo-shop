import { ListOrderQuery } from '@components/order/dto/query/list-order.query';
import { DetailOrderResoponse } from '@components/order/dto/response/detail-order.response';
import { OrderRepositoryInterface } from '@components/order/interface/order.repository.interface';
import { IsMe, OrderStatusEnum } from '@components/order/order.constants';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ColorEntity } from '@entities/color/color.entity';
import { CouponEntity } from '@entities/coupons/coupons.entity';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { OrderEntity } from '@entities/order/order.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { ProductEntity } from '@entities/product/product.entity';
import { SizeEntity } from '@entities/size/size.entity';
import { UserEntity } from '@entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailRequest } from '@utils/detail.request';
import { IsMeQuery } from '@utils/is-me.query';
import { UserRequest } from '@utils/user.request';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository
  extends BaseAbstractRepository<OrderEntity>
  implements OrderRepositoryInterface
{
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {
    super(orderRepository);
  }
  createOrder(userId: number, data: any): OrderEntity {
    const { phone, address, status } = data;
    const newEntity = new OrderEntity();
    newEntity.userId = userId;
    newEntity.phone = phone;
    newEntity.address = address;
    // newEntity.couponId = coupon;
    newEntity.status = status ? status : OrderStatusEnum.INCART;
    return newEntity;
  }

  detail(id: number, request: IsMeQuery, userId: number): Promise<any> {
    const query = this.orderRepository
      .createQueryBuilder('o')
      .select([
        'o.id AS id',
        'o.status AS status',
        'o.address AS address',
        'o.phone AS "phone"',
        'o.created_at AS "createdAt"',
        'o.updated_at AS "updatedAt"',
        `JSON_BUILD_OBJECT('id', c.id, 'code', c.code, 'value', c.value) AS coupon`,
        `JSON_BUILD_OBJECT('id', u.id, 'fullname', u.fullname,'phone', u.phone) AS user`,
        `CASE WHEN COUNT(qb) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'productId', qb.product_id, 'productName', qb.product_name,
        'productVersionId', qb.product_version_id,
        'orderPrice', qb.order_price, 'salePrice', qb.sale_price,
        'quantity', qb.quantity, 'color', qb.color, 'size', qb.size
      )) END AS "orderDetails"`,
      ])
      .innerJoin(UserEntity, 'u', 'u.id = o.user_id')
      .leftJoin(CouponEntity, 'c', 'c.id = o.coupon_id')
      .innerJoin(
        (qb) =>
          qb
            .select([
              'od.product_version_id AS product_version_id',
              'od.quantity AS quantity',
              'p.name AS product_name',
              'p.id AS product_id',
              'od.price AS order_price',
              'p.sale_price AS sale_price',
              'p.price AS price',
              'od.order_id AS order_id',
              `JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS color`,
              `JSON_BUILD_OBJECT('id', s.id, 'name', s.name) AS size`,
            ])
            .from(OrderDetailEntity, 'od')
            .innerJoin(
              ProductVersionEntity,
              'pv',
              'pv.id = od.product_version_id',
            )
            .innerJoin(ProductEntity, 'p', 'p.id = pv.product_id')
            .leftJoin(ColorEntity, 'c', 'c.id = pv.color_id')
            .leftJoin(SizeEntity, 's', 's.id = pv.size_id')
            .where('od.order_id = :id', { id }),
        'qb',
        'qb.order_id = o.id',
      )
      .where('o.id = :id', { id });
    if (request.isMe === IsMe.Yes) {
      query.andWhere('o.user_id = :userId', { userId: userId });
    }
    return query
      .groupBy('o.id')
      .addGroupBy('c.id')
      .addGroupBy('u.id')
      .getRawOne();
  }

  async list(
    request: ListOrderQuery,
    userId: number,
  ): Promise<[any[], number]> {
    const query = this.orderRepository
      .createQueryBuilder('o')
      .select([
        'o.id AS id',
        'o.status AS status',
        'o.address AS address',
        'o.phone AS phone',
        'o.created_at AS "createdAt"',
        'o.updated_at AS "updatedAt"',
        `JSON_BUILD_OBJECT('id', c.id, 'code', c.code, 'value', c.value) AS coupon`,
        `JSON_BUILD_OBJECT('id', u.id, 'fullname', u.fullname,'phone', u.phone) AS user`,
        `CASE WHEN COUNT(qb) = 0 THEN '[]' ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'productId', qb.product_id, 'productName', qb.product_name,
        'productVersionId', qb.product_version_id,
        'orderPrice', qb.order_price, 'salePrice', qb.sale_price, 'price', qb.price,
        'quantity', qb.quantity, 'color', qb.color, 'size', qb.size
      )) END AS "orderDetails"`,
      ])
      .innerJoin(UserEntity, 'u', 'u.id = o.user_id')
      .leftJoin(CouponEntity, 'c', 'c.id = o.coupon_id')
      .innerJoin(
        (qb) =>
          qb
            .select([
              'od.product_version_id AS product_version_id',
              'od.quantity AS quantity',
              'p.name AS product_name',
              'od.price AS order_price',
              'p.id AS product_id',
              'p.sale_price AS sale_price',
              'p.price AS price',
              'od.order_id AS order_id',
              `JSON_BUILD_OBJECT('id', c.id, 'name', c.name) AS color`,
              `JSON_BUILD_OBJECT('id', s.id, 'name', s.name) AS size`,
            ])
            .from(OrderDetailEntity, 'od')
            .innerJoin(
              ProductVersionEntity,
              'pv',
              'pv.id = od.product_version_id',
            )
            .innerJoin(ProductEntity, 'p', 'p.id = pv.product_id')
            .leftJoin(ColorEntity, 'c', 'c.id = pv.color_id')
            .leftJoin(SizeEntity, 's', 's.id = pv.size_id'),
        'qb',
        'qb.order_id = o.id',
      )
      .where('o.status <> :status', { status: OrderStatusEnum.INCART })
      .groupBy('o.id')
      .addGroupBy('c.id')
      .addGroupBy('u.id');
    if (request.request.isMe === IsMe.Yes) {
      query.andWhere('o.user_id = :uid', { uid: userId });
    }
    const data = await query
      .orderBy('o.created_at', 'DESC')
      .limit(request.request.take)
      .offset(request.request.skip)
      .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }

  async detailByUserAndProduct(
    productId: number,
    userId: number,
  ): Promise<any> {
    return this.orderRepository
      .createQueryBuilder('o')
      .select(['o.id AS id'])
      .innerJoin(OrderDetailEntity, 'od', 'o.id = od.order_id')
      .innerJoin(ProductVersionEntity, 'pv', 'pv.id = od.product_version_id')
      .where('o.user_id = :userId', { userId })
      .andWhere('pv.product_id = :productId', { productId })
      .andWhere('o.status IN (:...status)', {
        status: [OrderStatusEnum.SUCCESS, OrderStatusEnum.RECEIVED],
      })
      .getRawOne();
  }

  async sumMoney() {
    return this.orderRepository
      .createQueryBuilder('o')
      .select([
        '(1 - 1.0*COALESCE(c.value, 0)/100)*SUM(od.quantity * od.price) AS price',
      ])
      .leftJoin(CouponEntity, 'c', 'o.coupon_id = c.id')
      .innerJoin(OrderDetailEntity, 'od', 'od.order_id = o.id')
      .where('o.status = :status', {
        status: OrderStatusEnum.SUCCESS,
      })
      .groupBy('c.value')
      .getRawMany();
  }

  dashboardMoney(startDate: Date, endDate: Date): Promise<any> {
    return (
      this.orderRepository
        .createQueryBuilder('o')
        .select([
          'o.id AS id',
          'o.status AS status',
          'o.updated_at AS "updatedAt"',
          'SUM(od.quantity * od.price) AS price',
        ])
        // .leftJoin(CouponEntity, 'c', 'o.coupon_id = c.id')
        .innerJoin(OrderDetailEntity, 'od', 'od.order_id = o.id')
        .where('o.updated_at::date >= :start', { start: startDate })
        .andWhere('o.updated_at::date <= :end', { end: endDate })
        .andWhere('o.status = :status', { status: OrderStatusEnum.SUCCESS })
        .groupBy('o.id')
        // .addGroupBy('c.value')
        .getRawMany()
    );
  }
}
