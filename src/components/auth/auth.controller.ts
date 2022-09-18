import { Public } from '@core/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { GetTokenRequest } from './dto/request/get-token.request';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserLoginRequest } from './dto/request/user-login.request';
import { UserRegisterRequest } from './dto/request/user-register.request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Public()
  @Post('register')
  public async register(@Body() payload: UserRegisterRequest): Promise<any> {
    const { request, responseError } = payload;
    return this.authService.register(request);
  }

  @Public()
  @Post('login')
  public async login(@Body() payload: UserLoginRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.authService.login(request);
  }

  @Public()
  @Post('token')
  public async getToken(@Body() payload: GetTokenRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.authService.getToken(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() request: any) {
    return this.authService.getProfile(request);
  }

  @Put('update')
  update(@Body() payload: UpdateUserRequestDto, @Request() req: any) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.authService.update(request, req.user);
  }
  @Put('update-pasword')
  updatePassword(
    @Body() payload: UpdatePasswordRequestDto,
    @Request() req: any,
  ) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.authService.updatePassword(request, req.user);
  }
}
