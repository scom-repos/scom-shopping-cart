export interface IShoppingCart {
    title: string;
    products: IProduct[];
    currency?: string;
    // payment info - TODO
}

export interface IProduct {
    id: string | number;
    name: string;
    description?: string;
    image: string;
    price: number;
    quantity: number;
    available: number;
}