/// <amd-module name="@scom/scom-shopping-cart/interface.ts" />
declare module "@scom/scom-shopping-cart/interface.ts" {
    import { IProduct } from "@scom/scom-payment-widget";
    export interface IShoppingCart {
        title: string;
        products: IProduct[];
        currency?: string;
        returnUrl?: string;
        baseStripeApi?: string;
        canRemove?: boolean;
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
    export class Model {
        private module;
        private data;
        updateWidget: (reset: boolean) => void;
        constructor(module: Module);
        get products(): IShoppingCartProduct[];
        set products(value: IShoppingCartProduct[]);
        get currency(): string;
        set currency(value: string);
        get currencyText(): string;
        get title(): string;
        set title(value: string);
        get totalPrice(): number;
        get totalQuantity(): number;
        get returnUrl(): string;
        set returnUrl(value: string);
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get canRemove(): boolean;
        set canRemove(value: boolean);
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
            are_you_sure_you_want_to_delete: string;
        };
        "zh-hant": {
            total: string;
            total_quantity: string;
            checkout: string;
            no_product: string;
            confirm_deletion: string;
            are_you_sure_you_want_to_delete: string;
        };
        vi: {
            total: string;
            total_quantity: string;
            checkout: string;
            no_product: string;
            confirm_deletion: string;
            are_you_sure_you_want_to_delete: string;
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
        private lbDescription;
        private lbPrice;
        private mdAlert;
        onQuantityUpdated: (id: string, quantity: number) => void;
        onProductRemoved: (id: string) => void;
        constructor(parent?: Container, options?: ScomShoppingCartProductElement);
        static create(options?: ScomShoppingCartProductElement, parent?: Container): Promise<ShoppingCartProduct>;
        setProduct(product: IShoppingCartProduct, currency: string, canRemove?: boolean): void;
        private renderProduct;
        private handleDelete;
        private onConfirmDelete;
        private updateQuantity;
        private increaseQuantity;
        private decreaseQuantity;
        private handleQuantityChanged;
        updateQuantityFromParent(quantity: number): void;
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
        private pnlTotalQuantity;
        private pnlTotalPrice;
        private lbTotalPrice;
        private lbTotalQuantity;
        private pnlBtnCheckout;
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
    import { IPaymentActivity, IPlaceOrder } from '@scom/scom-payment-widget';
    interface ScomShoppingCartElement extends ControlElement {
        translations?: any;
        title?: string;
        products?: IShoppingCartProduct[];
        currency?: string;
        canRemove?: boolean;
        returnUrl?: string;
        baseStripeApi?: string;
        onQuantityUpdated?: (id: string, quantity: number) => void;
        onProductRemoved?: (id: string) => void;
        onPaymentSuccess?: (data: IPaymentActivity) => void;
        placeMarketplaceOrder?: (data: IPlaceOrder) => Promise<void>;
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
        constructor(parent?: Container, options?: any);
        static create(options?: ScomShoppingCartElement, parent?: Container): Promise<ScomShoppingCart>;
        get products(): IShoppingCartProduct[];
        set products(value: IShoppingCartProduct[]);
        get returnUrl(): string;
        get baseStripeApi(): string;
        get currency(): string;
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
        private handleCheckout;
        private initModel;
        init(): Promise<void>;
        render(): any;
    }
}
