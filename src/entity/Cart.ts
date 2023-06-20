import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, DeepPartial } from 'typeorm';
import {Product} from './product';
import { User } from './User';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  quantity: number;
  @ManyToOne(() => User, user => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;
  @ManyToOne(() => Product, product => product.cart)
  @JoinColumn({ name: 'productId' })
  product: Product;
  @Column({ nullable: true })
  userId: number;
  @Column({ nullable: true })
  productName: string;
  @Column({ nullable: true })
  productPrice: number;
  @Column({ nullable: true })
  productImage: string;
    productId: number;
}