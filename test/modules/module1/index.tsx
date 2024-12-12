import { application, Module, customModule, Container } from '@ijstech/components';
import { INetwork } from '@ijstech/eth-wallet';
import { getMulticallInfoList } from '@scom/scom-multicall';
import getNetworkList from '@scom/scom-network-list';
import { IPaymentActivity, IPlaceOrder, ProductType } from '@scom/scom-payment-widget';
import ScomShoppingCart from '@scom/scom-shopping-cart';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private scomShoppingCart: ScomShoppingCart;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        const multicalls = getMulticallInfoList();
        const networkMap = this.getNetworkMap(options.infuraId);
        application.store = {
            infuraId: options.infuraId,
            multicalls,
            networkMap
        }
    }

    private getNetworkMap = (infuraId?: string) => {
        const networkMap = {};
        const defaultNetworkList: INetwork[] = getNetworkList();
        const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
        for (const chainId in defaultNetworkMap) {
            const networkInfo = defaultNetworkMap[chainId];
            const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
            if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                    networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                }
            }
            networkMap[networkInfo.chainId] = {
                ...networkInfo,
                symbol: networkInfo.nativeCurrency?.symbol || "",
                explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
            }
        }
        return networkMap;
    }

    private async onShowConfig() {
        const editor = this.scomShoppingCart.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-shopping-cart',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            minHeight: 400,
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);
    }

    async init() {
        super.init();
    }

    private async handlePlaceMarketplaceOrder(data: IPlaceOrder) {
        console.log('handlePlaceMarketplaceOrder', data);
    }

    private async handlePaymentSuccess(data: IPaymentActivity) {
        console.log('handlePaymentSuccess', data);
    }

    private onUpdateQuantity(id: string, quantity: number) {
        console.log(id, quantity)
    }

    render() {
        return (
            <i-panel
                width="100%"
                padding={{ bottom: '1rem' }}
            >
                <i-vstack
                    verticalAlignment="center"
                    margin={{ top: '1rem', left: 'auto', right: 'auto' }}
                    padding={{ left: '1rem', right: '1rem' }}
                    gap="1rem"
                    width={600}
                    maxWidth="100%"
                >
                    <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                    <i-scom-shopping-cart
                        id="scomShoppingCart"
                        title="Mix Products"
                        onQuantityUpdated={this.onUpdateQuantity}
                        canRemove={true}
                        products={[
                            {
                                id: "cb772b0e-c288-a2b1-8f19-ca9ade20045d",
                                productType: ProductType.Physical,
                                name: "Denzel's Dog Treats x 6",
                                images: ['https://images.unsplash.com/photo-1592468275155-ea8bf1f84360?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                                price: 55.99,
                                available: 200,
                                quantity: 1,
                                stallId: 'b36768bc-b479-6692-94ba-d421eefbe8df',
                                stallUri: '30018:dd2ea973537231c4c04b366acb37993a522b478c7f5705eeabef038e185605c3:b36768bc-b479-6692-94ba-d421eefbe8df'
                            },
                            {
                                id: '2',
                                productType: ProductType.Physical,
                                name: 'Lens',
                                description: 'Selective focus photography of disassembled camera telephoto lens',
                                images: ['https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 50,
                                quantity: 2,
                                available: 10
                            },
                            {
                                id: '3',
                                productType: ProductType.Physical,
                                name: 'Venus mascara',
                                description: 'Venus HD Make-up',
                                images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 100,
                                quantity: 1,
                                available: 10
                            },
                            {
                                id: '4',
                                productType: ProductType.Physical,
                                name: 'Canon minimal - type 2',
                                description: 'Black fujifilm DSLR camera',
                                images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 200,
                                quantity: 1,
                                available: 20
                            },
                            {
                                id: '5',
                                productType: ProductType.Physical,
                                name: 'Lens - type 2',
                                description: 'Selective focus photography of disassembled camera telephoto lens',
                                images: ['https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 50,
                                quantity: 1,
                                available: 10
                            },
                            {
                                id: '6',
                                productType: ProductType.Physical,
                                name: 'Venus mascara - type 2',
                                description: 'Venus HD Make-up',
                                images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 100,
                                quantity: 1,
                                available: 10
                            }
                        ]}
                        onPaymentSuccess={this.handlePaymentSuccess}
                        placeMarketplaceOrder={this.handlePlaceMarketplaceOrder}
                    />
                </i-vstack>
            </i-panel>
        )
    }
}