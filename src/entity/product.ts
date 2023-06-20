import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category';
import { order_products_product } from './order_products_product';
import { Cart } from './Cart';
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

    @OneToMany(() => order_products_product, (order_products_product) => order_products_product.product)
    order_products_products: order_products_product[];

    @OneToMany(() => Cart, (cart) => cart.product)
    cart: Cart[];
}
