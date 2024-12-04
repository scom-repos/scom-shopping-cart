import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  FormatUtils,
  Label,
  VStack,
  HStack
} from '@ijstech/components';
import ShoppingCartProduct from './product';
import { IProduct } from '../interface';
import { MAX_PRODUCTS, Model } from '../model';
import { buttonStyle, productListStyle } from './index.css';
import translations from '../translations.json';

interface ScomShoppingCartProductListElement extends ControlElement {
  onQuantityUpdated: (id: string, quantity: number) => void;
  onProductRemoved: (id: string) => void;
  onCheckout: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-shopping-cart--product-list']: ScomShoppingCartProductListElement;
    }
  }
}

@customModule
@customElements('i-scom-shopping-cart--product-list')
export default class ShoppingCartProductList extends Module {
  private _model: Model;
  private listProductElm: { [key: string]: ShoppingCartProduct } = {};
  private pnlProducts: VStack;
  private pnlTotalQuantity: HStack;
  private pnlTotalPrice: HStack;
  private lbTotalPrice: Label;
  private lbTotalQuantity: Label;
  private pnlBtnCheckout: VStack;

  onQuantityUpdated: (id: string, quantity: number) => void;
  onProductRemoved: (id: string) => void;
  onCheckout: () => void;

  constructor(parent?: Container, options?: ScomShoppingCartProductListElement) {
    super(parent, options);
  }

  static async create(options?: ScomShoppingCartProductListElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get model() {
    return this._model;
  }

  set model(value: Model) {
    this._model = value;
  }

  get products() {
    return this.model.products;
  }

  set products(value: IProduct[]) {
    this.model.products = value;
  }

  get currencyText() {
    return this.model.currencyText;
  }

  get title() {
    return this.model.title;
  }

  get totalPrice() {
    return this.model.totalPrice;
  }

  get totalQuantity() {
    return this.model.totalQuantity;
  }

  get canRemove() {
    return this.model.canRemove;
  }

  private handleCheckout() {
    if (this.onCheckout) this.onCheckout();
  }

  private removeProduct(id: string) {
    if (this.onProductRemoved) this.onProductRemoved(id);
    this.updateTotalValues();
  }

  private updateQuantity(id: string, quantity: number) {
    if (this.onQuantityUpdated) this.onQuantityUpdated(id, quantity);
    this.updateTotalValues();
  }

  handleRemoveProduct(id: string) {
    const elm = this.listProductElm[`product-${id}`];
    if (elm && this.pnlProducts.contains(elm)) {
      this.pnlProducts.removeChild(elm);
    }
    this.updateTotalValues();
  }

  updateQuantityFromParent(id: string, quantity: number) {
    this.listProductElm[`product-${id}`]?.updateQuantityFromParent(quantity);
    this.updateTotalValues();
  }

  private updateTotalValues() {
    this.lbTotalPrice.caption = `${this.currencyText} ${FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })}`;
    this.lbTotalQuantity.caption = `${FormatUtils.formatNumber(this.totalQuantity, { hasTrailingZero: false })}`;
  }

  renderProducts(isLimited?: boolean) {
    if (!this.pnlProducts) return;
    if (!this.products || !this.products.length) {
      this.pnlTotalQuantity.visible = false;
      this.pnlTotalPrice.visible = false;
      this.pnlBtnCheckout.visible = false;
      this.pnlProducts.classList.remove(productListStyle);
      this.listProductElm = {};
      this.pnlProducts.clearInnerHTML();
      this.pnlProducts.appendChild(
        <i-label
          caption="$noProduct"
          font={{ size: '1rem' }}
          padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
          margin={{ left: 'auto', right: 'auto' }}
        />
      );
      return;
    }
    this.listProductElm = {};
    const nodeItems: HTMLElement[] = [];
    const isLimitedProducts = isLimited && this.model.isShowAllVisible;
    this.pnlTotalPrice.visible = !isLimitedProducts;
    this.pnlBtnCheckout.visible = !isLimitedProducts;
    this.pnlTotalQuantity.visible = true;
    const length = isLimitedProducts ? MAX_PRODUCTS : this.products.length;
    for (let i = 0; i < length; i++) {
      const product = this.products[i];
      const shoppingCartProduct = new ShoppingCartProduct();
      this.listProductElm[`product-${product.id}`] = shoppingCartProduct;
      if (!isLimited) {
        shoppingCartProduct.display = 'block';
        shoppingCartProduct.margin = { top: '1rem' };
      }
      shoppingCartProduct.onQuantityUpdated = this.updateQuantity.bind(this);
      shoppingCartProduct.onProductRemoved = this.removeProduct.bind(this);
      shoppingCartProduct.setProduct(product, this.currencyText, this.canRemove);
      nodeItems.push(shoppingCartProduct);
    }
    if (isLimited) {
      this.pnlProducts.classList.remove(productListStyle);
    } else {
      this.pnlProducts.classList.add(productListStyle);
    }
    this.pnlProducts.clearInnerHTML();
    this.pnlProducts.append(...nodeItems);
    this.updateTotalValues();
  }

  initTranslations(translations: any) {
    this.i18n.init({ ...translations });
  }

  async init() {
    this.initTranslations(translations);
    super.init();
    this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
    this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
    this.onCheckout = this.getAttribute('onCheckout', true) || this.onCheckout;
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-vstack id="pnlProducts" gap="1rem" width="100%" verticalAlignment="center" />
        <i-hstack id="pnlTotalQuantity" gap="1rem" width="100%" margin={{ top: '1rem' }} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
          <i-label caption="$totalQuantity" font={{ size: '1rem', bold: true }} />
          <i-label id="lbTotalQuantity" font={{ size: '1rem', bold: true }} />
        </i-hstack>
        <i-hstack id="pnlTotalPrice" gap="1rem" width="100%" margin={{ top: '1rem' }} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
          <i-label caption="$total" font={{ size: '1rem', bold: true }} />
          <i-label id="lbTotalPrice" font={{ size: '1rem', bold: true }} />
        </i-hstack>
        <i-vstack id="pnlBtnCheckout" width="100%" verticalAlignment="center">
          <i-button caption="$checkout" class={buttonStyle} onClick={this.handleCheckout} />
        </i-vstack>
      </i-panel>
    )
  }
}