import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Styles,
  Icon,
  FormatUtils,
  Input,
  Alert,
  Label,
  Image
} from '@ijstech/components';
import { alertStyle, inputStyle, textEllipsis, textRight } from './index.css';
import { IShoppingCartProduct } from '../interface';
import translations from '../translations.json';

const Theme = Styles.Theme.ThemeVars;

interface ScomShoppingCartProductElement extends ControlElement {
  product?: IShoppingCartProduct;
  currency?: string;
  canRemove?: boolean;
  onQuantityUpdated: (id: string, quantity: number) => void;
  onProductRemoved: (id: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-shopping-cart--product']: ScomShoppingCartProductElement;
    }
  }
}

@customModule
@customElements('i-scom-shopping-cart--product')
export default class ShoppingCartProduct extends Module {
  private product: IShoppingCartProduct;
  private currency: string;
  private canRemove: boolean = false;
  private iconRemove: Input;
  private edtQuantity: Input;
  private iconMinus: Icon;
  private iconPlus: Icon;
  private imgProduct: Image;
  private lbName: Label;
  private lbDescription: Label;
  private lbPrice: Label;
  private mdAlert: Alert;

  onQuantityUpdated: (id: string, quantity: number) => void;
  onProductRemoved: (id: string) => void;

  constructor(parent?: Container, options?: ScomShoppingCartProductElement) {
    super(parent, options);
  }

  static async create(options?: ScomShoppingCartProductElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  setProduct(product: IShoppingCartProduct, currency: string, canRemove?: boolean) {
    this.product = product;
    this.currency = currency || 'USD';
    this.canRemove = canRemove || false;
    this.renderProduct();
  }

  private renderProduct() {
    if (!this.imgProduct || !this.product) return;
    const { images, price, name, description, quantity, available } = this.product;
    if (images && images.length) {
      this.imgProduct.url = images[0];
    }
    this.lbName.caption = name;
    this.lbDescription.caption = description || '';
    if (description && innerWidth <= 480) {
      this.lbDescription.tooltip.content = description;
    }
    this.lbPrice.caption = `${this.currency} ${FormatUtils.formatNumber(price, { decimalFigures: 6, hasTrailingZero: false })}`;
    this.edtQuantity.value = quantity;
    this.iconMinus.enabled = quantity > 1;
    this.iconPlus.enabled = available == null || available > quantity;
    this.iconRemove.visible = this.canRemove;
  }

  private handleDelete() {
    this.mdAlert.title = this.i18n.get('$confirm_deletion');
    this.mdAlert.content = this.i18n.get('$are_you_sure_you_want_to_delete_this_product');
    this.mdAlert.showModal();
  }

  private onConfirmDelete() {
    if (this.onProductRemoved) {
      this.onProductRemoved(this.product.id);
    }
  }

  private updateQuantity(isIncremental: boolean) {
    let quantity = Number(this.edtQuantity.value);
    const available = this.product.available;
    if (isIncremental) {
      if (available == null || available > quantity) {
        this.edtQuantity.value = ++quantity;
      }
    } else {
      if (quantity > 1) {
        this.edtQuantity.value = --quantity;
      }
    }
    this.iconMinus.enabled = quantity > 1;
    this.iconPlus.enabled = available == null || available > quantity;
    if (this.onQuantityUpdated) this.onQuantityUpdated(this.product.id, quantity);
  }

  private increaseQuantity() {
    this.updateQuantity(true);
  }

  private decreaseQuantity() {
    this.updateQuantity(false);
  }

  private handleQuantityChanged() {
    const available = this.product.available;
    const quantity = Number(this.edtQuantity.value) || 1;
    if (!Number.isInteger(quantity)) {
      this.edtQuantity.value = Math.trunc(quantity);
    }
    this.iconMinus.enabled = quantity > 1;
    this.iconPlus.enabled = available == null || available > this.edtQuantity.value;
    if (this.onQuantityUpdated) this.onQuantityUpdated(this.product.id, quantity);
  }

  updateQuantityFromParent(quantity: number) {
    this.edtQuantity.value = quantity;
    const available = this.product.available;
    this.iconMinus.enabled = quantity > 1;
    this.iconPlus.enabled = available == null || available > quantity;
  }

  private handleProductClick() {
    window.location.assign(`#!/product/${this.product.stallId}/${this.product.id}`);
  }

  initTranslations(translations: any) {
    this.i18n.init({ ...translations });
  }

  async init() {
    this.i18n.init({ ...translations });
    super.init();
    this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
    this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
    const currency = this.getAttribute('currency', true, this.currency);
    const product = this.getAttribute('product', true, this.product);
    const canRemove = this.getAttribute('canRemove', true, this.canRemove);
    this.setProduct(product, currency, canRemove);
  }

  render() {
    return (
      <i-panel width="100%" height="100%" minHeight={80} cursor="pointer" onClick={this.handleProductClick}
      >
        <i-hstack
          gap="0.5rem"
          width="100%"
          height="100%"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
          border={{ radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }}
        >
          <i-vstack
            width={100}
            height="auto"
            horizontalAlignment="center"
            background={{ color: Theme.text.primary }}
            border={{ radius: 4 }}
            padding={{ top: '0.25rem', left: '0.25rem', bottom: '0.25rem', right: '0.25rem' }}
            alignSelf="start"
            stack={{ shrink: '0' }}
          >
            <i-image
              id="imgProduct"
              width="100%"
              height="auto"
              margin={{ left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }}
              maxHeight={200}
              objectFit="contain"
              fallbackUrl="https://placehold.co/600x400?text=No+Image"
            />
          </i-vstack>
          <i-vstack gap="0.5rem" width="100%" minWidth="3.5rem">
            <i-stack direction="horizontal" justifyContent="space-between" gap="0.5rem">
              <i-label id="lbName" minWidth={0} overflowWrap="break-word" font={{ bold: true, size: '1rem' }} />
              <i-icon
                id="iconRemove"
                visible={false}
                name="trash"
                fill={Theme.colors.error.dark}
                width={20}
                height={20}
                padding={{ top: 2, bottom: 2, left: 2, right: 2 }}
                stack={{ shrink: '0' }}
                cursor="pointer"
                onClick={this.handleDelete.bind(this)}
              />
            </i-stack>
            <i-label id="lbDescription" font={{ color: Theme.text.hint, size: '0.8125rem' }} class={textEllipsis} />
            <i-stack direction="horizontal" alignItems="center" justifyContent="space-between" margin={{ top: 'auto' }}>
              <i-label id="lbPrice" font={{ size: '1rem' }} />
              <i-hstack verticalAlignment="center" horizontalAlignment="end">
                <i-icon
                  id="iconMinus"
                  enabled={false}
                  name="minus-circle"
                  width={24}
                  height={24}
                  padding={{ top: 2, bottom: 2, left: 2, right: 2 }}
                  fill={Theme.text.primary}
                  cursor="pointer"
                  onClick={this.decreaseQuantity}
                />
                <i-input
                  id="edtQuantity"
                  class={inputStyle}
                  width={40}
                  height="auto"
                  inputType="number"
                  border={{ style: 'none' }}
                  background={{ color: 'transparent' }}
                  onChanged={this.handleQuantityChanged}
                />
                <i-icon
                  id="iconPlus"
                  enabled={false}
                  name="plus-circle"
                  width={24}
                  height={24}
                  padding={{ top: 2, bottom: 2, left: 2, right: 2 }}
                  fill={Theme.text.primary}
                  cursor="pointer"
                  onClick={this.increaseQuantity}
                />
              </i-hstack>
            </i-stack>
          </i-vstack>
        </i-hstack>
        <i-alert id="mdAlert" status="confirm" class={alertStyle} onConfirm={this.onConfirmDelete} />
      </i-panel>
    )
  }
}