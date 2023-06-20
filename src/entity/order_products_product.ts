import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Product } from './product';
import { Order } from './order';

@Entity()
export class order_products_product {

    @PrimaryColumn()
    productId: number;
  
    @PrimaryColumn()
    orderId: number;
    
    @Column()
    name_prd: string;

    @Column()
    quantity: number;
  
    @Column()
    price: number;

    @Column()
    total: number;

    @ManyToOne(() => Product, (product) => product.order_products_products)
    product: Product;
  
    @ManyToOne(() => Order, (order) => order.order_products_products)
    order: Order;
}