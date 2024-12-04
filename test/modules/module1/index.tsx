import { Module, customModule, Container } from '@ijstech/components';
import ScomShoppingCart from '@scom/scom-shopping-cart';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private scomShoppingCart: ScomShoppingCart;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
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

    onPaymentSuccess(value: string) {
        console.log("onPaymentSuccess", value);
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
                                id: '1',
                                name: 'Canon minimal',
                                description: 'Black fujifilm DSLR camera',
                                images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 200,
                                quantity: 1,
                                available: 20
                            },
                            {
                                id: '2',
                                name: 'Lens',
                                description: 'Selective focus photography of disassembled camera telephoto lens',
                                images: ['https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 50,
                                quantity: 2,
                                available: 10
                            },
                            {
                                id: '3',
                                name: 'Venus mascara',
                                description: 'Venus HD Make-up',
                                images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                                price: 100,
                                quantity: 1,
                                available: 10
                            }
                        ]}
                        onPaymentSuccess={this.onPaymentSuccess}
                    />
                </i-vstack>
            </i-panel>
        )
    }
}