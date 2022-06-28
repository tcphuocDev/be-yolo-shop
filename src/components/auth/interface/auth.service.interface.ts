import { GetTokenRequest } from '../dto/request/get-token.request';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserLoginRequest } from '../dto/request/user-login.request';
import { UserRegisterRequest } from '../dto/request/user-register.request.dto';

export interface AuthServiceInterface {
  validateUser(id: number): Promise<any>;
  register(request: UserRegisterRequest): Promise<any>;
  login(request: UserLoginRequest): Promise<any>;
  getToken(request: GetTokenRequest): Promise<any>;
  getProfile(request: any);
  update(request: UpdateUserRequestDto, req: any): Promise<any>;
  updatePassword(request: UpdateUserRequestDto, req: any): Promise<any>;
}
