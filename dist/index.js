var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-shopping-cart/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductType = void 0;
    ///<amd-module name='@scom/scom-shopping-cart/interface.ts'/> 
    var ProductType;
    (function (ProductType) {
        ProductType["Physical"] = "Physical";
        ProductType["Digital"] = "Digital";
        ProductType["Course"] = "Course";
        ProductType["Ebook"] = "Ebook";
        ProductType["Membership"] = "Membership";
        ProductType["Bundle"] = "Bundle";
    })(ProductType = exports.ProductType || (exports.ProductType = {}));
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
    exports.Model = exports.MAX_PRODUCTS = void 0;
    exports.MAX_PRODUCTS = 5;
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
        get totalQuantity() {
            return this.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        }
        get canRemove() {
            return this.data.canRemove || false;
        }
        set canRemove(value) {
            this.data.canRemove = value;
            this.updateWidget();
        }
        get isShowAllVisible() {
            return this.products.length > exports.MAX_PRODUCTS;
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
        clear() {
            this.data.products = [];
        }
    }
    exports.Model = Model;
});
define("@scom/scom-shopping-cart/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.productListStyle = exports.buttonStyle = exports.textEllipsis = exports.alertStyle = exports.inputStyle = exports.textRight = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
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
    exports.buttonStyle = components_1.Styles.style({
        width: '100%',
        maxWidth: 180,
        minWidth: 90,
        marginTop: '1rem',
        marginInline: 'auto',
        padding: '0.5rem 0.75rem',
        fontSize: '1rem',
        color: Theme.colors.primary.contrastText,
        background: Theme.colors.primary.main,
        borderRadius: 12
    });
    exports.productListStyle = components_1.Styles.style({
        display: 'block !important',
        maxHeight: 'calc(100vh - 240px)',
        overflow: 'auto',
        paddingRight: '0.25rem',
        $nest: {
            '&::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar': {
                height: '8px',
                width: '8px',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: '#63666A 0% 0% no-repeat padding-box'
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#808080 0% 0% no-repeat padding-box'
            },
        }
    });
});
define("@scom/scom-shopping-cart/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-shopping-cart/translations.json.ts'/> 
    exports.default = {
        "en": {
            "shoppingCart": "Shopping Cart",
            "showAll": "Show All",
            "total": "Total",
            "totalQuantity": "Total Quantity",
            "checkout": "Checkout",
            "noProduct": "No products!",
            "confirmDeletion": "Confirm Deletion",
            "areYouSureYouWantToDelete": "Are you sure you want to detele"
        },
        "zh-hant": {
            "shoppingCart": "購物車",
            "showAll": "顯示全部",
            "total": "總計",
            "totalQuantity": "總數量",
            "checkout": "結帳",
            "noProduct": "沒有產品！",
            "confirmDeletion": "確認刪除",
            "areYouSureYouWantToDelete": "您確定要刪除嗎？"
        },
        "vi": {
            "shoppingCart": "Giỏ hàng",
            "showAll": "Hiển thị tất cả",
            "total": "Tổng cộng",
            "totalQuantity": "Tổng số lượng",
            "checkout": "Thanh toán",
            "noProduct": "Không có sản phẩm!",
            "confirmDeletion": "Xác nhận xóa",
            "areYouSureYouWantToDelete": "Bạn có chắc chắn muốn xóa không?"
        }
    };
});
define("@scom/scom-shopping-cart/components/product.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/components/index.css.ts", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_2, index_css_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ShoppingCartProduct = class ShoppingCartProduct extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.canRemove = false;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        setProduct(product, currency, canRemove) {
            this.product = product;
            this.currency = currency || 'USD';
            this.canRemove = canRemove || false;
            this.renderProduct();
        }
        renderProduct() {
            if (!this.imgProduct || !this.product)
                return;
            const { images, price, name, description, quantity, available } = this.product;
            if (images && images.length) {
                this.imgProduct.url = images[0];
            }
            this.lbName.caption = name;
            this.lbDescription.caption = description || '';
            if (description) {
                this.lbDescription.tooltip.content = description;
            }
            this.lbPrice.caption = `${this.currency} ${components_2.FormatUtils.formatNumber(price, { decimalFigures: 2 })}`;
            this.edtQuantity.value = quantity;
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = available == null || available > quantity;
            this.iconRemove.visible = this.canRemove;
        }
        handleDelete() {
            this.mdAlert.title = this.i18n.get('$confirmDeletion');
            this.mdAlert.content = `${this.i18n.get('$areYouSureYouWantToDelete')} <b>${this.product.name}</b>?`;
            this.mdAlert.showModal();
        }
        onConfirmDelete() {
            if (this.onProductRemoved) {
                this.onProductRemoved(this.product.id);
            }
        }
        updateQuantity(isIncremental) {
            let quantity = Number(this.edtQuantity.value);
            const available = this.product.available;
            if (isIncremental) {
                if (available == null || available > quantity) {
                    this.edtQuantity.value = ++quantity;
                }
            }
            else {
                if (quantity > 1) {
                    this.edtQuantity.value = --quantity;
                }
            }
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = available == null || available > quantity;
            if (this.onQuantityUpdated)
                this.onQuantityUpdated(this.product.id, quantity);
        }
        increaseQuantity() {
            this.updateQuantity(true);
        }
        decreaseQuantity() {
            this.updateQuantity(false);
        }
        handleQuantityChanged() {
            const available = this.product.available;
            const quantity = Number(this.edtQuantity.value) || 1;
            if (!Number.isInteger(quantity)) {
                this.edtQuantity.value = Math.trunc(quantity);
            }
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = available == null || available > this.edtQuantity.value;
            if (this.onQuantityUpdated)
                this.onQuantityUpdated(this.product.id, quantity);
        }
        updateQuantityFromParent(quantity) {
            this.edtQuantity.value = quantity;
            const available = this.product.available;
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = available == null || available > quantity;
        }
        initTranslations(translations) {
            this.i18n.init({ ...translations });
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
            this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
            const currency = this.getAttribute('currency', true, this.currency);
            const product = this.getAttribute('product', true, this.product);
            const canRemove = this.getAttribute('canRemove', true, this.canRemove);
            this.setProduct(product, currency, canRemove);
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-hstack", { gap: "0.5rem", width: "100%", height: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }, wrap: "wrap" },
                    this.$render("i-vstack", { width: 100, height: "auto", horizontalAlignment: "center", background: { color: Theme.text.primary }, border: { radius: 4 }, padding: { top: '0.25rem', left: '0.25rem', bottom: '0.25rem', right: '0.25rem' }, alignSelf: "start" },
                        this.$render("i-image", { id: "imgProduct", width: "100%", height: "auto", margin: { left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }, maxHeight: 200, objectFit: "contain", fallbackUrl: "https://placehold.co/600x400?text=No+Image" })),
                    this.$render("i-vstack", { gap: "0.5rem", width: "calc(100% - 13.25rem)", minWidth: "3.5rem" },
                        this.$render("i-label", { id: "lbName", font: { bold: true, size: '0.875rem' } }),
                        this.$render("i-label", { id: "lbDescription", font: { color: Theme.text.hint, size: '0.8125rem' }, class: index_css_1.textEllipsis })),
                    this.$render("i-vstack", { gap: "0.5rem", minWidth: 80, margin: { left: 'auto' } },
                        this.$render("i-icon", { id: "iconRemove", visible: false, name: "trash", fill: Theme.colors.error.dark, width: 16, height: 16, cursor: "pointer", margin: { left: 'auto' }, onClick: this.handleDelete.bind(this) }),
                        this.$render("i-label", { id: "lbPrice", font: { bold: true, size: '0.875rem' }, margin: { left: 'auto' }, class: index_css_1.textRight }),
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "end" },
                            this.$render("i-icon", { id: "iconMinus", enabled: false, name: "minus-circle", width: 20, height: 20, fill: Theme.text.primary, cursor: "pointer", onClick: this.decreaseQuantity }),
                            this.$render("i-input", { id: "edtQuantity", class: index_css_1.inputStyle, width: 40, height: "auto", inputType: "number", border: { style: 'none' }, background: { color: 'transparent' }, onChanged: this.handleQuantityChanged }),
                            this.$render("i-icon", { id: "iconPlus", enabled: false, name: "plus-circle", width: 20, height: 20, fill: Theme.text.primary, cursor: "pointer", onClick: this.increaseQuantity })))),
                this.$render("i-alert", { id: "mdAlert", status: "confirm", class: index_css_1.alertStyle, onConfirm: this.onConfirmDelete })));
        }
    };
    ShoppingCartProduct = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-shopping-cart--product')
    ], ShoppingCartProduct);
    exports.default = ShoppingCartProduct;
});
define("@scom/scom-shopping-cart/components/productList.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/components/product.tsx", "@scom/scom-shopping-cart/model.ts", "@scom/scom-shopping-cart/components/index.css.ts", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_3, product_1, model_1, index_css_2, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ShoppingCartProductList = class ShoppingCartProductList extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.listProductElm = {};
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        get products() {
            return this.model.products;
        }
        set products(value) {
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
        handleCheckout() {
            if (this.onCheckout)
                this.onCheckout();
        }
        removeProduct(id) {
            if (this.onProductRemoved)
                this.onProductRemoved(id);
            this.updateTotalValues();
        }
        updateQuantity(id, quantity) {
            if (this.onQuantityUpdated)
                this.onQuantityUpdated(id, quantity);
            this.updateTotalValues();
        }
        handleRemoveProduct(id) {
            const elm = this.listProductElm[`product-${id}`];
            if (elm && this.pnlProducts.contains(elm)) {
                this.pnlProducts.removeChild(elm);
            }
            this.updateTotalValues();
        }
        updateQuantityFromParent(id, quantity) {
            this.listProductElm[`product-${id}`]?.updateQuantityFromParent(quantity);
            this.updateTotalValues();
        }
        updateTotalValues() {
            this.lbTotalPrice.caption = `${this.currencyText} ${components_3.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })}`;
            this.lbTotalQuantity.caption = `${components_3.FormatUtils.formatNumber(this.totalQuantity, { hasTrailingZero: false })}`;
        }
        renderProducts(isLimited) {
            if (!this.pnlProducts)
                return;
            if (!this.products || !this.products.length) {
                this.pnlTotalQuantity.visible = false;
                this.pnlTotalPrice.visible = false;
                this.pnlBtnCheckout.visible = false;
                this.pnlProducts.classList.remove(index_css_2.productListStyle);
                this.listProductElm = {};
                this.pnlProducts.clearInnerHTML();
                this.pnlProducts.appendChild(this.$render("i-label", { caption: "$noProduct", font: { size: '1rem' }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, margin: { left: 'auto', right: 'auto' } }));
                return;
            }
            this.listProductElm = {};
            const nodeItems = [];
            const isLimitedProducts = isLimited && this.model.isShowAllVisible;
            this.pnlTotalPrice.visible = !isLimitedProducts;
            this.pnlBtnCheckout.visible = !isLimitedProducts;
            this.pnlTotalQuantity.visible = true;
            const length = isLimitedProducts ? model_1.MAX_PRODUCTS : this.products.length;
            for (let i = 0; i < length; i++) {
                const product = this.products[i];
                const shoppingCartProduct = new product_1.default();
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
                this.pnlProducts.classList.remove(index_css_2.productListStyle);
            }
            else {
                this.pnlProducts.classList.add(index_css_2.productListStyle);
            }
            this.pnlProducts.clearInnerHTML();
            this.pnlProducts.append(...nodeItems);
            this.updateTotalValues();
        }
        initTranslations(translations) {
            this.i18n.init({ ...translations });
        }
        async init() {
            this.initTranslations(translations_json_2.default);
            super.init();
            this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
            this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
            this.onCheckout = this.getAttribute('onCheckout', true) || this.onCheckout;
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-vstack", { id: "pnlProducts", gap: "1rem", width: "100%", verticalAlignment: "center" }),
                this.$render("i-hstack", { id: "pnlTotalQuantity", gap: "1rem", width: "100%", margin: { top: '1rem' }, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                    this.$render("i-label", { caption: "$totalQuantity", font: { size: '1rem', bold: true } }),
                    this.$render("i-label", { id: "lbTotalQuantity", font: { size: '1rem', bold: true } })),
                this.$render("i-hstack", { id: "pnlTotalPrice", gap: "1rem", width: "100%", margin: { top: '1rem' }, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                    this.$render("i-label", { caption: "$total", font: { size: '1rem', bold: true } }),
                    this.$render("i-label", { id: "lbTotalPrice", font: { size: '1rem', bold: true } })),
                this.$render("i-vstack", { id: "pnlBtnCheckout", width: "100%", verticalAlignment: "center" },
                    this.$render("i-button", { caption: "$checkout", class: index_css_2.buttonStyle, onClick: this.handleCheckout }))));
        }
    };
    ShoppingCartProductList = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-shopping-cart--product-list')
    ], ShoppingCartProductList);
    exports.default = ShoppingCartProductList;
});
define("@scom/scom-shopping-cart/components/index.ts", ["require", "exports", "@scom/scom-shopping-cart/components/index.css.ts", "@scom/scom-shopping-cart/components/productList.tsx"], function (require, exports, index_css_3, productList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShoppingCartProductList = exports.buttonStyle = void 0;
    Object.defineProperty(exports, "buttonStyle", { enumerable: true, get: function () { return index_css_3.buttonStyle; } });
    exports.ShoppingCartProductList = productList_1.default;
});
define("@scom/scom-shopping-cart", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/interface.ts", "@scom/scom-shopping-cart/model.ts", "@scom/scom-payment-widget", "@scom/scom-shopping-cart/components/index.ts", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_4, interface_1, model_2, scom_payment_widget_1, index_1, translations_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductType = void 0;
    Object.defineProperty(exports, "ProductType", { enumerable: true, get: function () { return interface_1.ProductType; } });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomShoppingCart = class ScomShoppingCart extends components_4.Module {
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
            if (!this.model.products.length) {
                this.renderProducts();
                return;
            }
            if (this.productListElm) {
                if (this.model.products.length === model_2.MAX_PRODUCTS) {
                    this.renderProducts(true);
                }
                else {
                    this.productListElm.handleRemoveProduct(id);
                }
            }
            if (this.allProductListElm) {
                this.allProductListElm.handleRemoveProduct(id);
            }
        }
        updateQuantity(id, quantity) {
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
        handleUpdateQuantity(id, quantity) {
            this.updateQuantity(id, quantity);
            if (this.onQuantityUpdated) {
                this.onQuantityUpdated(id, quantity);
            }
        }
        handleRemoveProduct(id) {
            this.removeProduct(id);
            if (this.onProductRemoved)
                this.onProductRemoved(id);
        }
        renderProducts(updateLimited) {
            if (!this.productListElm)
                return;
            this.productListElm.renderProducts(true);
            const isShowAllVisible = this.model.isShowAllVisible;
            this.wrapperShowAll.visible = isShowAllVisible;
            if (isShowAllVisible && this.allProductListElm && !updateLimited) {
                this.allProductListElm.renderProducts();
            }
        }
        async handleShowAll() {
            if (!this.allProductListElm) {
                this.allProductListElm = new index_1.ShoppingCartProductList();
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
        handlePaymentSuccess(status) {
            if (this.allProductListElm)
                this.allProductListElm.closeModal();
            if (this.onPaymentSuccess)
                this.onPaymentSuccess(status);
        }
        async handleCheckout() {
            if (!this.scomPaymentWidget) {
                this.scomPaymentWidget = new scom_payment_widget_1.ScomPaymentWidget(undefined, { display: 'block', margin: { top: '1rem' } });
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
        initModel() {
            if (!this.model) {
                this.model = new model_2.Model(this);
                this.model.updateWidget = this.renderProducts.bind(this);
            }
        }
        async init() {
            super.init();
            this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
            this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
            this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
            const translationsProp = this.getAttribute('translations', true);
            this._translations = { ...translations_json_3.default, ...translationsProp };
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
            return (this.$render("i-panel", { width: "100%", height: "100%", border: { radius: '0.5rem' }, overflow: "hidden" },
                this.$render("i-scom-shopping-cart--product-list", { id: "productListElm", onCheckout: this.handleCheckout, onProductRemoved: this.handleRemoveProduct, onQuantityUpdated: this.handleUpdateQuantity }),
                this.$render("i-vstack", { id: "wrapperShowAll", visible: false, width: "100%", verticalAlignment: "center" },
                    this.$render("i-button", { id: "btnShowAll", class: index_1.buttonStyle, onClick: this.handleShowAll }))));
        }
    };
    ScomShoppingCart = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-shopping-cart')
    ], ScomShoppingCart);
    exports.default = ScomShoppingCart;
});
