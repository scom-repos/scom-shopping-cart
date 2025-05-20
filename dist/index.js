var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
define("@scom/scom-shopping-cart/model.ts", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/formSchema.ts", "@scom/scom-token-list", "@ijstech/eth-wallet"], function (require, exports, components_1, formSchema_1, scom_token_list_1, eth_wallet_1) {
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
            this.updateWidget(true);
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
        get cryptoPayoutOptions() {
            return this.data.cryptoPayoutOptions || [];
        }
        get stripeAccountId() {
            return this.data.stripeAccountId;
        }
        get rewardsPointsOptions() {
            return this.data.rewardsPointsOptions || [];
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
        set returnUrl(value) {
            this.data.returnUrl = value;
        }
        get baseStripeApi() {
            return this.data.baseStripeApi;
        }
        set baseStripeApi(value) {
            this.data.baseStripeApi = value;
        }
        get canRemove() {
            return this.data.canRemove || false;
        }
        set canRemove(value) {
            this.data.canRemove = value;
            this.updateWidget(true);
        }
        get env() {
            return this._env;
        }
        set env(value) {
            this._env = value;
        }
        get isOnTelegram() {
            return this.env === "tg";
        }
        get isAvailableOnTelegram() {
            return !!this.stripeAccountId || this.cryptoPayoutOptions?.find(opt => ['TON', 'TON-TESTNET'].includes(opt.networkCode)) != null;
        }
        get hasInactiveProducts() {
            return this.products.some(v => {
                const { time, quantity, available } = v;
                if (time && (0, components_1.moment)().isSameOrAfter(time * 1000))
                    return true;
                if (available && quantity > available)
                    return true;
                return false;
            });
        }
        get canCheckoutOnTelegram() {
            return !this.isOnTelegram || this.isAvailableOnTelegram;
        }
        get canCheckout() {
            return !this.hasInactiveProducts && this.canCheckoutOnTelegram;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateWidget(true);
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
        mergeI18nData(i18nData) {
            const mergedI18nData = {};
            for (let i = 0; i < i18nData.length; i++) {
                const i18nItem = i18nData[i];
                if (!i18nItem)
                    continue;
                for (const key in i18nItem) {
                    mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
                }
            }
            return mergedI18nData;
        }
        getNetworks() {
            const cryptoPayoutOptions = this.cryptoPayoutOptions;
            const chainIds = cryptoPayoutOptions.reduce((result, item) => {
                if (item.chainId && !result.includes(item.chainId))
                    result.push(item.chainId);
                return result;
            }, []);
            return chainIds.map(chainId => ({ chainId: Number(chainId) }));
        }
        getTokens() {
            const tokenAddressMap = {};
            const tokens = [];
            for (let option of this.cryptoPayoutOptions) {
                const tokenAddress = !option.tokenAddress || option.tokenAddress === eth_wallet_1.Utils.nullAddress ? undefined : option.tokenAddress;
                if (!tokenAddressMap[option.networkCode])
                    tokenAddressMap[option.networkCode] = [];
                tokenAddressMap[option.networkCode].push(tokenAddress);
            }
            for (let networkCode in tokenAddressMap) {
                const tokenAddresses = tokenAddressMap[networkCode];
                tokens.push(...scom_token_list_1.tokenStore.getTokenListByNetworkCode(networkCode).filter(v => tokenAddresses.includes(v.address)));
            }
            return tokens;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-shopping-cart/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buttonStyle = exports.textEllipsis = exports.alertStyle = exports.inputStyle = exports.textRight = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.textRight = components_2.Styles.style({
        textAlign: 'right'
    });
    exports.inputStyle = components_2.Styles.style({
        $nest: {
            'input': {
                textAlign: 'center',
                border: 'none'
            }
        }
    });
    exports.alertStyle = components_2.Styles.style({
        $nest: {
            'i-vstack i-label': {
                textAlign: 'center'
            },
            'span': {
                display: 'inline'
            }
        }
    });
    exports.textEllipsis = components_2.Styles.style({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        WebkitBoxOrient: 'vertical',
    });
    exports.buttonStyle = components_2.Styles.style({
        width: '100%',
        maxWidth: 180,
        minWidth: 90,
        marginTop: '1rem',
        marginInline: 'auto',
        padding: '0.5rem 0.75rem',
        fontSize: '1rem',
        color: Theme.colors.primary.contrastText,
        background: Theme.colors.primary.main,
        borderRadius: 12,
        $nest: {
            '&.disabled': {
                background: Theme.action.disabled,
                color: Theme.text.primary
            }
        }
    });
});
define("@scom/scom-shopping-cart/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-shopping-cart/translations.json.ts'/> 
    exports.default = {
        "en": {
            "total": "Total",
            "total_quantity": "Total Quantity",
            "checkout": "Checkout",
            "no_product": "No products!",
            "confirm_deletion": "Confirm Deletion",
            "are_you_sure_you_want_to_delete_this_product": "Are you sure you want to detele this product?",
            "not_supported_on_telegram": "Not supported on Telegram",
            "minute": "minute",
            "minutes": "minutes",
            "hour": "hour",
            "hours": "hours",
            "day": "day",
            "days": "days",
            "booking_closed": "Booking closed",
            "left_in_stock": "Only {{number}} left in stock",
            "spots_left": "Only {{number}} spots left",
        },
        "zh-hant": {
            "total": "總計",
            "total_quantity": "總數量",
            "checkout": "結帳",
            "no_product": "沒有產品！",
            "confirm_deletion": "確認刪除",
            "are_you_sure_you_want_to_delete_this_product": "您確定要刪除這個產品嗎？",
            "not_supported_on_telegram": "不支援Telegram",
            "minute": "分鐘",
            "minutes": "分鐘",
            "hour": "小時",
            "hours": "小時",
            "day": "天",
            "days": "天",
            "booking_closed": "預訂已關閉",
            "left_in_stock": "僅剩 {{number}} 件庫存",
            "spots_left": "僅剩 {{number}} 個名額",
        },
        "vi": {
            "total": "Tổng cộng",
            "total_quantity": "Tổng số lượng",
            "checkout": "Thanh toán",
            "no_product": "Không có sản phẩm!",
            "confirm_deletion": "Xác nhận xóa",
            "are_you_sure_you_want_to_delete_this_product": "Bạn có chắc chắn muốn xóa sản phẩm này không?",
            "not_supported_on_telegram": "Không được hỗ trợ trên Telegram",
            "minute": "phút",
            "minutes": "phút",
            "hour": "giờ",
            "hours": "giờ",
            "day": "ngày",
            "days": "ngày",
            "booking_closed": "Đặt chỗ đã đóng",
            "left_in_stock": "Chỉ còn lại {{number}} tồn kho",
            "spots_left": "Chỉ còn lại {{number}} chỗ",
        }
    };
});
define("@scom/scom-shopping-cart/components/product.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/components/index.css.ts", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_3, index_css_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ShoppingCartProduct = class ShoppingCartProduct extends components_3.Module {
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
        async renderProduct() {
            if (!this.imgProduct || !this.product)
                return;
            const { images, price, name, description, quantity } = this.product;
            if (images && images.length) {
                this.imgProduct.url = images[0];
            }
            this.lbName.caption = name;
            if (description) {
                const plainText = await this.markdownDescription.toPlainText(description);
                this.markdownDescription.load(plainText || "");
            }
            else {
                this.markdownDescription.load("");
            }
            if (description && innerWidth <= 480) {
                this.markdownDescription.tooltip.content = description;
            }
            this.renderReservationProductInfo();
            this.lbPrice.caption = `${this.currency} ${components_3.FormatUtils.formatNumber(price, { decimalFigures: 6, hasTrailingZero: false })}`;
            this.edtQuantity.value = quantity;
            this.iconRemove.visible = this.canRemove;
            this.checkAvailableProduct(quantity);
        }
        checkAvailableProduct(quantity) {
            const { available, time } = this.product;
            let isWarningShown = false;
            let warningText = '';
            const isBookingClosed = time && (0, components_3.moment)().isSameOrAfter(time * 1000);
            if (isBookingClosed) {
                isWarningShown = true;
                warningText = this.i18n.get('$booking_closed');
            }
            else if (available && quantity > available) {
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
        renderReservationProductInfo() {
            const { parentProductId, serviceName, providerName, time, duration, durationUnit } = this.product;
            if (!parentProductId) {
                this.pnlReservationProduct.visible = false;
                return;
            }
            this.lbServiceName.caption = serviceName || '-';
            this.lbProviderName.caption = providerName || '-';
            this.lbTime.caption = time ? (0, components_3.moment)(time * 1000).format('DD MMM YYYY, hh:mm A') : '-';
            this.lbDuration.caption = duration ? `${duration} ${this.getDurationUnit(durationUnit, duration)}` : '-';
            this.pnlReservationProduct.visible = true;
        }
        getDurationUnit(unit, value) {
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
        handleDelete() {
            this.mdAlert.title = this.i18n.get('$confirm_deletion');
            this.mdAlert.content = this.i18n.get('$are_you_sure_you_want_to_delete_this_product');
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
            this.checkAvailableProduct(quantity);
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
            const quantity = Number(this.edtQuantity.value) || 1;
            if (!Number.isInteger(quantity)) {
                this.edtQuantity.value = Math.trunc(quantity);
            }
            this.checkAvailableProduct(quantity);
            if (this.onQuantityUpdated)
                this.onQuantityUpdated(this.product.id, quantity);
        }
        handleQuantityClicked() { }
        updateQuantityFromParent(quantity) {
            this.edtQuantity.value = quantity;
            this.checkAvailableProduct(quantity);
        }
        navigateTo(path) {
            const useHash = location.hash.startsWith('#/') || location.hash.startsWith('#!/');
            const url = useHash ? `/#!${path}` : path;
            history.pushState({ path }, "", url);
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        handleProductClick() {
            if (this.product.parentProductId) {
                this.navigateTo(`/product/${this.product.stallId}/${this.product.parentProductId}/${this.product.id}`);
            }
            else {
                this.navigateTo(`/product/${this.product.stallId}/${this.product.id}`);
            }
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
            return (this.$render("i-panel", { width: "100%", height: "100%", minHeight: 80 },
                this.$render("i-hstack", { gap: "0.5rem", width: "100%", height: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: '0.75rem', style: 'solid', width: 1, color: '#ffffff4d' }, cursor: "pointer", onClick: this.handleProductClick },
                    this.$render("i-vstack", { width: 100, height: "auto", horizontalAlignment: "center", background: { color: Theme.text.primary }, border: { radius: 4 }, padding: { top: '0.25rem', left: '0.25rem', bottom: '0.25rem', right: '0.25rem' }, alignSelf: "start", stack: { shrink: '0' } },
                        this.$render("i-image", { id: "imgProduct", width: "100%", height: "auto", margin: { left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }, maxHeight: 200, objectFit: "contain", fallbackUrl: "https://placehold.co/600x400?text=No+Image" })),
                    this.$render("i-vstack", { width: "100%", minWidth: "3.5rem" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", gap: "0.5rem" },
                            this.$render("i-label", { id: "lbName", minWidth: 0, overflowWrap: "break-word", font: { bold: true, size: '1rem' } }),
                            this.$render("i-icon", { id: "iconRemove", visible: false, name: "trash", fill: Theme.colors.error.dark, width: 20, height: 20, padding: { top: 2, bottom: 2, left: 2, right: 2 }, stack: { shrink: '0' }, cursor: "pointer", onClick: this.handleDelete.bind(this) })),
                        this.$render("i-markdown", { id: "markdownDescription", width: "100%", class: index_css_1.textEllipsis, font: { color: Theme.text.hint, size: '0.8125rem' } }),
                        this.$render("i-stack", { id: "pnlReservationProduct", visible: false, direction: "vertical", gap: "0.5rem", margin: { top: '0.5rem', bottom: '0.5rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: "briefcase", width: 14, height: 14, fill: Theme.text.hint }),
                                this.$render("i-label", { id: "lbServiceName", class: index_css_1.textEllipsis, lineClamp: 1, font: { size: '0.8125rem' } })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: "user", width: 14, height: 14, fill: Theme.text.hint }),
                                this.$render("i-label", { id: "lbProviderName", class: index_css_1.textEllipsis, lineClamp: 1, font: { size: '0.8125rem' } })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: "calendar-check", width: 14, height: 14, fill: Theme.text.hint }),
                                this.$render("i-label", { id: "lbTime", wordBreak: "break-word", font: { size: '0.8125rem' } })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: "clock", width: 14, height: 14, fill: Theme.text.hint }),
                                this.$render("i-label", { id: "lbDuration", class: index_css_1.textEllipsis, font: { size: '0.8125rem' } }))),
                        this.$render("i-stack", { direction: "horizontal", alignItems: "center", justifyContent: "space-between", wrap: "wrap", margin: { top: 'auto' } },
                            this.$render("i-label", { id: "lbPrice", font: { size: '1rem' } }),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "end", margin: { left: 'auto' } },
                                this.$render("i-icon", { id: "iconMinus", enabled: false, name: "minus-circle", width: 24, height: 24, padding: { top: 2, bottom: 2, left: 2, right: 2 }, fill: Theme.text.primary, cursor: "pointer", onClick: this.decreaseQuantity }),
                                this.$render("i-input", { id: "edtQuantity", class: index_css_1.inputStyle, width: 40, height: "auto", inputType: "number", border: { style: 'none' }, background: { color: 'transparent' }, onChanged: this.handleQuantityChanged, onClick: this.handleQuantityClicked }),
                                this.$render("i-icon", { id: "iconPlus", enabled: false, name: "plus-circle", width: 24, height: 24, padding: { top: 2, bottom: 2, left: 2, right: 2 }, fill: Theme.text.primary, cursor: "pointer", onClick: this.increaseQuantity }))),
                        this.$render("i-label", { id: "lbWarning", visible: false, font: { size: '0.8125rem', color: Theme.colors.error.main, bold: true }, class: "text-right", margin: { top: '0.25rem', left: 'auto' } }))),
                this.$render("i-alert", { id: "mdAlert", status: "confirm", class: index_css_1.alertStyle, onConfirm: this.onConfirmDelete })));
        }
    };
    ShoppingCartProduct = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-shopping-cart--product')
    ], ShoppingCartProduct);
    exports.default = ShoppingCartProduct;
});
define("@scom/scom-shopping-cart/components/productList.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/components/product.tsx", "@scom/scom-shopping-cart/components/index.css.ts", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_4, product_1, index_css_2, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const pageSize = 5;
    let ShoppingCartProductList = class ShoppingCartProductList extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.listProductElm = {};
            this.totalPage = 0;
            this.pageNumber = 0;
            this.itemStart = 0;
            this.itemEnd = pageSize;
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
        get paginatedProducts() {
            return this.products.slice(this.itemStart, this.itemEnd);
        }
        handleCheckout() {
            const canCheckout = !this.model.isOnTelegram || this.model.isAvailableOnTelegram;
            if (canCheckout && this.onCheckout)
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
        handleRemoveProduct(id, idx) {
            if ((this.products.length % pageSize) === 0 && idx === this.products.length) {
                this.pageNumber = this.pageNumber - 1;
                this.paginationElm.currentPage = this.pageNumber;
            }
            this.updatePaginationData();
        }
        updateQuantityFromParent(id, quantity) {
            this.listProductElm[`product-${id}`]?.updateQuantityFromParent(quantity);
            this.updateTotalValues();
            this.btnCheckout.enabled = this.model.canCheckout;
        }
        updateTotalValues() {
            this.lbTotalPrice.caption = `${this.currencyText} ${components_4.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 6, hasTrailingZero: false })}`;
        }
        async onSelectIndex() {
            if (!this.model)
                return;
            this.pageNumber = this.paginationElm.currentPage;
            this.updatePaginationData();
        }
        updatePaginationData() {
            this.itemStart = (this.pageNumber - 1) * pageSize;
            this.itemEnd = this.itemStart + pageSize;
            this.renderProducts();
        }
        resetPagination() {
            this.pageNumber = 1;
            this.paginationElm.currentPage = 1;
            this.itemStart = 0;
            this.itemEnd = this.itemStart + pageSize;
        }
        renderProducts(resetPaging) {
            if (!this.pnlProducts)
                return;
            if (resetPaging) {
                this.resetPagination();
            }
            if (!this.products || !this.products.length) {
                this.pnlTotalPrice.visible = false;
                this.pnlBtnCheckout.visible = false;
                this.paginationElm.visible = false;
                this.listProductElm = {};
                this.pnlProducts.clearInnerHTML();
                this.pnlProducts.appendChild(this.$render("i-label", { caption: this.i18n.get('$no_product'), font: { size: '1rem' }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, margin: { left: 'auto', right: 'auto' } }));
                return;
            }
            this.totalPage = Math.ceil(this.products.length / pageSize);
            this.paginationElm.visible = this.totalPage > 1;
            this.listProductElm = {};
            const nodeItems = [];
            this.btnCheckout.caption = this.i18n.get(this.model.canCheckoutOnTelegram ? "$checkout" : "$not_supported_on_telegram");
            this.btnCheckout.enabled = this.model.canCheckout;
            this.pnlTotalPrice.visible = true;
            this.pnlBtnCheckout.visible = true;
            for (let i = 0; i < this.paginatedProducts.length; i++) {
                const product = this.paginatedProducts[i];
                const shoppingCartProduct = new product_1.default();
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
                this.$render("i-hstack", { margin: { top: '1rem', bottom: '1rem' }, justifyContent: "end" },
                    this.$render("i-pagination", { id: "paginationElm", width: "auto", currentPage: this.pageNumber, totalPages: this.totalPage, onPageChanged: this.onSelectIndex.bind(this) })),
                this.$render("i-hstack", { id: "pnlTotalPrice", gap: "1rem", width: "100%", margin: { top: '1rem' }, verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                    this.$render("i-label", { caption: "$total", font: { size: '1rem', bold: true } }),
                    this.$render("i-label", { id: "lbTotalPrice", font: { size: '1rem', bold: true } })),
                this.$render("i-vstack", { id: "pnlBtnCheckout", width: "100%", verticalAlignment: "center" },
                    this.$render("i-button", { id: "btnCheckout", caption: "$checkout", class: index_css_2.buttonStyle, onClick: this.handleCheckout }))));
        }
    };
    __decorate([
        (0, components_4.observable)()
    ], ShoppingCartProductList.prototype, "totalPage", void 0);
    ShoppingCartProductList = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-shopping-cart--product-list')
    ], ShoppingCartProductList);
    exports.default = ShoppingCartProductList;
});
define("@scom/scom-shopping-cart/components/index.ts", ["require", "exports", "@scom/scom-shopping-cart/components/productList.tsx"], function (require, exports, productList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShoppingCartProductList = void 0;
    exports.ShoppingCartProductList = productList_1.default;
});
define("@scom/scom-shopping-cart", ["require", "exports", "@ijstech/components", "@scom/scom-shopping-cart/model.ts", "@scom/scom-payment-widget", "@scom/scom-shopping-cart/translations.json.ts"], function (require, exports, components_5, model_1, scom_payment_widget_1, translations_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ScomShoppingCart = class ScomShoppingCart extends components_5.Module {
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
        get returnUrl() {
            return this.model.returnUrl;
        }
        get baseStripeApi() {
            return this.model.baseStripeApi;
        }
        get currency() {
            return this.model.currency;
        }
        get cryptoPayoutOptions() {
            return this.model.cryptoPayoutOptions;
        }
        get stripeAccountId() {
            return this.model.stripeAccountId;
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
            const idx = this.products.findIndex(v => v.id === id);
            this.model.removeProduct(id);
            if (!this.model.products.length) {
                this.renderProducts(true);
                return;
            }
            if (this.productListElm) {
                this.productListElm.handleRemoveProduct(id, idx);
            }
        }
        updateQuantity(id, quantity) {
            this.model.updateQuantity(id, quantity);
            if (this.productListElm) {
                this.productListElm.updateQuantityFromParent(id, quantity);
            }
        }
        clear() {
            this.model.clear();
            this.renderProducts(true);
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
        renderProducts(resetPaging) {
            if (!this.productListElm)
                return;
            this.productListElm.renderProducts(resetPaging);
        }
        async handlePaymentSuccess(data) {
            if (this.onPaymentSuccess)
                await this.onPaymentSuccess(data);
        }
        async handlePlaceMarketplaceOrder(data) {
            if (this.placeMarketplaceOrder)
                await this.placeMarketplaceOrder(data);
        }
        async handleFetchRewardsPointBalance(creatorId, communityId) {
            let balance = 0;
            if (this.fetchRewardsPointBalance) {
                balance = await this.fetchRewardsPointBalance(creatorId, communityId);
            }
            return balance;
        }
        async handleCheckout() {
            if (!this.scomPaymentWidget) {
                this.scomPaymentWidget = new scom_payment_widget_1.ScomPaymentWidget(undefined, { display: 'block', margin: { top: '1rem' } });
                this.scomPaymentWidget.returnUrl = this.returnUrl;
                this.scomPaymentWidget.baseStripeApi = this.baseStripeApi;
                this.scomPaymentWidget.onPaymentSuccess = this.handlePaymentSuccess.bind(this);
                this.scomPaymentWidget.placeMarketplaceOrder = this.handlePlaceMarketplaceOrder.bind(this);
                this.scomPaymentWidget.fetchRewardsPointBalance = this.handleFetchRewardsPointBalance.bind(this);
                this.appendChild(this.scomPaymentWidget);
                await this.scomPaymentWidget.ready();
            }
            this.scomPaymentWidget.isOnTelegram = this.model.isOnTelegram;
            this.scomPaymentWidget.networks = this.model.getNetworks();
            this.scomPaymentWidget.tokens = this.model.getTokens();
            this.scomPaymentWidget.onStartPayment({
                title: this.title,
                products: this.products,
                currency: this.currency,
                cryptoPayoutOptions: this.model.cryptoPayoutOptions,
                stripeAccountId: this.model.stripeAccountId,
                rewardsPointsOptions: this.model.rewardsPointsOptions
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
            this.onQuantityUpdated = this.getAttribute('onQuantityUpdated', true) || this.onQuantityUpdated;
            this.onProductRemoved = this.getAttribute('onProductRemoved', true) || this.onProductRemoved;
            this.placeMarketplaceOrder = this.getAttribute('placeMarketplaceOrder', true) || this.placeMarketplaceOrder;
            this.fetchRewardsPointBalance = this.getAttribute('fetchRewardsPointBalance', true) || this.fetchRewardsPointBalance;
            const translationsProp = this.getAttribute('translations', true);
            this._translations = this.model.mergeI18nData([translations_json_3.default, translationsProp]);
            this.i18n.init({ ...this._translations });
            this.productListElm.initTranslations(this._translations);
            this.productListElm.model = this.model;
            this.model.env = this.getAttribute('env', true);
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const title = this.getAttribute('title', true, this.title);
                const currency = this.getAttribute('currency', true, this.currency);
                const products = this.getAttribute('products', true, this.products);
                const cryptoPayoutOptions = this.getAttribute('cryptoPayoutOptions', true, this.cryptoPayoutOptions);
                const stripeAccountId = this.getAttribute('stripeAccountId', true, this.stripeAccountId);
                const returnUrl = this.getAttribute('returnUrl', true, this.returnUrl);
                const baseStripeApi = this.getAttribute('baseStripeApi', true, this.baseStripeApi);
                const canRemove = this.getAttribute('canRemove', true, this.canRemove || false);
                if (products) {
                    this.setData({
                        title,
                        products,
                        cryptoPayoutOptions,
                        stripeAccountId,
                        currency,
                        returnUrl,
                        baseStripeApi,
                        canRemove,
                    });
                }
            }
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", border: { radius: '0.5rem' }, overflow: "hidden" },
                this.$render("i-scom-shopping-cart--product-list", { id: "productListElm", onCheckout: this.handleCheckout, onProductRemoved: this.handleRemoveProduct, onQuantityUpdated: this.handleUpdateQuantity })));
        }
    };
    ScomShoppingCart = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-shopping-cart')
    ], ScomShoppingCart);
    exports.default = ScomShoppingCart;
});
