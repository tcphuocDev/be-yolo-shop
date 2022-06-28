import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsInt } from 'class-validator';
import { CreateCategoryRequest } from './create-category.request';

export class UpdateCategoryRequest extends CreateCategoryRequest {}
