import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Product } from './product';
import { Orders } from './orders';

@Entity()
export class order_products_product {
    @PrimaryColumn()
    productId: number;

    @Column()
    name_prd: string;

    @PrimaryColumn()
    orderId: number;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    total: number;

    @ManyToOne(() => Product, (product) => product.order_products_products)
    product: Product;

    @ManyToOne(() => Orders, (order) => order.order_products_products)
    order: Orders;
}
