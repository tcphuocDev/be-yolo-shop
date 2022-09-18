import { ListSizeQuery } from '@components/size/dto/query/list-size.request';
import { CreateSizeRequest } from '@components/size/dto/request/create-size.request';
import { SizeRepositoryInterface } from '@components/size/interface/size.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { SizeEntity } from '@entities/size/size.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsGetAll } from '@utils/common';
import { Repository } from 'typeorm';

@Injectable()
export class SizeRepository
  extends BaseAbstractRepository<SizeEntity>
  implements SizeRepositoryInterface
{
  constructor(
    @InjectRepository(SizeEntity)
    private readonly sizeRepository: Repository<SizeEntity>,
  ) {
    super(sizeRepository);
  }

  createEntity(request: CreateSizeRequest): SizeEntity {
    const size = new SizeEntity();
    size.name = request.name;
    return size;
  }

  public async list(request: ListSizeQuery): Promise<[any[], number]> {
    const query = this.sizeRepository
      .createQueryBuilder('s')
      .select([
        's.id AS id',
        's.name AS name',
      ]);

    let data;
    if (request.isGetAll === IsGetAll.Yes)
      data = await query.orderBy('s.id', 'DESC').getRawMany();
    else
      data = await query
        .orderBy('s.id', 'DESC')
        .limit(request.take)
        .offset(request.skip)
        .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }
}
