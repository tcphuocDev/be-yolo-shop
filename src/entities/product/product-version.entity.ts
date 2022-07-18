import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_versions')
export class ProductVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  sizeId: number;

  @Column()
  colorId: number;

  @Column()
  quantity: number;
}
