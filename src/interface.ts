import { IProduct } from "@scom/scom-payment-widget";

export interface IShoppingCart {
    title: string;
    products: IProduct[];
    currency?: string;
    returnUrl?: string;
    baseStripeApi?: string;
    canRemove?: boolean;
    // payment info - TODO
}
export interface IShoppingCartProduct extends IProduct {
    available?: number;
}