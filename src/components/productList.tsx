import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  FormatUtils,
  Label,
  VStack,
  HStack,
  Pagination,
  observable
} from '@ijstech/components';
import ShoppingCartProduct from './product';
import { IShoppingCartProduct } from '../interface';
import { Model } from '../model';
import { buttonStyle } from './index.css';
import translations from '../translations.json';

const pageSize = 5;

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

  @observable()
  private totalPage = 0;
  private pageNumber = 0;
  private itemStart = 0;
  private itemEnd = pageSize;
  private paginationElm: Pagination;

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

  set products(value: IShoppingCartProduct[]) {
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

  private get paginatedProducts() {
    return this.products.slice(this.itemStart, this.itemEnd);
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

  handleRemoveProduct(id: string, idx: number) {
    if ((this.products.length % pageSize) === 0 && idx === this.products.length) {
      this.pageNumber = this.pageNumber - 1;
      this.paginationElm.currentPage = this.pageNumber;
    }
    this.updatePaginationData();
  }

  updateQuantityFromParent(id: string, quantity: number) {
    this.listProductElm[`product-${id}`]?.updateQuantityFromParent(quantity);
    this.updateTotalValues();
  }

  private updateTotalValues() {
    this.lbTotalPrice.caption = `${this.currencyText} ${FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 6, hasTrailingZero: false })}`;
    this.lbTotalQuantity.caption = `${FormatUtils.formatNumber(this.totalQuantity, { hasTrailingZero: false })}`;
  }

  private async onSelectIndex() {
    if (!this.model) return;
    this.pageNumber = this.paginationElm.currentPage;
    this.updatePaginationData();
  }

  private updatePaginationData() {
    this.itemStart = (this.pageNumber - 1) * pageSize;
    this.itemEnd = this.itemStart + pageSize;
    this.renderProducts();
  }

  private resetPagination() {
    this.pageNumber = 1;
    this.paginationElm.currentPage = 1;
    this.itemStart = 0;
    this.itemEnd = this.itemStart + pageSize;
  }

  renderProducts(resetPaging?: boolean) {
    if (!this.pnlProducts) return;
    if (resetPaging) {
      this.resetPagination();
    }
    if (!this.products || !this.products.length) {
      this.pnlTotalQuantity.visible = false;
      this.pnlTotalPrice.visible = false;
      this.pnlBtnCheckout.visible = false;
      this.paginationElm.visible = false;
      this.listProductElm = {};
      this.pnlProducts.clearInnerHTML();
      this.pnlProducts.appendChild(
        <i-label
          caption={this.i18n.get('$no_product')}
          font={{ size: '1rem' }}
          padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
          margin={{ left: 'auto', right: 'auto' }}
        />
      );
      return;
    }
    this.totalPage = Math.ceil(this.products.length / pageSize);
    this.paginationElm.visible = this.totalPage > 1;
    this.listProductElm = {};
    const nodeItems: HTMLElement[] = [];
    this.pnlTotalPrice.visible = true;
    this.pnlBtnCheckout.visible = true;
    this.pnlTotalQuantity.visible = true;
    for (let i = 0; i < this.paginatedProducts.length; i++) {
      const product = this.paginatedProducts[i];
      const shoppingCartProduct = new ShoppingCartProduct();
      this.listProductElm[`product-${product.id}`] = shoppingCartProduct;
      shoppingCartProduct.onQuantityUpdated = this.updateQuantity.bind(this);
      shoppingCartProduct.onProductRemoved = this.removeProduct.bind(this);
      shoppingCartProduct.setProduct(product, this.currencyText, this.canRemove);
      nodeItems.push(shoppingCartProduct);
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
        <i-hstack margin={{ top: '1rem', bottom: '1rem' }} justifyContent="end">
          <i-pagination
            id="paginationElm"
            width="auto"
            currentPage={this.pageNumber}
            totalPages={this.totalPage}
            onPageChanged={this.onSelectIndex.bind(this)}
          />
        </i-hstack>
        <i-hstack id="pnlTotalQuantity" gap="1rem" width="100%" margin={{ top: '1rem' }} verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
          <i-label caption="$total_quantity" font={{ size: '1rem', bold: true }} />
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