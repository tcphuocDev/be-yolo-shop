import { ListColorQuery } from '@components/color/dto/query/list-color.query';
import { CreateColorRequest } from '@components/color/dto/request/create-color.request';
import { ColorRepositoryInterface } from '@components/color/interface/color.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ColorEntity } from '@entities/color/color.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsGetAll } from '@utils/common';
import { Repository } from 'typeorm';

@Injectable()
export class ColorRepository
  extends BaseAbstractRepository<ColorEntity>
  implements ColorRepositoryInterface
{
  constructor(
    @InjectRepository(ColorEntity)
    private readonly colorRepository: Repository<ColorEntity>,
  ) {
    super(colorRepository);
  }

  public createEntity(request: CreateColorRequest): ColorEntity {
    const newEntity = new ColorEntity();
    newEntity.name = request.name;
    return newEntity;
  }

  public async list(request: ListColorQuery): Promise<[any[], number]> {
    const query = this.colorRepository
      .createQueryBuilder('c')
      .select(['c.id AS id', 'c.name AS name', 'c.code AS code']);

    let data;
    if (request.request.isGetAll === IsGetAll.Yes)
      data = await query.orderBy('c.id', 'DESC').getRawMany();
    else
      data = await query
        .orderBy('c.id', 'DESC')
        .limit(request.request.take)
        .offset(request.request.skip)
        .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }
}
