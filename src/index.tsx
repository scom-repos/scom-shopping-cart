import {
    Module,
    customModule,
    Container,
    ControlElement,
    customElements,
} from '@ijstech/components';
import { IShoppingCartProduct, IShoppingCart } from './interface';
import { Model } from './model';
import { IPaymentActivity, IPlaceOrder, ScomPaymentWidget } from '@scom/scom-payment-widget';
import { ShoppingCartProductList } from './components/index';
import translations from './translations.json';

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

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-shopping-cart']: ScomShoppingCartElement;
        }
    }
}

@customModule
@customElements('i-scom-shopping-cart')
export default class ScomShoppingCart extends Module {
    private _translations: any;
    private model: Model;
    private productListElm: ShoppingCartProductList;
    private scomPaymentWidget: ScomPaymentWidget;

    tag: any = {};
    onQuantityUpdated: (id: string, quantity: number) => void;
    onProductRemoved: (id: string) => void;
    onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
    placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.initModel();
    }

    static async create(options?: ScomShoppingCartElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get products() {
        return this.model.products;
    }

    set products(value: IShoppingCartProduct[]) {
        this.model.products = value;
    }

    get returnUrl() {
        return this.model.returnUrl;
    }

    get baseStripeApi() {
        return this.model.baseStripeApi;
    }

    get currency() {
        return this.model.currency;
    }

    get title() {
        return this.model.title;
    }

    get totalPrice() {
        return this.model.totalPrice;
    }

    get canRemove() {
        return this.model.canRemove;
    }

    set canRemove(value: boolean) {
        this.model.canRemove = value;
    }

    getConfigurators() {
        this.initModel();
        return this.model.getConfigurators();
    }

    getData() {
        return this.model.getData();
    }

    async setData(value: IShoppingCart) {
        this.model.setData(value);
    }

    getTag() {
        return this.tag;
    }

    async setTag(value: any) {
        this.model.setTag(value);
    }

    addProduct(product: IShoppingCartProduct) {
        this.model.addProduct(product);
        this.renderProducts();
    }

    addProducts(products: IShoppingCartProduct[]) {
        this.model.addProducts(products);
        this.renderProducts();
    }

    removeProduct(id: string) {
        const idx = this.products.findIndex(v => v.id === id);
        this.model.removeProduct(id);
        if (!this.model.products.length) {
            this.renderProducts(true);
            return;
        }
        if (this.productListElm) {
            this.productListElm.handleRemoveProduct(id, idx);
        }
    }

    updateQuantity(id: string, quantity: number) {
        this.model.updateQuantity(id, quantity);
        if (this.productListElm) {
            this.productListElm.updateQuantityFromParent(id, quantity);
        }
    }

    clear() {
        this.model.clear();
        this.renderProducts(true);
    }

    private handleUpdateQuantity(id: string, quantity: number) {
        this.updateQuantity(id, quantity);
        if (this.onQuantityUpdated) {
            this.onQuantityUpdated(id, quantity);
        }
    }

    private handleRemoveProduct(id: string) {
        this.removeProduct(id);
        if (this.onProductRemoved) this.onProductRemoved(id);
    }

    private renderProducts(resetPaging?: boolean) {
        if (!this.productListElm) return;
        this.productListElm.renderProducts(resetPaging);
    }

    private async handlePaymentSuccess(data: IPaymentActivity) {
        if (this.onPaymentSuccess) await this.onPaymentSuccess(data);
    }

    private async handlePlaceMarketplaceOrder(data: IPlaceOrder) {
        if (this.placeMarketplaceOrder) await this.placeMarketplaceOrder(data);
    }

    private async handleCheckout() {
        if (!this.scomPaymentWidget) {
            this.scomPaymentWidget = new ScomPaymentWidget(undefined, { display: 'block', margin: { top: '1rem' } });
            this.scomPaymentWidget.returnUrl = this.returnUrl;
            this.scomPaymentWidget.baseStripeApi = this.baseStripeApi;
            this.scomPaymentWidget.onPaymentSuccess = this.handlePaymentSuccess.bind(this);
            this.scomPaymentWidget.placeMarketplaceOrder = this.handlePlaceMarketplaceOrder.bind(this);
            this.appendChild(this.scomPaymentWidget);
            await this.scomPaymentWidget.ready();
        }
        this.scomPaymentWidget.networks = this.model.getNetworks();
        this.scomPaymentWidget.tokens = this.model.getTokens();
        this.scomPaymentWidget.onStartPayment({
            title: this.title,
            products: this.products,
            currency: this.currency,
            cryptoPayoutOptions: this.model.cryptoPayoutOptions
            // TODO - Payment info
        });
    }

    private initModel() {
        if (!this.model) {
            this.model = new Model(this);
            this.model.updateWidget = this.renderProducts.bind(this);
        }
    }

    async init() {
        super.init();
        this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
        this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
        this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
        this.placeMarketplaceOrder = this.getAttribute('placeMarketplaceOrder', true) || this.placeMarketplaceOrder;
        const translationsProp = this.getAttribute('translations', true);
        this._translations = this.model.mergeI18nData([translations, translationsProp]);
        this.i18n.init({ ...this._translations });
        this.productListElm.initTranslations(this._translations);
        this.productListElm.model = this.model;
        const lazyLoad = this.getAttribute('lazyLoad', true, false);
        if (!lazyLoad) {
            const title = this.getAttribute('title', true);
            const currency = this.getAttribute('currency', true);
            const products = this.getAttribute('products', true);
            const returnUrl = this.getAttribute('returnUrl', true);
            const baseStripeApi = this.getAttribute('baseStripeApi', true);
            const canRemove = this.getAttribute('canRemove', true, false);
            if (products) {
                this.setData({ title, products, currency, returnUrl, baseStripeApi, canRemove });
            }
        }
    }

    render() {
        return (
            <i-panel width="100%" height="100%" border={{ radius: '0.5rem' }} overflow="hidden">
                <i-scom-shopping-cart--product-list
                    id="productListElm"
                    onCheckout={this.handleCheckout}
                    onProductRemoved={this.handleRemoveProduct}
                    onQuantityUpdated={this.handleUpdateQuantity}
                />
            </i-panel>
        )
    }
}