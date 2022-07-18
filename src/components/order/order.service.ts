import { AddressRepositoryInterface } from '@components/address/interface/address.repository.interface';
import { ProductVersionRepositoryInterface } from '@components/product/interface/product-version.repository.interface';
import { ProductRepositoryInterface } from '@components/product/interface/product.repository.interface';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { ProductEntity } from '@entities/product/product.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ApiError } from '@utils/api.error';
import { DetailRequest } from '@utils/detail.request';
import { IsMeQuery } from '@utils/is-me.query';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { UserRequest } from '@utils/user.request';
import { plainToClass } from 'class-transformer';
import { first, map, uniq } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { Connection, In } from 'typeorm';
import { ListOrderQuery } from './dto/query/list-order.query';
import { ChangeStatusRequest } from './dto/request/change-status.request';
import { CheckoutOrderRequest } from './dto/request/checkout-order.request';
import { CreateOrderRequest } from './dto/request/create-order.request';
import { UpdateOrderRequest } from './dto/request/update-order.request';
import { DetailOrderResoponse } from './dto/response/detail-order.response';
import { OrderDetailRepositoryInterface } from './interface/order-detail.repository.interface';
import { OrderRepositoryInterface } from './interface/order.repository.interface';
import { OrderStatusEnum } from './order.constants';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,

    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,

    @Inject('AddressRepositoryInterface')
    private readonly addressRepository: AddressRepositoryInterface,

    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,

    @Inject('ProductVersionRepositoryInterface')
    private readonly productVersionRepository: ProductVersionRepositoryInterface,

    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(request: CreateOrderRequest, user: UserRequest): Promise<any> {
    const myOrderInCart = await this.orderRepository.findOneByCondition({
      userId: user.id,
      status: OrderStatusEnum.INCART,
    });
    console.log(myOrderInCart);

    if (myOrderInCart) {
      return await this.update({ ...request, id: myOrderInCart.id }, user);
    }
    const productVersionIds = request.products.map((item) => {
      return item.productVersionId;
    });
    console.log(productVersionIds);
    const productVersions = await this.productVersionRepository.findByCondition(
      {
        id: In(productVersionIds),
      },
    );

    if (productVersionIds.length !== productVersions.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    const orderEntity = this.orderRepository.createOrder(user.id, request);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.save(orderEntity);
      const orderDetailEntities = request.products.map((item: any) =>
        this.orderDetailRepository.createOrderDetail({
          productVersionId: item.productVersionId,
          orderId: order.id,
          quantity: item.quantity,
          price: item.price,
        }),
      );
      await queryRunner.manager.save(orderDetailEntities);
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData({ order })
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err.message)
        .build();
    } finally {
      await queryRunner.release();
    }
  }
  async update(
    request: UpdateOrderRequest,
    user: UserRequest,
  ): Promise<ResponsePayload<any>> {
    const myOrderInCart = await this.orderRepository.findOneByCondition({
      userId: user.id,
      status: OrderStatusEnum.INCART,
    });
    const myOrderDetailInCart =
      await this.orderDetailRepository.findByCondition({
        orderId: myOrderInCart.id,
      });

    const productVersionIds = request.products.map(
      (item) => item.productVersionId,
    );
    const productVersions = await this.productVersionRepository.findByCondition(
      {
        id: In(productVersionIds),
      },
    );

    if (productVersionIds.length !== productVersions.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('message.SUCCESS'),
      ).toResponse();
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderDetailEntities = request.products.map((item) =>
        this.orderDetailRepository.createOrderDetail({
          productVersionId: item.productVersionId,
          orderId: myOrderInCart.id,
          quantity: item.quantity,
        }),
      );

      await queryRunner.manager.remove(myOrderDetailInCart);
      await queryRunner.manager.save(orderDetailEntities);

      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err.message)
        .build();
    } finally {
      await queryRunner.release();
    }
  }
  async detail(
    id: number,
    request: IsMeQuery,
    user: UserRequest,
  ): Promise<ResponsePayload<any>> {
    const order = await this.orderRepository.detail(id, request, user.id);
    if (!order) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailOrderResoponse, order, {
      excludeExtraneousValues: true,
    });

    console.log('data', dataReturn);

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async list(request: ListOrderQuery, user: UserRequest): Promise<any> {
    const [data, count] = await this.orderRepository.list(request, user.id);

    const dataReturn = plainToClass(DetailOrderResoponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: {
        total: count,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  //Change status

  async changeStatus(
    request: ChangeStatusRequest,
    id: number,
  ): Promise<ResponsePayload<any>> {
    const order = await this.orderRepository.findOneById(id);
    console.log(order);

    if (!order) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    let flag = true;
    let isReject = false;
    let isSuccess = false;
    switch (request.status) {
      case OrderStatusEnum.CONFIRMED:
        if (order.status === OrderStatusEnum.WAITING_CONFIRM)
          order.status = OrderStatusEnum.CONFIRMED;
        else flag = false;
        break;
      case OrderStatusEnum.SHIPPING:
        if (order.status === OrderStatusEnum.CONFIRMED)
          order.status = OrderStatusEnum.SHIPPING;
        else flag = false;
        break;
      case OrderStatusEnum.RECEIVED:
        if (order.status === OrderStatusEnum.SHIPPING)
          order.status = OrderStatusEnum.RECEIVED;
        else flag = false;
        break;
      case OrderStatusEnum.SUCCESS:
        if (order.status === OrderStatusEnum.RECEIVED) {
          order.status = OrderStatusEnum.SUCCESS;
          isSuccess = true;
        } else flag = false;
        break;
      case OrderStatusEnum.REJECT:
        if (
          [
            OrderStatusEnum.WAITING_CONFIRM,
            OrderStatusEnum.CONFIRMED,
            OrderStatusEnum.SHIPPING,
          ].includes(order.status)
        )
          isReject = true;
        else flag = false;
        break;

      default:
        break;
    }

    if (!flag) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.INVALID_STATUS'),
      ).toResponse();
    }

    let productVersions = [];
    if (isReject) {
      const orderDetails = await this.orderDetailRepository.findByCondition({
        orderId: order.id,
      });

      const orderDetailMap = new Map();
      const productVersionIds = [];
      orderDetails.forEach((e) => {
        productVersionIds.push(e.productVersionId);
        orderDetailMap.set(e.productVersionId, e.quantity);
      });

      productVersions = await this.productVersionRepository.findByCondition({
        id: In(productVersionIds),
      });

      productVersions.forEach((e) => {
        e.quantity = e.quantity + orderDetailMap.get(e.id) || 0;
      });

      order.status = OrderStatusEnum.REJECT;
    }
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(order);
      if (productVersions.length)
        await queryRunner.manager.save(productVersions);
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err.message)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  // Checkout

  async checkout(
    request: CheckoutOrderRequest,
    user: UserRequest,
  ): Promise<any> {
    console.log(request.id);
    console.log(OrderStatusEnum.INCART);

    const myOrderInCart = await this.orderRepository.findOneByCondition({
      userId: user.id,
      status: OrderStatusEnum.INCART,
      id: request.id,
    });
    if (!myOrderInCart) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const myOrderDetailInCarts =
      await this.orderDetailRepository.findByCondition({
        orderId: myOrderInCart.id,
      });

    const productVersionIds =
      myOrderDetailInCarts.map((e) => e.productVersionId) || [];

    const productVersions = await this.productVersionRepository.findByCondition(
      {
        id: In(productVersionIds),
      },
    );

    if (productVersionIds.length !== productVersions.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PRODUCT_VERSION_NOT_FOUND'),
      ).toResponse();
    }

    const productVersionMap = new Map();
    const productVersionInCartMap = new Map();
    const productQuantityInvalid = [];

    myOrderDetailInCarts.forEach((e) => {
      productVersionInCartMap.set(e.productVersionId, e.quantity);
    });

    productVersions.forEach((productVersion) => {
      productVersionMap.set(productVersion.id, productVersion);
      productVersion.quantity =
        productVersion.quantity -
          productVersionInCartMap.get(productVersion.id) || 0;
      if (productVersion.quantity < 0) {
        productQuantityInvalid.push(productVersion.id);
      }
    });

    if (productQuantityInvalid.length) {
      return new ResponseBuilder({
        items: productQuantityInvalid,
      })
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INVALID_QUANTITY'))
        .build();
    }
    // const currentUserAddress = await this.addressRepository.findOneByCondition({
    //   userId: user.id,
    // });

    // if (!currentUserAddress) {
    //   return new ApiError(
    //     ResponseCodeEnum.BAD_REQUEST,
    //     await this.i18n.translate('error.INVALID_ADDRESS'),
    //   ).toResponse();
    // }

    // myOrderInCart.address = currentUserAddress.address;
    myOrderInCart.phone = user.phone;

    myOrderDetailInCarts.forEach((e) => {
      productVersionMap.get(e.productVersionId).salePrice ||
        productVersionMap.get(e.productVersionId).price;
    });

    myOrderInCart.status = OrderStatusEnum.WAITING_CONFIRM;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(myOrderInCart);
      await queryRunner.manager.save(myOrderDetailInCarts);
      await queryRunner.manager.save(productVersions);

      await queryRunner.commitTransaction();
      return new ResponseBuilder(myOrderInCart)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(err.message)
        .build();
    } finally {
      await queryRunner.release();
    }
  }
}
