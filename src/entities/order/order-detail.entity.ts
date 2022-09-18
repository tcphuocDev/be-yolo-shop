import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('order_details')
export class OrderDetailEntity {
  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productVersionId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
