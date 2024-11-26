export default {
    dataSchema: {
        type: 'object',
        properties: {
            products: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        description: {
                            type: 'string'
                        },
                        image: {
                            type: 'string',
                            required: true
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
                        }
                    }
                }
            }
        }
    },
    uiSchema: {
        type: 'VerticalLayout',
        elements: [

            {
                type: 'Control',
                scope: '#/properties/products',
                options: {
                    detail: {
                        type: 'VerticalLayout'
                    }
                }
            }
        ]
    }
}