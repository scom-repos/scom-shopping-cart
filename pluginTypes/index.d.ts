/// <amd-module name="@scom/scom-shopping-cart/index.css.ts" />
declare module "@scom/scom-shopping-cart/index.css.ts" {
    export const textRight: string;
    export const textEllipsis: string;
}
/// <amd-module name="@scom/scom-shopping-cart/interface.ts" />
declare module "@scom/scom-shopping-cart/interface.ts" {
    export interface IShoppingCart {
        title: string;
        products: IProduct[];
        currency?: string;
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
                            image: {
                                type: string;
                                required: boolean;
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
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                scope: string;
                options?: undefined;
            } | {
                type: string;
                scope: string;
                options: {
                    detail: {
                        type: string;
                    };
                };
            })[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-shopping-cart/model.ts" />
declare module "@scom/scom-shopping-cart/model.ts" {
    import { Module } from '@ijstech/components';
    import { IProduct, IShoppingCart } from "@scom/scom-shopping-cart/interface.ts";
    export class Model {
        private module;
        private data;
        updateWidget: () => void;
        constructor(module: Module);
        get products(): IProduct[];
        set products(value: IProduct[]);
        get currency(): string;
        set currency(value: string);
        get currencyText(): string;
        get title(): string;
        set title(value: string);
        get totalPrice(): number;
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
                                    image: {
                                        type: string;
                                        required: boolean;
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
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
                    })[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private _getActions;
        addProduct(product: IProduct): void;
        addProducts(products: IProduct[]): void;
        removeProduct(id: string | number): void;
        updateQuantity(id: string | number, quantity: number): void;
    }
}
/// <amd-module name="@scom/scom-shopping-cart" />
declare module "@scom/scom-shopping-cart" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IProduct, IShoppingCart } from "@scom/scom-shopping-cart/interface.ts";
    interface ScomShoppingCartElement extends ControlElement {
        title?: string;
        products?: IProduct[];
        currency?: string;
        onPaymentSuccess?: (status: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-shopping-cart']: ScomShoppingCartElement;
            }
        }
    }
    export default class ScomShoppingCart extends Module {
        private model;
        private pnlProducts;
        private pnlTotal;
        private lbTotal;
        private pnlBtnCheckout;
        tag: any;
        onPaymentSuccess: (status: string) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomShoppingCartElement, parent?: Container): Promise<ScomShoppingCart>;
        get products(): IProduct[];
        set products(value: IProduct[]);
        get currency(): string;
        get title(): string;
        get totalPrice(): number;
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
                                    image: {
                                        type: string;
                                        required: boolean;
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
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
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
        addProduct(product: IProduct): void;
        addProducts(products: IProduct[]): void;
        removeProduct(id: string | number): void;
        updateQuantity(id: string | number, quantity: number): void;
        private renderProducts;
        private handleCheckout;
        private initModel;
        init(): Promise<void>;
        render(): any;
    }
}
