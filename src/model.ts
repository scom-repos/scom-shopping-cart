import { Module } from '@ijstech/components';
import { IProduct, IShoppingCart } from './interface';
import formSchema from './formSchema';

export class Model {
  private module: Module;
  private data: IShoppingCart = { title: '', products: [] };
  updateWidget: () => void;

  constructor(module: Module) {
    this.module = module;
  }

  get products() {
    return this.data.products || [];
  }

  set products(value: IProduct[]) {
    this.data.products = value;
    this.updateWidget();
  }

  get currency() {
    if (!this.data.currency) return 'USD';
    return this.data.currency;
  }

  set currency(value: string) {
    this.data.currency = value;
  }

  get currencyText() {
    return this.currency.toUpperCase() === 'USD' ? '$$' : this.currency.toUpperCase();
  }

  get title() {
    return this.data.title || '';
  }

  set title(value: string) {
    this.data.title = value;
  }

  get totalPrice() {
    return this.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;
  }

  getData() {
    return this.data;
  }

  async setData(value: IShoppingCart) {
    this.data = value;
    this.updateWidget();
  }

  getTag() {
    return this.module.tag;
  }

  async setTag(value: any) {
    this.module.tag = value;
  }

  getConfigurators() {
    return [
      {
        name: 'Editor',
        target: 'Editor',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private _getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: IShoppingCart = { title: '', products: [] };
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify(this.data));
              if (builder?.setData) builder.setData(userInputData);
            },
            undo: () => {
              this.data = JSON.parse(JSON.stringify(oldData));
              if (builder?.setData) builder.setData(this.data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema
      }
    ]
    return actions;
  }

  addProduct(product: IProduct) {
    this.data.products.push(product);
  }

  addProducts(products: IProduct[]) {
    this.data.products.push(...products);
  }

  removeProduct(id: string | number) {
    const idx = this.products.findIndex(v => v.id == id);
    if (idx > -1) {
      this.data.products.splice(idx, 1);
    }
  }

  updateQuantity(id: string | number, quantity: number) {
    const idx = this.products.findIndex(v => v.id == id);
    if (idx > -1) {
      this.data.products[idx] = {
        ...this.data.products[idx],
        quantity: quantity
      };
    }
  }
}
