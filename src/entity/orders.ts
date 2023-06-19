import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Product } from './product';
import { order_products_product } from './orders_products_product';
@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        length: 9,
    })
    name: string;
    @Column()
    status: string;
    @Column()
    costumer: string;
    @Column()
    address: string;
    @Column()
    phone: number;
    @Column()
    sumtotal: number;
    @Column()
    date: Date;
    @ManyToMany(() => Product)
    @JoinTable()
    Products: Product[];

    @OneToMany(() => order_products_product, (order_products_product) => order_products_product.order)
    order_products_products: order_products_product[];
}
