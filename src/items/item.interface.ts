export interface BaseItem {
    name: string;
    image: string;
    description: string;
    category: string;
    quantity: string;
    price: string;
}

export interface Item extends BaseItem {
    id: number;
}
