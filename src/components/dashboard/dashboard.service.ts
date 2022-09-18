import { OrderRepositoryInterface } from '@components/order/interface/order.repository.interface';
import { OrderStatusEnum } from '@components/order/order.constants';
import { ProductVersionRepositoryInterface } from '@components/product/interface/product-version.repository.interface';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { UserStatusEnum } from '@components/user/user.constants';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
import * as moment from 'moment-timezone';
import { DateRangeQuery } from './dto/query/date-range.query';
import { Between } from 'typeorm';

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,

    @Inject('ProductVersionRepositoryInterface')
    private readonly productVersionRepository: ProductVersionRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  async list(): Promise<ResponsePayload<any>> {
    const [countUser, countOrder, sumMoney, stockQuantity] = await Promise.all([
      this.userRepository.count({
        isActive: UserStatusEnum.Active,
      }),
      this.orderRepository.count({
        status: OrderStatusEnum.SUCCESS,
      }),
      this.orderRepository.sumMoney(),
      this.productVersionRepository.countQuantity(),
    ]);

    return new ResponseBuilder({
      countUser,
      countOrder,
      sumMoney: sumMoney?.reduce((total, e) => total + Number(e.price), 0) || 0,
      stockQuantity: +stockQuantity?.quantity || 0,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async customer(): Promise<ResponsePayload<any>> {
    const users = await this.userRepository.dashboardUser();

    return new ResponseBuilder({
      users,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async orderStatus(request: DateRangeQuery): Promise<ResponsePayload<any>> {
    try {
      const data = await this.orderRepository.findByCondition({
        updatedAt: Between(
          moment(request.startDate).startOf('day').toDate(),
          moment(request.endDate).endOf('day').toDate(),
        ),
      });
      const listRangeDate = [];
      const from = moment(request.startDate)
        .tz('Asia/Ho_Chi_Minh')
        .startOf('day');
      const to = moment(request.endDate).tz('Asia/Ho_Chi_Minh').endOf('day');

      for (
        let date = from.clone();
        date.isSameOrBefore(to, 'day');
        date = date.clone().add(1, 'day')
      ) {
        listRangeDate.push(date.clone().format('DD/MM/YYYY'));
      }
      const dataReturn = [];
      listRangeDate.forEach((e) => {
        const orders = data.filter(
          (order) =>
            moment(order.updatedAt)
              .tz('Asia/Ho_Chi_Minh')
              .format('DD/MM/YYYY') === e,
        );

        const count = {
          INCART: 0,
          WAITING_CONFIRM: 0,
          CONFIRMED: 0,
          SHIPPING: 0,
          RECEIVED: 0,
          SUCCESS: 0,
          REJECT: 0,
        };

        orders.forEach((order) => {
          switch (order.status) {
            case OrderStatusEnum.INCART:
              count.INCART++;
              break;
            case OrderStatusEnum.WAITING_CONFIRM:
              count.WAITING_CONFIRM++;
              break;
            case OrderStatusEnum.CONFIRMED:
              count.CONFIRMED++;
              break;
            case OrderStatusEnum.SHIPPING:
              count.SHIPPING++;
              break;
            case OrderStatusEnum.RECEIVED:
              count.RECEIVED++;
              break;
            case OrderStatusEnum.SUCCESS:
              count.SUCCESS++;
              break;
            case OrderStatusEnum.REJECT:
              count.REJECT++;
              break;

            default:
              break;
          }
        });

        dataReturn.push({
          date: e,
          count,
        });
      });

      return new ResponseBuilder({ items: dataReturn })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('message.BAD_REQUEST'))
        .build();
    }
  }

  async dashboardMoney(request: DateRangeQuery): Promise<ResponsePayload<any>> {
    try {
      const data = await this.orderRepository.dashboardMoney(
        request.startDate,
        request.endDate,
      );
      const listRangeDate = [];
      const from = moment(request.startDate)
        .tz('Asia/Ho_Chi_Minh')
        .startOf('day');

      const to = moment(request.endDate).tz('Asia/Ho_Chi_Minh').endOf('day');

      for (
        let date = from.clone();
        date.isSameOrBefore(to, 'day');
        date = date.clone().add(1, 'day')
      ) {
        listRangeDate.push(date.clone().format('DD/MM/YYYY'));
      }
      const dataReturn = [];
      listRangeDate.forEach((e) => {
        const orders = data.filter(
          (order) =>
            moment(order.updatedAt)
              .tz('Asia/Ho_Chi_Minh')
              .format('DD/MM/YYYY') === e,
        );

        const count = {
          SUCCESS: 0,
        };

        orders.forEach((order) => {
          switch (order.status) {
            case OrderStatusEnum.SUCCESS:
              count.SUCCESS += Number(order.price);
              break;
            default:
              break;
          }
        });

        dataReturn.push({
          date: e,
          count,
        });
      });

      return new ResponseBuilder({ items: dataReturn })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('message.BAD_REQUEST'))
        .build();
    }
  }
}
