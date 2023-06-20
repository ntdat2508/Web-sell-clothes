import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Cart } from './Cart';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;
    @Column()
    phone: number;
    @Column({
        default: 'user',
    })
    role: string;
    @OneToMany(() => Cart, (cart) => cart.user)
    cart: Cart[];
}
