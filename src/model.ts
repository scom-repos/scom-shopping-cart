import { Module } from '@ijstech/components';
import { IProduct, IShoppingCart } from './interface';
import formSchema from './formSchema';

export class Model {
  private module: Module;
  private data: IShoppingCart = { products: [] };
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
    if (!this.data.currency || this.data.currency.toUpperCase() === 'USD') return '$$';
    return this.data.currency;
  }

  set currency(value: string) {
    this.data.currency = value;
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
          let oldData: IShoppingCart = { products: [] };
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

}
