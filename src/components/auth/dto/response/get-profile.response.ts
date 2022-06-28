import { Expose } from 'class-transformer';

export class GetProfileResponse {
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
  addresses: any[];

  @Expose()
  isPassword: boolean;
}
