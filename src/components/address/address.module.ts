import { AddressEntity } from '@entities/address/address.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from '@repositories/address/address.repository';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [
    {
      provide: 'AddressServiceInterface',
      useClass: AddressService,
    },
    {
      provide: 'AddressRepositoryInterface',
      useClass: AddressRepository,
    },
  ],
})
export class AddressModule {}
