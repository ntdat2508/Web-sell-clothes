import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Product } from './product';

@Entity()
export class Order {
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
    date: Date;
    @ManyToMany(() => Product)
    @JoinTable()
    Products: Product[];
}
