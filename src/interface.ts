export enum ProductType {
	Physical = "Physical",
	Digital = "Digital",
	Course = "Course",
	Ebook = "Ebook",
	Membership = "Membership",
	Bundle = "Bundle"
}

export interface IShoppingCart {
    title: string;
    products: IProduct[];
    currency?: string;
    canRemove?: boolean;
    // payment info - TODO
}

export interface IShippingInfo {
    id: string;
    name?: string;
    cost: number;
    regions?: string[];
}

export interface IProduct {
    id: string;
    stallId?: string;
    productType?: ProductType;
    name: string;
    description?: string;
    images: string[];
    currency?: string;
    price: number;
    quantity: number;
    available?: number;
    shippingInfo?: IShippingInfo[];
    communityUri?: string;
    stallUri?: string;
}