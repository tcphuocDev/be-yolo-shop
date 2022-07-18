import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ListProductQuery extends PaginationQuery {
  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  categoryId: number;

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  colorId: number;

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  sizeId: number;

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  price: number;

  // @IsInt()
  // @Transform(({ value }) => +value)
  // @IsOptional()
  // orderPrice: number;

  // @IsInt()
  // @Transform(({ value }) => +value)
  // @IsOptional()
  // orderView: number;

  // @IsInt()
  // @Transform(({ value }) => +value)
  // @IsOptional()
  // orderSell: number;
}
