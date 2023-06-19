<<<<<<< Updated upstream
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
=======
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category';
import { order_products_product } from './orders_products_product';
>>>>>>> Stashed changes

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
    category: string;
    @Column()
    quantity: number;
    @Column()
    price: number;
<<<<<<< Updated upstream
=======
    @ManyToOne(() => Category, (Category) => Category.Products)
    Category: Category;

    @OneToMany(() => order_products_product, (order_products_product) => order_products_product.order)
    order_products_products: order_products_product[];
>>>>>>> Stashed changes
}
