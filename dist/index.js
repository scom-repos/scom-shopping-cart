var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-shopping-cart/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textEllipsis = exports.alertStyle = exports.inputStyle = exports.textRight = void 0;
    exports.textRight = components_1.Styles.style({
        textAlign: 'right'
    });
    exports.inputStyle = components_1.Styles.style({
        $nest: {
            'input': {
                textAlign: 'center',
                border: 'none'
            }
        }
    });
    exports.alertStyle = components_1.Styles.style({
        $nest: {
            'i-vstack i-label': {
                textAlign: 'center'
            },
            'span': {
                display: 'inline'
            }
        }
    });
    exports.textEllipsis = components_1.Styles.style({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        WebkitBoxOrient: 'vertical',
    });
});
define("@scom/scom-shopping-cart/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-shopping-cart/formSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-shopping-cart/formSchema.ts'/> 
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    required: true
                },
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                required: true,
                            },
                            name: {
                                type: 'string',
                                required: true
                            },
                            description: {
                                type: 'string'
                            },
                            images: {
                                type: 'array',
                                required: true,
                                items: {
                                    type: 'string',
                                    required: true
                                }
                            },
                            price: {
                                type: 'number',
                                required: true,
                                minimum: 0
                            },
                            quantity: {
                                type: 'integer',
                                required: true,
                                minimum: 1
                            },
                            available: {
                                type: 'integer',
                                required: true,
                                minimum: 0
                            }
                        }
                    }
                },
                canRemove: {
                    type: 'boolean'
                }
            }
        },
        uiSchema: {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/title'
                },
                {
                    type: 'Control',
                    scope: '#/properties/products',
                    options: {
                        detail: {
                            type: 'VerticalLayout'
                        }
                    }
                },
                {
                    type: 'Control',
                    title: 'Allow Remove?',
                    scope: '#/properties/canRemove'
                }
            ]
        }
    };
});
define("@scom/scom-shopping-cart/model.ts", ["require", "exports", "@scom/scom-shopping-cart/formSchema.ts"], function (require, exports, formSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor(module) {
            this.data = { title: '', products: [] };
            this.module = module;
        }
        get products() {
            return this.data.products || [];
        }
        set products(value) {
            this.data.products = value;
            this.updateWidget();
        }
        get currency() {
            if (!this.data.currency)
                return 'USD';
            return this.data.currency;
        }
        set currency(value) {
            this.data.currency = value;
        }
        get currencyText() {
            return this.currency.toUpperCase() === 'USD' ? '$$' : this.currency.toUpperCase();
        }
        get title() {
            return this.data.title || '';
        }
        set title(value) {
            this.data.title = value;
        }
        get totalPrice() {
            return this.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;
        }
        get canRemove() {
            return this.data.canRemove || false;
        }
        set canRemove(value) {
            this.data.canRemove = value;
            this.updateWidget();
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateWidget();
        }
        getTag() {
            return this.module.tag;
        }
        async setTag(value) {
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
            ];
        }
        _getActions() {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { title: '', products: [] };
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this.data));
                                if (builder?.setData)
                                    builder.setData(userInputData);
                            },
                            undo: () => {
                                this.data = JSON.parse(JSON.stringify(oldData));
                                if (builder?.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema
                }
            ];
            return actions;
        }
        addProduct(product) {
            this.data.products.push(product);
        }
        addProducts(products) {
            this.data.products.push(...products);
        }
        removeProduct(id) {
            const idx = this.products.findIndex(v => v.id == id);
            if (idx > -1) {
                this.data.products.splice(idx, 1);
            }
        }
        updateQuantity(id, quantity) {
            const idx = this.products.findIndex(v => v.id == id);
            if (idx > -1) {
                this.data.products[idx] = {
                    ...this.data.products[idx],
                    quantity: quantity
                };
            }
        }
    }
    exports.Model = Model;
});
define("@scom/scom-shopping-cart", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/index.css.ts", "@scom/scom-shopping-cart/model.ts", "@scom/scom-payment-widget"], function (require, exports, components_2, index_css_1, model_1, scom_payment_widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomShoppingCart = class ScomShoppingCart extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {};
            this.initModel();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get products() {
            return this.model.products;
        }
        set products(value) {
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
        set canRemove(value) {
            this.model.canRemove = value;
        }
        getConfigurators() {
            this.initModel();
            return this.model.getConfigurators();
        }
        getData() {
            return this.model.getData();
        }
        async setData(value) {
            this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.model.setTag(value);
        }
        addProduct(product) {
            this.model.addProduct(product);
            this.renderProducts();
        }
        addProducts(products) {
            this.model.addProducts(products);
            this.renderProducts();
        }
        removeProduct(id) {
            this.model.removeProduct(id);
            this.renderProducts();
        }
        updateQuantity(id, quantity) {
            this.model.updateQuantity(id, quantity);
            this.renderProducts();
        }
        renderProducts() {
            if (!this.pnlProducts)
                return;
            if (!this.products || !this.products.length) {
                this.pnlTotal.visible = false;
                this.pnlBtnCheckout.visible = false;
                this.pnlProducts.clearInnerHTML();
                this.pnlProducts.appendChild(this.$render("i-label", { caption: "No products!", font: { size: '1rem' }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, margin: { left: 'auto', right: 'auto' } }));
                return;
            }
            const nodeItems = [];
            for (const product of this.products) {
                const { name, description, images, price, quantity, available } = product;
                let _quantity = Number(quantity);
                const edtQuantity = new components_2.Input(undefined, {
                    value: quantity,
                    inputType: 'number',
                    width: 50,
                    border: { style: 'none' },
                    background: { color: 'transparent' }
                });
                edtQuantity.classList.add(index_css_1.inputStyle);
                edtQuantity.onChanged = () => {
                    const qty = edtQuantity.value;
                    let isInput = true;
                    if (qty === '')
                        return;
                    if (qty < 1) {
                        _quantity = 1;
                        isInput = false;
                    }
                    else if (available && qty > available) {
                        _quantity = available;
                        isInput = false;
                    }
                    else {
                        _quantity = qty;
                    }
                    updateQuantity(isInput);
                };
                edtQuantity.onBlur = () => {
                    const qty = edtQuantity.value;
                    if (qty === '') {
                        _quantity = 1;
                        updateQuantity();
                    }
                };
                const iconMinus = new components_2.Icon(undefined, {
                    name: 'minus-circle',
                    width: 20,
                    height: 20,
                    fill: Theme.text.primary,
                    cursor: _quantity === 1 ? 'default' : 'pointer',
                    enabled: _quantity > 1
                });
                const updateQuantity = (isInput) => {
                    iconMinus.cursor = _quantity === 1 ? 'default' : 'pointer';
                    iconMinus.enabled = _quantity > 1;
                    iconPlus.cursor = available !== undefined && _quantity === available ? 'default' : 'pointer';
                    iconPlus.enabled = available === undefined || _quantity < available;
                    if (!isInput)
                        edtQuantity.value = _quantity;
                    const idx = this.products.findIndex(v => v.id == product.id);
                    this.products[idx] = {
                        ...product,
                        quantity: _quantity
                    };
                    this.lbTotal.caption = `${this.model.currencyText} ${components_2.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })}`;
                };
                iconMinus.onClick = () => {
                    if (_quantity === 1)
                        return;
                    _quantity = _quantity - 1;
                    updateQuantity();
                };
                const iconPlus = new components_2.Icon(undefined, {
                    name: 'plus-circle',
                    width: 20,
                    height: 20,
                    fill: Theme.text.primary,
                    cursor: available !== undefined && _quantity === available ? 'default' : 'pointer',
                    enabled: available === undefined || _quantity < available
                });
                iconPlus.onClick = () => {
                    if (_quantity === available)
                        return;
                    _quantity = _quantity + 1;
                    updateQuantity();
                };
                const handleDelete = () => {
                    this.mdAlert.content = `Are you sure you want to detele <b>${product.name}</b>?`;
                    this.mdAlert.onConfirm = () => confirmDelete();
                    this.mdAlert.showModal();
                };
                const confirmDelete = () => {
                    const idx = this.products.findIndex(v => v.id == product.id);
                    this.products.splice(idx, 1);
                    if (this.products.length) {
                        this.pnlProducts.removeChild(item);
                        this.lbTotal.caption = `${this.model.currencyText} ${components_2.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })}`;
                    }
                    else {
                        this.renderProducts();
                    }
                };
                const item = (this.$render("i-hstack", { gap: "0.5rem", width: "100%", height: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }, wrap: "wrap" },
                    this.$render("i-vstack", { width: 100, height: "auto", horizontalAlignment: "center", background: { color: Theme.text.primary }, border: { radius: 4 }, padding: { top: '0.25rem', left: '0.25rem', bottom: '0.25rem', right: '0.25rem' } },
                        this.$render("i-image", { url: images[0], width: "100%", height: "auto", margin: { left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }, maxHeight: 200, objectFit: "contain", fallbackUrl: "https://placehold.co/600x400?text=No+Image" })),
                    this.$render("i-vstack", { gap: "0.5rem", width: "calc(100% - 13.25rem)", minWidth: "3.5rem" },
                        this.$render("i-label", { caption: name, font: { bold: true } }),
                        this.$render("i-label", { caption: description, font: { color: Theme.text.hint, size: '0.8125rem' }, class: index_css_1.textEllipsis })),
                    this.$render("i-vstack", { gap: "0.5rem", minWidth: 80, margin: { left: 'auto' } },
                        this.canRemove ? this.$render("i-icon", { name: "trash", fill: Theme.colors.error.main, width: 16, height: 16, cursor: "pointer", margin: { left: 'auto' }, onClick: handleDelete.bind(this) }) : [],
                        this.$render("i-label", { caption: `${this.model.currencyText} ${components_2.FormatUtils.formatNumber(price, { decimalFigures: 2 })}`, font: { bold: true }, margin: { left: 'auto' }, class: index_css_1.textRight }),
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "end" },
                            iconMinus,
                            edtQuantity,
                            iconPlus))));
                nodeItems.push(item);
            }
            this.pnlProducts.clearInnerHTML();
            this.pnlProducts.append(...nodeItems);
            this.lbTotal.caption = `${this.model.currencyText} ${components_2.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })}`;
        }
        async handleCheckout() {
            if (!this.scomPaymentWidget) {
                this.scomPaymentWidget = new scom_payment_widget_1.ScomPaymentWidget(undefined, { display: 'block', margin: { top: '1rem' } });
                this.scomPaymentWidget.onPaymentSuccess = this.onPaymentSuccess.bind(this);
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
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model(this);
                this.model.updateWidget = this.renderProducts.bind(this);
            }
        }
        async init() {
            super.init();
            this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
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
            return (this.$render("i-panel", { width: "100%", height: "100%", border: { radius: '0.5rem' }, overflow: "hidden" },
                this.$render("i-vstack", { id: "pnlProducts", gap: "1rem", width: "100%", verticalAlignment: "center" }),
                this.$render("i-hstack", { id: "pnlTotal", gap: "1rem", width: "100%", margin: { top: '1rem' }, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                    this.$render("i-label", { caption: "Total", font: { size: '1rem', bold: true } }),
                    this.$render("i-label", { id: "lbTotal", font: { size: '1rem', bold: true } })),
                this.$render("i-vstack", { id: "pnlBtnCheckout", width: "100%", verticalAlignment: "center" },
                    this.$render("i-button", { caption: "Checkout", width: "100%", maxWidth: 180, minWidth: 90, margin: { top: '1rem', left: 'auto', right: 'auto' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handleCheckout })),
                this.$render("i-alert", { id: "mdAlert", status: "confirm", title: "Confirm Deletion", class: index_css_1.alertStyle })));
        }
    };
    ScomShoppingCart = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-shopping-cart')
    ], ScomShoppingCart);
    exports.default = ScomShoppingCart;
});
