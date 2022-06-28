import { CategoryEntity } from '@entities/category/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '@repositories/category/category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'CategoryServiceInterface',
      useClass: CategoryService,
    },
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
  ],
})
export class CategoryModule {}
