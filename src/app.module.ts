import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { CoreModule } from '@core/core.module';
import { UserModule } from './components/user/user.module';
import * as connectionOptions from '@config/database.config';
import { AuthModule } from '@components/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@components/auth/guards/roles.guard';
import { ValidationPipe } from '@core/pipe/validation.pipe';
import { CategoryModule } from '@components/category/category.module';
import { ColorModule } from '@components/color/color.module';
import { SizeModule } from '@components/size/size.module';
import { ProductModule } from '@components/product/product.module';
import { CouponModule } from '@components/coupon/coupon.module';
import { AddressModule } from '@components/address/address.module';
import { OrderModule } from '@components/order/order.module';
import { DashboardModule } from '@components/dashboard/dashboard.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    CoreModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ColorModule,
    SizeModule,
    ProductModule,
    CouponModule,
    AddressModule,
    OrderModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
