import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { Roles } from '@core/decorators/roles.decorator';
import { UserEntity } from '@entities/user/user.entity';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { RoleEnum } from 'src/constants/role.enum';
import { ListUserQueryRequestDto } from './dto/query/list-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-role.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserServiceInterface } from './interface/user.service.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}
  @Get('/list')
  public async getList(
    @Query()
    payload: ListUserQueryRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getList(request);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  public async update(
    @Param() param: DetailRequest,
    @Body() request: UpdateUserRequestDto,
    @Request() req: any,
  ) {
    const result = await this.userService.update(
      { ...request, ...param },
      req.user,
    );
    return result;
  }
}
