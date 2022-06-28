import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  fullname: string;

  @Expose()
  gender: number;

  @Expose()
  role: number;

  @Expose()
  isActive: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
