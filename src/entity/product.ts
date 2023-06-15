import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category';


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    image: string;
    @Column()
    description: string;
    @Column()
    quantity: number;
    @Column()
    price: number;
    @ManyToOne(() => Category, (Category) => Category.Products)
    Category: Category
}
