import { convertToSlug } from 'src/constants/common';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column()
  sell: number;

  @Column()
  tag: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  @Column()
  price: number;

  @Column()
  salePrice: number;

  @BeforeInsert()
  @BeforeUpdate()
  convertToSlug() {
    this.slug = convertToSlug(this.name);
  }
}
