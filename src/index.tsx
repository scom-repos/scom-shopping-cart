import {
    Module,
    customModule,
    Container,
    ControlElement,
    customElements,
    Styles,
    Label,
    Panel,
    VStack,
    Icon,
    FormatUtils
} from '@ijstech/components';
import { textEllipsis, textRight } from './index.css';
import { IProduct, IShoppingCart } from './interface';
import { Model } from './model';

const Theme = Styles.Theme.ThemeVars;

interface ScomShoppingCartElement extends ControlElement {
    products?: IProduct[];
    onPaymentSuccess?: (status: string) => void;
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
    private model: Model;
    private pnlProducts: VStack;
    private pnlTotal: Panel;
    private lbTotal: Label;
    private pnlBtnCheckout: VStack;

    tag: any = {};
    onPaymentSuccess: (status: string) => void;

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

    private renderProducts() {
        if (!this.pnlProducts) return;
        if (!this.products || !this.products.length) {
            this.pnlTotal.visible = false;
            this.pnlBtnCheckout.visible = false;
            this.pnlProducts.clearInnerHTML();
            this.pnlProducts.appendChild(
                <i-label
                    caption="No products!"
                    font={{ size: '1rem' }}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    margin={{ left: 'auto', right: 'auto' }}
                />
            );
            return;
        }
        const nodeItems: HTMLElement[] = [];
        let total = 0;
        for (const product of this.products) {
            const { name, description, image, price, quantity, available } = product;
            let _quantity = Number(quantity);
            total = total + (quantity * price);
            const lbQuantity = new Label(undefined, {
                caption: FormatUtils.formatNumber(quantity, { hasTrailingZero: false, decimalFigures: 0 }),
                font: { bold: true },
                lineHeight: 1
            });
            const iconMinus = new Icon(undefined, {
                name: 'minus-circle',
                width: 20,
                height: 20,
                fill: Theme.text.primary,
                cursor: _quantity === 1 ? 'default' : 'pointer',
                enabled: _quantity > 1
            });
            const updateQuantity = () => {
                iconMinus.cursor = _quantity === 1 ? 'default' : 'pointer';
                iconMinus.enabled = _quantity > 1;
                iconPlus.cursor = _quantity === available ? 'default' : 'pointer';
                iconPlus.enabled = _quantity < available;
                lbQuantity.caption = FormatUtils.formatNumber(_quantity, { hasTrailingZero: false, decimalFigures: 0 });
                this.lbTotal.caption = `${this.currency} ${FormatUtils.formatNumber(total, { decimalFigures: 2 })}`
            }
            iconMinus.onClick = () => {
                if (_quantity === 1) return;
                _quantity = _quantity - 1;
                total = total - price;
                updateQuantity();
            }
            const iconPlus = new Icon(undefined, {
                name: 'plus-circle',
                width: 20,
                height: 20,
                fill: Theme.text.primary,
                cursor: _quantity === available ? 'default' : 'pointer',
                enabled: _quantity < available
            });
            iconPlus.onClick = () => {
                if (_quantity === available) return;
                _quantity = _quantity + 1;
                total = total + price;
                updateQuantity();
            }
            const item = (
                <i-hstack
                    gap="0.5rem"
                    width="100%"
                    height="100%"
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                    border={{ radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }}
                    wrap="wrap"
                >
                    <i-panel
                        width={100}
                        height="auto"
                        background={{ color: Theme.text.primary }}
                        border={{ radius: 4 }}
                        padding={{ top: '0.25rem', left: '0.25rem', bottom: '0.25rem', right: '0.25rem' }}
                    >
                        <i-image
                            url={image}
                            width="100%"
                            height="auto"
                            maxHeight={200}
                            objectFit="contain"
                            fallbackUrl="https://placehold.co/600x400?text=No+Image"
                        />
                    </i-panel>
                    <i-vstack gap="0.5rem" width="calc(100% - 13.25rem)" minWidth="3.5rem">
                        <i-label caption={name} font={{ bold: true }} />
                        <i-label caption={description} font={{ color: Theme.text.hint, size: '0.8125rem' }} class={textEllipsis} />
                    </i-vstack>
                    <i-vstack gap="0.5rem" minWidth={80} margin={{ left: 'auto' }}>
                        <i-label caption={`${this.currency} ${FormatUtils.formatNumber(price, { decimalFigures: 2 })}`} font={{ bold: true }} margin={{ left: 'auto' }} class={textRight} />
                        <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="end">
                            {iconMinus}
                            {lbQuantity}
                            {iconPlus}
                        </i-hstack>
                    </i-vstack>
                </i-hstack>
            );
            nodeItems.push(item);
        }
        this.pnlProducts.clearInnerHTML();
        this.pnlProducts.append(...nodeItems);
        this.lbTotal.caption = `${this.currency} ${FormatUtils.formatNumber(total, { decimalFigures: 2 })}`;
    }

    private handleCheckout() {
        console.log('handleCheckout')
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
        const lazyLoad = this.getAttribute('lazyLoad', true, false);
        if (!lazyLoad) {
            const products = this.getAttribute('products', true);
            if (products) {
                this.setData({ products });
            }
        }
    }

    render() {
        return (
            <i-panel width="100%" height="100%" border={{ radius: '0.5rem' }} overflow="hidden">
                <i-vstack id="pnlProducts" gap="1rem" width="100%" verticalAlignment="center" />
                <i-hstack id="pnlTotal" gap="1rem" width="100%" margin={{ top: '1rem' }} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                    <i-label caption="Total" font={{ size: '1rem', bold: true }} />
                    <i-label id="lbTotal" font={{ size: '1rem', bold: true }} />
                </i-hstack>
                <i-vstack id="pnlBtnCheckout" width="100%" verticalAlignment="center">
                    <i-button
                        caption="Checkout"
                        width="100%"
                        maxWidth={180}
                        minWidth={90}
                        margin={{ top: '1rem', left: 'auto', right: 'auto' }}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                        background={{ color: Theme.colors.primary.main }}
                        border={{ radius: 12 }}
                        onClick={this.handleCheckout}
                    />
                </i-vstack>
            </i-panel>
        )
    }
}