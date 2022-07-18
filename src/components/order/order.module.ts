import { AddressEntity } from '@entities/address/address.entity';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { OrderEntity } from '@entities/order/order.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { ProductEntity } from '@entities/product/product.entity';
import { UserEntity } from '@entities/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from '@repositories/address/address.repository';
import { OrderDetailRepository } from '@repositories/order/order-detail.repository';
import { OrderRepository } from '@repositories/order/order.repository';
import { ProductVersionRepository } from '@repositories/product/product-version.repository';
import { ProductRepository } from '@repositories/product/product.repository';
import { UserRepository } from '@repositories/user/user.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderDetailEntity,
      ProductVersionEntity,
      ProductEntity,
      AddressEntity,
      UserEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderServiceInterface',
      useClass: OrderService,
    },
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'OrderDetailRepositoryInterface',
      useClass: OrderDetailRepository,
    },
    {
      provide: 'ProductVersionRepositoryInterface',
      useClass: ProductVersionRepository,
    },
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'AddressRepositoryInterface',
      useClass: AddressRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
})
export class OrderModule {}
