import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UserEntity } from '@entities/user/user.entity';
import { ResponsePayload } from '@utils/response-payload';
import { ListUserQueryRequestDto } from '../dto/query/list-user.request.dto';

export interface UserRepositoryInterface
  extends BaseAbstractRepository<UserEntity> {
  getList(request: ListUserQueryRequestDto): Promise<any>;
  createEntityPublic(
    phone: string,
    fullname: string,
    gender: number,
    email: string,
  ): UserEntity;
  dashboardUser(): Promise<any>;
}
