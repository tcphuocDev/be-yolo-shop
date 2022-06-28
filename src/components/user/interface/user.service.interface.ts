import { DetailRequest } from '@utils/detail.request';
import { UserRequest } from '@utils/user.request';
import { ListUserQueryRequestDto } from '../dto/query/list-user.request.dto';
import { UpdateUserRequestDto } from '../dto/request/update-role.request.dto';

export interface UserServiceInterface {
  getList(request: ListUserQueryRequestDto): Promise<any>;
  update(
    request: UpdateUserRequestDto & DetailRequest,
    currentUser: UserRequest,
  ): Promise<any>;
}
