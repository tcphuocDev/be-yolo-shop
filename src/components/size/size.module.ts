import { SizeEntity } from '@entities/size/size.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeRepository } from '@repositories/size/size.repository';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';

@Module({
  imports: [TypeOrmModule.forFeature([SizeEntity])],
  controllers: [SizeController],
  providers: [
    {
      provide: 'SizeServiceInterface',
      useClass: SizeService,
    },
    {
      provide: 'SizeRepositoryInterface',
      useClass: SizeRepository,
    },
  ],
})
export class SizeModule {}
