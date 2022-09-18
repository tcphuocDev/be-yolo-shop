import { Expose, Type } from 'class-transformer';

export class BaseResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class Category extends BaseResponse {}

class Color extends BaseResponse {}

class Size extends BaseResponse {}

class ProductImage {
  @Expose()
  id: number;

  @Expose()
  url: string;
}

class ProductVersion {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  salePrice: number;

  @Type(() => Color)
  @Expose()
  color: Color;

  @Type(() => Size)
  @Expose()
  size: Size;

  @Expose()
  quantity: number;

  // @Expose()
  // productId: number;
}
export class ListProductResponse {
  @Expose()
  id: number;

  @Type(() => Category)
  @Expose()
  category: Category;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  salePrice: number;

  @Expose()
  tag: string;

  @Expose()
  sell: number;

  @Expose()
  slug: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => ProductVersion)
  @Expose()
  productVersions: ProductVersion[];

  @Type(() => ProductImage)
  @Expose()
  productImages: ProductImage[];
}
