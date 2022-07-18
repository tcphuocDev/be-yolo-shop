import { CouponEntity } from '@entities/coupons/coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponRepository } from '@repositories/coupon/coupon.repository';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([CouponEntity])],
  controllers: [CouponController],
  providers: [
    {
      provide: 'CouponServiceInterface',
      useClass: CouponService,
    },
    {
      provide: 'CouponRepositoryInterface',
      useClass: CouponRepository,
    },
  ],
})
export class CouponModule {}
