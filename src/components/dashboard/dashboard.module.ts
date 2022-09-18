import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user/user.entity';
import { OrderEntity } from '@entities/order/order.entity';
import { ProductVersionEntity } from '@entities/product/product-version.entity';
import { UserRepository } from '@repositories/user/user.repository';
import { OrderRepository } from '@repositories/order/order.repository';
import { ProductVersionRepository } from '@repositories/product/product-version.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OrderEntity, ProductVersionEntity]),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'ProductVersionRepositoryInterface',
      useClass: ProductVersionRepository,
    },
  ],
})
export class DashboardModule {}
