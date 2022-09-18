import { UserRegisterRequest } from '@components/auth/dto/request/user-register.request.dto';
import { OrderStatusEnum } from '@components/order/order.constants';
import { ListUserQueryRequestDto } from '@components/user/dto/query/list-user.request.dto';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { OrderEntity } from '@entities/order/order.entity';
import { UserEntity } from '@entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeCharForSearch } from '@utils/common';
import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  public createEntity(request: UserRegisterRequest): UserEntity {
    const user = new UserEntity();
    user.phone = request.phone;
    user.email = request.email;
    user.fullname = request.fullname;
    user.gender = request.gender;
    user.password = request.password;
    return user;
  }

  public createEntityPublic(
    phone: string,
    fullname: string,
    gender: number,
    email: string,
  ): UserEntity {
    const newEntity = new UserEntity();
    newEntity.phone = phone;
    newEntity.fullname = fullname;
    newEntity.gender = gender;
    newEntity.email = email;
    return newEntity;
  }

  public async getList(
    request: ListUserQueryRequestDto,
  ): Promise<[any[], number]> {
    const { skip, take, keyword, sort, filter } = request;
    let query = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.phone AS phone',
        'u.email AS email',
        'u.fullname AS fullname',
        'u.gender AS gender',
        'u.role AS role',
        'u.is_active AS "isActive"',
        'u.created_at AS "createdAt"',
        'u.updated_at AS "updatedAt"',
      ]);

    if (!isEmpty(keyword)) {
      query
        .orWhere(`lower("u"."email") like lower(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere('lower("u"."fullname") like lower(:pkeyWord)', {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        });
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'fullname':
            query.andWhere(
              `lower("u"."fullname") like lower(:fullname) escape '\\'`,
              {
                fullname: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
        }
      });
    }
    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'username':
            query = query.orderBy('"u"."username"', item.order);
            break;
          case 'fullName':
            query = query.orderBy('"u"."full_name"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query.orderBy('u.id', 'DESC');
    }

    const data = await query
      .orderBy('u.id', 'DESC')
      .limit(request.take)
      .offset(request.skip)
      .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }

  public dashboardUser(): Promise<any> {
    return this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS user_id',
        'u.fullname AS fullname',
        'u.phone AS phone',
        'SUM(qb.money) AS money',
      ])
      .innerJoin(
        (qb) => {
          return qb
            .select([
              'o.user_id AS user_id',
              'SUM(od.quantity * od.price) AS money',
            ])
            .from(OrderEntity, 'o')
            .innerJoin(OrderDetailEntity, 'od', 'od.order_id = o.id')
            .where('o.status = :status', { status: OrderStatusEnum.SUCCESS })
            .groupBy('o.user_id');
        },
        'qb',
        'qb.user_id = u.id',
      )
      .groupBy('u.id')
      .getRawMany();
  }
}
