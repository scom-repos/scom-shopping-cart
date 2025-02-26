import { ICryptoPayoutOption, IProduct, IRewardsPointsOption } from "@scom/scom-payment-widget";

export interface IShoppingCart {
    title: string;
    products: IProduct[];
    currency?: string;
    returnUrl?: string;
    baseStripeApi?: string;
    canRemove?: boolean;
    cryptoPayoutOptions?: ICryptoPayoutOption[];
    rewardsPointsOptions?: IRewardsPointsOption[];
    stripeAccountId?: string;
}
export interface IShoppingCartProduct extends IProduct {
    available?: number;
}