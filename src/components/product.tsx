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
  Image,
  Markdown,
  moment,
  StackLayout
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
  private markdownDescription: Markdown;
  private lbPrice: Label;
  private pnlReservationProduct: StackLayout;
  private lbServiceName: Label;
  private lbProviderName: Label;
  private lbTime: Label;
  private lbDuration: Label;
  private lbWarning: Label;
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

  private async renderProduct() {
    if (!this.imgProduct || !this.product) return;
    const { images, price, name, description, quantity } = this.product;
    if (images && images.length) {
      this.imgProduct.url = images[0];
    }
    this.lbName.caption = name;
    if (description) {
      const plainText = await this.markdownDescription.toPlainText(description);
      this.markdownDescription.load(plainText || "");
    } else {
      this.markdownDescription.load("");
    }
    if (description && innerWidth <= 480) {
      this.markdownDescription.tooltip.content = description;
    }
    this.renderReservationProductInfo();
    this.lbPrice.caption = `${this.currency} ${FormatUtils.formatNumber(price, { decimalFigures: 6, hasTrailingZero: false })}`;
    this.edtQuantity.value = quantity;
    this.iconRemove.visible = this.canRemove;
    this.checkAvailableProduct(quantity);
  }

  private checkAvailableProduct(quantity: number) {
    const { available, time } = this.product;
    let isWarningShown = false;
    let warningText = '';
    const isBookingClosed = time && moment().isSameOrAfter(time * 1000);
    if (isBookingClosed) {
      isWarningShown = true;
      warningText = this.i18n.get('$booking_closed');
    } else if (available && quantity > available) {
      isWarningShown = true;
      warningText = this.i18n.get(time ? '$spots_left' : '$left_in_stock', { number: available.toString() });
    }
    this.lbWarning.caption = warningText;
    this.lbWarning.visible = isWarningShown;
    const isMinusEnabled = !isBookingClosed && quantity > 1;
    this.iconMinus.enabled = isMinusEnabled;
    this.iconMinus.cursor = isMinusEnabled ? 'pointer' : 'default';
    const isPlusEnabled = !isBookingClosed && (available == null || available > quantity);
    this.iconPlus.enabled = isPlusEnabled;
    this.iconPlus.cursor = isPlusEnabled ? 'pointer' : 'default';
  }

  private renderReservationProductInfo() {
    const { parentProductId, serviceName, providerName, time, duration, durationUnit } = this.product;
    if (!parentProductId) {
      this.pnlReservationProduct.visible = false;
      return;
    }
    this.lbServiceName.caption = serviceName || '-';
    this.lbProviderName.caption = providerName || '-';
    this.lbTime.caption = time ? moment(time * 1000).format('DD MMM YYYY, hh:mm A') : '-';
    this.lbDuration.caption = duration ? `${duration} ${this.getDurationUnit(durationUnit, duration)}` : '-';
    this.pnlReservationProduct.visible = true;
  }

  private getDurationUnit(unit: string, value: number) {
    switch (unit) {
      case 'minutes':
        return this.i18n.get(value == 1 ? '$minute' : '$minutes');
      case 'hours':
        return this.i18n.get(value == 1 ? '$hour' : '$hours');
      case 'days':
        return this.i18n.get(value == 1 ? '$day' : '$days');
    }
    return '';
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
    this.checkAvailableProduct(quantity);
    if (this.onQuantityUpdated) this.onQuantityUpdated(this.product.id, quantity);
  }

  private increaseQuantity() {
    this.updateQuantity(true);
  }

  private decreaseQuantity() {
    this.updateQuantity(false);
  }

  private handleQuantityChanged() {
    const quantity = Number(this.edtQuantity.value) || 1;
    if (!Number.isInteger(quantity)) {
      this.edtQuantity.value = Math.trunc(quantity);
    }
    this.checkAvailableProduct(quantity);
    if (this.onQuantityUpdated) this.onQuantityUpdated(this.product.id, quantity);
  }

  private handleQuantityClicked() { }

  updateQuantityFromParent(quantity: number) {
    this.edtQuantity.value = quantity;
    this.checkAvailableProduct(quantity);
  }

  private handleProductClick() {
    if (this.product.parentProductId) {
      window.location.assign(`#!/product/${this.product.stallId}/${this.product.parentProductId}/${this.product.id}`);
    } else {
      window.location.assign(`#!/product/${this.product.stallId}/${this.product.id}`);
    }
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
      <i-panel width="100%" height="100%" minHeight={80}
      >
        <i-hstack
          gap="0.5rem"
          width="100%"
          height="100%"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
          border={{ radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }}
          cursor="pointer"
          onClick={this.handleProductClick}
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
          <i-vstack width="100%" minWidth="3.5rem">
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
            <i-markdown
              id="markdownDescription"
              width="100%"
              class={textEllipsis}
              font={{ color: Theme.text.hint, size: '0.8125rem' }}
            ></i-markdown>
            <i-stack id="pnlReservationProduct" visible={false} direction="vertical" gap="0.5rem" margin={{ top: '0.5rem', bottom: '0.5rem' }}>
              <i-stack direction="horizontal" gap="0.5rem" alignItems="center">
                <i-icon name="briefcase" width={14} height={14} fill={Theme.text.hint} />
                <i-label id="lbServiceName" class={textEllipsis} lineClamp={1} font={{ size: '0.8125rem' }} />
              </i-stack>
              <i-stack direction="horizontal" gap="0.5rem" alignItems="center">
                <i-icon name="user" width={14} height={14} fill={Theme.text.hint} />
                <i-label id="lbProviderName" class={textEllipsis} lineClamp={1} font={{ size: '0.8125rem' }} />
              </i-stack>
              <i-stack direction="horizontal" gap="0.5rem" alignItems="center">
                <i-icon name="calendar-check" width={14} height={14} fill={Theme.text.hint} />
                <i-label id="lbTime" wordBreak="break-word" font={{ size: '0.8125rem' }} />
              </i-stack>
              <i-stack direction="horizontal" gap="0.5rem" alignItems="center">
                <i-icon name="clock" width={14} height={14} fill={Theme.text.hint} />
                <i-label id="lbDuration" class={textEllipsis} font={{ size: '0.8125rem' }} />
              </i-stack>
            </i-stack>
            <i-stack direction="horizontal" alignItems="center" justifyContent="space-between" wrap="wrap" margin={{ top: 'auto' }}>
              <i-label id="lbPrice" font={{ size: '1rem' }} />
              <i-hstack verticalAlignment="center" horizontalAlignment="end" margin={{ left: 'auto' }}>
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
                  onClick={this.handleQuantityClicked}
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
            <i-label id="lbWarning" visible={false} font={{ size: '0.8125rem', color: Theme.colors.error.main, bold: true }} class="text-right" margin={{ top: '0.25rem', left: 'auto' }} />
          </i-vstack>
        </i-hstack>
        <i-alert id="mdAlert" status="confirm" class={alertStyle} onConfirm={this.onConfirmDelete} />
      </i-panel>
    )
  }
}