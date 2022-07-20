import { AddressService } from '@components/address/address.service';
import { UserModule } from '@components/user/user.module';
import { UserService } from '@components/user/user.service';
import { AddressEntity } from '@entities/address/address.entity';
import { UserEntity } from '@entities/user/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from '@repositories/address/address.repository';
import { UserRepository } from '@repositories/user/user.repository';
import { jwtConstants } from 'src/constants/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AddressEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'users',
      session: false,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'AddressRepositoryInterface',
      useClass: AddressRepository,
    },
    JwtStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
