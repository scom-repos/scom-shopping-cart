export interface IShoppingCart {
    products: IProduct[];
    currency?: string;
    // payment info - TODO
}

export interface IProduct {
    name: string;
    description?: string;
    image: string;
    price: number;
    quantity: number;
    available: number;
}