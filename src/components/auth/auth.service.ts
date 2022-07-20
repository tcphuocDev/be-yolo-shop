import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@repositories/user/user.repository';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { GetTokenRequest } from './dto/request/get-token.request';
import { UserLoginRequest } from './dto/request/user-login.request';
import { UserRegisterRequest } from './dto/request/user-register.request.dto';
import { GetProfileResponse } from './dto/response/get-profile.response';
import { AuthServiceInterface } from './interface/auth.service.interface';
import * as jwt from 'jsonwebtoken';
import { UpdatePasswordRequestDto } from './dto/request/update-password.request.dto';
import { UserRequest } from '@utils/user.request';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import * as bcrypt from 'bcryptjs';
import { AddressRepository } from '@repositories/address/address.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('AddressRepositoryInterface')
    private readonly addressRepository: AddressRepository,

    private readonly jwtService: JwtService,

    private readonly i18n: I18nService,
  ) {}

  async register(request: UserRegisterRequest): Promise<any> {
    const userPhone = await this.userRepository.findOneByCondition({
      phone: request.phone,
    });

    if (userPhone) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.PHONE_EXIST'))
        .build();
    }

    const userEmail = await this.userRepository.findOneByCondition({
      email: request.email,
    });

    if (userEmail) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.EMAIL_EXIST'))
        .build();
    }

    const userEntity = this.userRepository.createEntity(request);
    const result = await this.userRepository.create(userEntity);
    return new ResponseBuilder({ result })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(
        await this.i18n.translate('message.defineUser.createSuccess'),
      )
      .build();
  }

  async validateUser(id: number): Promise<any> {
    const user = await this.userRepository.findOneById(id);
    if (user) {
      return user;
    }
    return null;
  }

  async login(request: UserLoginRequest) {
    const user = await this.userRepository.findOneByCondition({
      email: request.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (request.password) {
      const isMatch = user.comparePassword(request.password);

      if (!isMatch) {
        return new ResponseBuilder()
          .withMessage(await this.i18n.translate('error.INVALID_PASSWORD'))
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .build();
      }
    }

    const token = this.jwtService.sign({ id: user.id });
    const refreshToken = user.getRefreshToken();
    return new ResponseBuilder({ user, token, refreshToken })
      .withMessage(await this.i18n.translate('message.LOGIN_SUCCESSFULLY'))
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async getToken(request: GetTokenRequest) {
    try {
      const verify: any = jwt.verify(request.refreshToken, 'abcbacb');
      const token = this.jwtService.sign({ id: verify?.id });

      return new ResponseBuilder({ token })
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withMessage(await this.i18n.translate('error.INVALID_REFRESH_TOKEN'))
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .build();
    }
  }

  async getProfile(request: any) {
    const dataReturn = plainToClass(GetProfileResponse, request.user, {
      excludeExtraneousValues: true,
    });
    const user = await this.userRepository.findOneById(dataReturn.id);
    if (user.password) {
      dataReturn.isPassword = true;
    } else {
      dataReturn.isPassword = false;
    }
    dataReturn.addresses = await this.addressRepository.findByCondition({
      userId: dataReturn.id,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async update(request: UpdateUserRequestDto, user: UserRequest): Promise<any> {
    const currentUser = await this.userRepository.findOneById(user.id);
    currentUser.fullname = request.fullname;
    currentUser.gender = request.gender;
    const response = await this.userRepository.create(currentUser);
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(
        await this.i18n.translate('message.defineUser.updateSuccess'),
      )
      .build();
  }

  async updatePassword(request: UpdatePasswordRequestDto, user: UserRequest) {
    const currentUser = await this.userRepository.findOneById(user.id);

    const isMatch = currentUser.comparePassword(request.oldPassword);

    if (!isMatch) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.INVALID_PASSWORD'))
        .build();
    }

    const salt = bcrypt.genSaltSync(10);
    currentUser.password = bcrypt.hashSync(request.newPassword, salt);
    const response = await this.userRepository.create(currentUser);
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(
        await this.i18n.translate('message.defineUser.changePasswordSuccess'),
      )
      .build();
  }
}
