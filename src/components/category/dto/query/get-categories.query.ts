import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetCategoriesQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  id: number;

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  isGetAll: number;
}
