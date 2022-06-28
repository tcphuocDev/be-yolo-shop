import { ColorEntity } from '@entities/color/color.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorRepository } from '@repositories/color/color.repository';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController],
  providers: [
    {
      provide: 'ColorRepositoryInterface',
      useClass: ColorRepository,
    },
    {
      provide: 'ColorServiceInterface',
      useClass: ColorService,
    },
  ],
})
export class ColorModule {}
