import { IProduct } from "@scom/scom-payment-widget";

export interface IShoppingCart {
    title: string;
    products: IProduct[];
    currency?: string;
    returnUrl?: string;
    baseStripeApi?: string;
    canRemove?: boolean;
    cryptoPayoutOptions?: ICryptoPayoutOption[];
    stripeAccountId?: string;
}
export interface IShoppingCartProduct extends IProduct {
    available?: number;
}

export interface ICryptoPayoutOption {
    chainId?: string;
	cryptoCode: string; 
	networkCode: string; 
	tokenAddress?: string;
	walletAddress: string; 
}