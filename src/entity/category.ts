import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    image: string;
    @Column()
    subname: string;
    @OneToMany(() => Product, (Product) => Product.Category)
    Products: Product[]
}