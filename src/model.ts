import { Module } from '@ijstech/components';
import { IShoppingCartProduct, IShoppingCart, ICryptoPayoutOption } from './interface';
import formSchema from './formSchema';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import { Utils } from '@ijstech/eth-wallet';

export class Model {
  private module: Module;
  private data: IShoppingCart = { title: '', products: [] };
  updateWidget: (reset: boolean) => void;

  constructor(module: Module) {
    this.module = module;
  }

  get products() {
    return this.data.products || [];
  }

  set products(value: IShoppingCartProduct[]) {
    this.data.products = value;
    this.updateWidget(true);
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

  get cryptoPayoutOptions() {
    return this.data.cryptoPayoutOptions || [];
  }

  get stripeAccountId() {
    return this.data.stripeAccountId;
  }

  get totalPrice() {
    return this.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;
  }

  get totalQuantity() {
    return this.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get returnUrl() {
    return this.data.returnUrl;
  }

  set returnUrl(value: string) {
    this.data.returnUrl = value;
  }

  get baseStripeApi() {
    return this.data.baseStripeApi;
  }

  set baseStripeApi(value: string) {
    this.data.baseStripeApi = value;
  }

  get canRemove() {
    return this.data.canRemove || false;
  }

  set canRemove(value: boolean) {
    this.data.canRemove = value;
    this.updateWidget(true);
  }

  getData() {
    return this.data;
  }

  async setData(value: IShoppingCart) {
    this.data = value;
    this.updateWidget(true);
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

  addProduct(product: IShoppingCartProduct) {
    this.data.products.push(product);
  }

  addProducts(products: IShoppingCartProduct[]) {
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

  clear() {
    this.data.products = [];
  }

  mergeI18nData(i18nData: Record<string, any>[]) {
    const mergedI18nData: Record<string, any> = {};
    for (let i = 0; i < i18nData.length; i++) {
      const i18nItem = i18nData[i];
      if (!i18nItem) continue;
      for (const key in i18nItem) {
        mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
      }
    }
    return mergedI18nData;
  }

  getNetworks() {
    const cryptoPayoutOptions = this.cryptoPayoutOptions;
    const chainIds = cryptoPayoutOptions.reduce((result: string[], item: ICryptoPayoutOption) => {
      if (item.chainId && !result.includes(item.chainId)) result.push(item.chainId);
      return result;
    }, []);
    return chainIds.map(chainId => ({ chainId: Number(chainId) }));
  }

  getTokens() {
    const tokenAddressMap: Record<string, string[]> = {};
    const tokens: ITokenObject[] = [];
    for (let option of this.cryptoPayoutOptions) {
      const tokenAddress = !option.tokenAddress || option.tokenAddress === Utils.nullAddress ? undefined : option.tokenAddress;
      if (!tokenAddressMap[option.networkCode]) tokenAddressMap[option.networkCode] = [];
      tokenAddressMap[option.networkCode].push(tokenAddress);
    }
    for (let networkCode in tokenAddressMap) {
      const tokenAddresses = tokenAddressMap[networkCode];
      tokens.push(...tokenStore.getTokenListByNetworkCode(networkCode).filter(v => tokenAddresses.includes(v.address)));
    }
    return tokens;
  }
}
