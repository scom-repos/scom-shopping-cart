export default {
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
}