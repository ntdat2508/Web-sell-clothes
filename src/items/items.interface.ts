import { Item } from './item.interface';
import express, { Request } from 'express';
import { User } from '../entity/User';
export interface Items {
    [key: number]: Item;
}
export interface CartItem {
    itemId: string;
    quantity: number;
}
// import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    //kiểu giao diện mới, mở rộng từ kiểu Request của Express
    user?: User;
    body: {
        productId?: number;
    } & Record<string, any>; //cho phép các thuộc tính động khác được định nghĩa trong middleware
}
