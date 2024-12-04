import {
    Module,
    customModule,
    Container,
    ControlElement,
    customElements,
    Styles,
    VStack,
    Button,
} from '@ijstech/components';
import { IProduct, IShoppingCart } from './interface';
import { MAX_PRODUCTS, Model } from './model';
import { ScomPaymentWidget } from '@scom/scom-payment-widget';
import { buttonStyle, ShoppingCartProductList } from './components/index';
import translations from './translations.json';

const Theme = Styles.Theme.ThemeVars;

interface ScomShoppingCartElement extends ControlElement {
    translations?: any;
    title?: string;
    products?: IProduct[];
    currency?: string;
    canRemove?: boolean;
    onPaymentSuccess?: (status: string) => void;
    onQuantityUpdated?: (id: string, quantity: number) => void;
    onProductRemoved?: (id: string) => void;
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
    private allProductListElm: ShoppingCartProductList;
    private scomPaymentWidget: ScomPaymentWidget;
    private wrapperShowAll: VStack;
    private btnShowAll: Button;

    tag: any = {};
    onPaymentSuccess: (status: string) => void;
    onQuantityUpdated: (id: string, quantity: number) => void;
    onProductRemoved: (id: string) => void;

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

    set products(value: IProduct[]) {
        this.model.products = value;
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

    addProduct(product: IProduct) {
        this.model.addProduct(product);
        this.renderProducts();
    }

    addProducts(products: IProduct[]) {
        this.model.addProducts(products);
        this.renderProducts();
    }

    removeProduct(id: string) {
        this.model.removeProduct(id);
        if (!this.model.products.length) {
            this.renderProducts();
            return;
        }
        if (this.productListElm) {
            if (this.model.products.length === MAX_PRODUCTS) {
                this.renderProducts(true);
            } else {
                this.productListElm.handleRemoveProduct(id);
            }
        }
        if (this.allProductListElm) {
            this.allProductListElm.handleRemoveProduct(id);
        }
    }

    updateQuantity(id: string, quantity: number) {
        this.model.updateQuantity(id, quantity);
        if (this.productListElm) {
            this.productListElm.updateQuantityFromParent(id, quantity);
        }
        if (this.allProductListElm) {
            this.allProductListElm.updateQuantityFromParent(id, quantity);
        }
    }

    clear() {
        this.model.clear();
        this.renderProducts();
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

    private renderProducts(updateLimited?: boolean) {
        if (!this.productListElm) return;
        this.productListElm.renderProducts(true);
        const isShowAllVisible = this.model.isShowAllVisible;
        this.wrapperShowAll.visible = isShowAllVisible;
        if (isShowAllVisible && this.allProductListElm && !updateLimited) {
            this.allProductListElm.renderProducts();
        }
    }

    private async handleShowAll() {
        if (!this.allProductListElm) {
            this.allProductListElm = new ShoppingCartProductList();
            this.allProductListElm.model = this.model;
            this.allProductListElm.onCheckout = this.handleCheckout.bind(this);
            this.allProductListElm.onProductRemoved = this.handleRemoveProduct.bind(this);
            this.allProductListElm.onQuantityUpdated = this.handleUpdateQuantity.bind(this);
            this.allProductListElm.initTranslations(this._translations);
        }
        const modal = this.allProductListElm.openModal({
            title: '$shoppingCart',
            closeIcon: { name: 'times', fill: Theme.colors.primary.main },
            width: 480,
            maxWidth: '100%',
            padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' },
            border: { radius: '1rem' }
        });
        await this.allProductListElm.ready();
        this.allProductListElm.renderProducts();
        modal.refresh();
    }

    private handlePaymentSuccess(status: string) {
        if (this.allProductListElm) this.allProductListElm.closeModal();
        if (this.onPaymentSuccess) this.onPaymentSuccess(status);
    }

    private async handleCheckout() {
        if (!this.scomPaymentWidget) {
            this.scomPaymentWidget = new ScomPaymentWidget(undefined, { display: 'block', margin: { top: '1rem' } });
            this.scomPaymentWidget.onPaymentSuccess = this.handlePaymentSuccess.bind(this);
            this.appendChild(this.scomPaymentWidget);
            await this.scomPaymentWidget.ready();
        }
        this.scomPaymentWidget.onStartPayment({
            title: this.title,
            products: this.products,
            currency: this.currency,
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
        const translationsProp = this.getAttribute('translations', true);
        this._translations = { ...translations, ...translationsProp };
        this.i18n.init({ ...this._translations });
        this.productListElm.initTranslations(this._translations);
        this.productListElm.model = this.model;
        this.btnShowAll.caption = this.i18n.get('$showAll');
        const lazyLoad = this.getAttribute('lazyLoad', true, false);
        if (!lazyLoad) {
            const title = this.getAttribute('title', true);
            const currency = this.getAttribute('currency', true);
            const products = this.getAttribute('products', true);
            const canRemove = this.getAttribute('canRemove', true, false);
            if (products) {
                this.setData({ title, products, currency, canRemove });
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
                <i-vstack id="wrapperShowAll" visible={false} width="100%" verticalAlignment="center">
                    <i-button id="btnShowAll" class={buttonStyle} onClick={this.handleShowAll} />
                </i-vstack>
            </i-panel>
        )
    }
}