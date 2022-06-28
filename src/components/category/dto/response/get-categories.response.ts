import { Expose } from 'class-transformer';

export class GetCategoriesResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  slug: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
