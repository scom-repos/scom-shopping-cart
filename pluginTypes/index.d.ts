/// <reference path="@scom/scom-payment-widget/index.d.ts" />
/// <amd-module name="@scom/scom-shopping-cart/interface.ts" />
declare module "@scom/scom-shopping-cart/interface.ts" {
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
}
/// <amd-module name="@scom/scom-shopping-cart/formSchema.ts" />
declare module "@scom/scom-shopping-cart/formSchema.ts" {
    const _default: {
        dataSchema: {
            type: string;
            properties: {
                title: {
                    type: string;
                    required: boolean;
                };
                products: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                required: boolean;
                            };
                            name: {
                                type: string;
                                required: boolean;
                            };
                            description: {
                                type: string;
                            };
                            images: {
                                type: string;
                                required: boolean;
                                items: {
                                    type: string;
                                    required: boolean;
                                };
                            };
                            price: {
                                type: string;
                                required: boolean;
                                minimum: number;
                            };
                            quantity: {
                                type: string;
                                required: boolean;
                                minimum: number;
                            };
                            available: {
                                type: string;
                                required: boolean;
                                minimum: number;
                            };
                        };
                    };
                };
                canRemove: {
                    type: string;
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                scope: string;
                options?: undefined;
                title?: undefined;
            } | {
                type: string;
                scope: string;
                options: {
                    detail: {
                        type: string;
                    };
                };
                title?: undefined;
            } | {
                type: string;
                title: string;
                scope: string;
                options?: undefined;
            })[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-shopping-cart/model.ts" />
declare module "@scom/scom-shopping-cart/model.ts" {
    import { Module } from '@ijstech/components';
    import { IShoppingCartProduct, IShoppingCart } from "@scom/scom-shopping-cart/interface.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    import { ICryptoPayoutOption } from '@scom/scom-payment-widget';
    export class Model {
        private module;
        private data;
        private _env;
        updateWidget: (reset: boolean) => void;
        constructor(module: Module);
        get products(): IShoppingCartProduct[];
        set products(value: IShoppingCartProduct[]);
        get currency(): string;
        set currency(value: string);
        get currencyText(): string;
        get title(): string;
        set title(value: string);
        get cryptoPayoutOptions(): ICryptoPayoutOption[];
        get stripeAccountId(): string;
        get rewardsPointsOptions(): import("@scom/scom-payment-widget").IRewardsPointsOption[];
        get totalPrice(): number;
        get totalQuantity(): number;
        get returnUrl(): string;
        set returnUrl(value: string);
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get canRemove(): boolean;
        set canRemove(value: boolean);
        get env(): string;
        set env(value: string);
        get isOnTelegram(): boolean;
        get isAvailableOnTelegram(): boolean;
        get hasInactiveProducts(): boolean;
        get canCheckoutOnTelegram(): boolean;
        get canCheckout(): boolean;
        getData(): IShoppingCart;
        setData(value: IShoppingCart): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: {
                    type: string;
                    properties: {
                        title: {
                            type: string;
                            required: boolean;
                        };
                        products: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        required: boolean;
                                    };
                                    name: {
                                        type: string;
                                        required: boolean;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    images: {
                                        type: string;
                                        required: boolean;
                                        items: {
                                            type: string;
                                            required: boolean;
                                        };
                                    };
                                    price: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                    quantity: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                    available: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                };
                            };
                        };
                        canRemove: {
                            type: string;
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options?: undefined;
                        title?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
                        title?: undefined;
                    } | {
                        type: string;
                        title: string;
                        scope: string;
                        options?: undefined;
                    })[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private _getActions;
        addProduct(product: IShoppingCartProduct): void;
        addProducts(products: IShoppingCartProduct[]): void;
        removeProduct(id: string | number): void;
        updateQuantity(id: string | number, quantity: number): void;
        clear(): void;
        mergeI18nData(i18nData: Record<string, any>[]): Record<string, any>;
        getNetworks(): {
            chainId: number;
        }[];
        getTokens(): ITokenObject[];
    }
}
/// <amd-module name="@scom/scom-shopping-cart/components/index.css.ts" />
declare module "@scom/scom-shopping-cart/components/index.css.ts" {
    export const textRight: string;
    export const inputStyle: string;
    export const alertStyle: string;
    export const textEllipsis: string;
    export const buttonStyle: string;
}
/// <amd-module name="@scom/scom-shopping-cart/translations.json.ts" />
declare module "@scom/scom-shopping-cart/translations.json.ts" {
    const _default_1: {
        en: {
            total: string;
            total_quantity: string;
            checkout: string;
            no_product: string;
            confirm_deletion: string;
            are_you_sure_you_want_to_delete_this_product: string;
            not_supported_on_telegram: string;
            minute: string;
            minutes: string;
            hour: string;
            hours: string;
            day: string;
            days: string;
            booking_closed: string;
            left_in_stock: string;
            spots_left: string;
        };
        "zh-hant": {
            total: string;
            total_quantity: string;
            checkout: string;
            no_product: string;
            confirm_deletion: string;
            are_you_sure_you_want_to_delete_this_product: string;
            not_supported_on_telegram: string;
            minute: string;
            minutes: string;
            hour: string;
            hours: string;
            day: string;
            days: string;
            booking_closed: string;
            left_in_stock: string;
            spots_left: string;
        };
        vi: {
            total: string;
            total_quantity: string;
            checkout: string;
            no_product: string;
            confirm_deletion: string;
            are_you_sure_you_want_to_delete_this_product: string;
            not_supported_on_telegram: string;
            minute: string;
            minutes: string;
            hour: string;
            hours: string;
            day: string;
            days: string;
            booking_closed: string;
            left_in_stock: string;
            spots_left: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-shopping-cart/components/product.tsx" />
declare module "@scom/scom-shopping-cart/components/product.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IShoppingCartProduct } from "@scom/scom-shopping-cart/interface.ts";
    interface ScomShoppingCartProductElement extends ControlElement {
        product?: IShoppingCartProduct;
        currency?: string;
        canRemove?: boolean;
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-shopping-cart--product']: ScomShoppingCartProductElement;
            }
        }
    }
    export default class ShoppingCartProduct extends Module {
        private product;
        private currency;
        private canRemove;
        private iconRemove;
        private edtQuantity;
        private iconMinus;
        private iconPlus;
        private imgProduct;
        private lbName;
        private markdownDescription;
        private lbPrice;
        private pnlReservationProduct;
        private lbServiceName;
        private lbProviderName;
        private lbTime;
        private lbDuration;
        private lbWarning;
        private mdAlert;
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
        constructor(parent?: Container, options?: ScomShoppingCartProductElement);
        static create(options?: ScomShoppingCartProductElement, parent?: Container): Promise<ShoppingCartProduct>;
        setProduct(product: IShoppingCartProduct, currency: string, canRemove?: boolean): void;
        private renderProduct;
        private checkAvailableProduct;
        private renderReservationProductInfo;
        private getDurationUnit;
        private handleDelete;
        private onConfirmDelete;
        private updateQuantity;
        private increaseQuantity;
        private decreaseQuantity;
        private handleQuantityChanged;
        private handleQuantityClicked;
        updateQuantityFromParent(quantity: number): void;
        private navigateTo;
        private handleProductClick;
        initTranslations(translations: any): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-shopping-cart/components/productList.tsx" />
declare module "@scom/scom-shopping-cart/components/productList.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IShoppingCartProduct } from "@scom/scom-shopping-cart/interface.ts";
    import { Model } from "@scom/scom-shopping-cart/model.ts";
    interface ScomShoppingCartProductListElement extends ControlElement {
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
        onCheckout: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-shopping-cart--product-list']: ScomShoppingCartProductListElement;
            }
        }
    }
    export default class ShoppingCartProductList extends Module {
        private _model;
        private listProductElm;
        private pnlProducts;
        private pnlTotalPrice;
        private lbTotalPrice;
        private pnlBtnCheckout;
        private btnCheckout;
        private totalPage;
        private pageNumber;
        private itemStart;
        private itemEnd;
        private paginationElm;
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
        onCheckout: () => void;
        constructor(parent?: Container, options?: ScomShoppingCartProductListElement);
        static create(options?: ScomShoppingCartProductListElement, parent?: Container): Promise<ShoppingCartProductList>;
        get model(): Model;
        set model(value: Model);
        get products(): IShoppingCartProduct[];
        set products(value: IShoppingCartProduct[]);
        get currencyText(): string;
        get title(): string;
        get totalPrice(): number;
        get totalQuantity(): number;
        get canRemove(): boolean;
        private get paginatedProducts();
        private handleCheckout;
        private removeProduct;
        private updateQuantity;
        handleRemoveProduct(id: string, idx: number): void;
        updateQuantityFromParent(id: string, quantity: number): void;
        private updateTotalValues;
        private onSelectIndex;
        private updatePaginationData;
        private resetPagination;
        renderProducts(resetPaging?: boolean): void;
        initTranslations(translations: any): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-shopping-cart/components/index.ts" />
declare module "@scom/scom-shopping-cart/components/index.ts" {
    import ShoppingCartProductList from "@scom/scom-shopping-cart/components/productList.tsx";
    export { ShoppingCartProductList, };
}
/// <amd-module name="@scom/scom-shopping-cart" />
declare module "@scom/scom-shopping-cart" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IShoppingCartProduct, IShoppingCart } from "@scom/scom-shopping-cart/interface.ts";
    import { ICryptoPayoutOption, IPaymentActivity, IPlaceOrder } from '@scom/scom-payment-widget';
    interface ScomShoppingCartElement extends ControlElement {
        translations?: any;
        title?: string;
        products?: IShoppingCartProduct[];
        cryptoPayoutOptions?: ICryptoPayoutOption;
        stripeAccountId?: string;
        currency?: string;
        canRemove?: boolean;
        returnUrl?: string;
        baseStripeApi?: string;
        env?: string;
        onQuantityUpdated?: (id: string, quantity: number) => void;
        onProductRemoved?: (id: string) => void;
        onPaymentSuccess?: (data: IPaymentActivity) => void;
        placeMarketplaceOrder?: (data: IPlaceOrder) => Promise<void>;
        fetchRewardsPointBalance?: (creatorId: string, communityId: string) => Promise<number>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-shopping-cart']: ScomShoppingCartElement;
            }
        }
    }
    export default class ScomShoppingCart extends Module {
        private _translations;
        private model;
        private productListElm;
        private scomPaymentWidget;
        tag: any;
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
        onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
        placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;
        fetchRewardsPointBalance: (creatorId: string, communityId: string) => Promise<number>;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomShoppingCartElement, parent?: Container): Promise<ScomShoppingCart>;
        get products(): IShoppingCartProduct[];
        set products(value: IShoppingCartProduct[]);
        get returnUrl(): string;
        get baseStripeApi(): string;
        get currency(): string;
        get cryptoPayoutOptions(): ICryptoPayoutOption[];
        get stripeAccountId(): string;
        get title(): string;
        get totalPrice(): number;
        get canRemove(): boolean;
        set canRemove(value: boolean);
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: {
                    type: string;
                    properties: {
                        title: {
                            type: string;
                            required: boolean;
                        };
                        products: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        required: boolean;
                                    };
                                    name: {
                                        type: string;
                                        required: boolean;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    images: {
                                        type: string;
                                        required: boolean;
                                        items: {
                                            type: string;
                                            required: boolean;
                                        };
                                    };
                                    price: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                    quantity: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                    available: {
                                        type: string;
                                        required: boolean;
                                        minimum: number;
                                    };
                                };
                            };
                        };
                        canRemove: {
                            type: string;
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options?: undefined;
                        title?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
                        title?: undefined;
                    } | {
                        type: string;
                        title: string;
                        scope: string;
                        options?: undefined;
                    })[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        getData(): IShoppingCart;
        setData(value: IShoppingCart): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        addProduct(product: IShoppingCartProduct): void;
        addProducts(products: IShoppingCartProduct[]): void;
        removeProduct(id: string): void;
        updateQuantity(id: string, quantity: number): void;
        clear(): void;
        private handleUpdateQuantity;
        private handleRemoveProduct;
        private renderProducts;
        private handlePaymentSuccess;
        private handlePlaceMarketplaceOrder;
        private handleFetchRewardsPointBalance;
        private handleCheckout;
        private initModel;
        init(): Promise<void>;
        render(): any;
    }
}
