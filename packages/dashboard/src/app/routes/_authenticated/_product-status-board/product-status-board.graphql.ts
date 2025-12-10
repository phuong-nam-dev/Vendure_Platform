import { graphql } from '@/vdb/index.js';

export const productListDocument = graphql(`
    query ProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                createdAt
                updatedAt
                featuredAsset {
                    id
                    preview
                }
                name
                slug
                enabled
                description
                variants {
                    id
                    stockLevels {
                        id
                        stockOnHand
                        stockAllocated
                    }
                }
            }
            totalItems
        }
    }
`);

export const updateProductEnabled = graphql(`
    mutation UpdateProductEnabled($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            id
            enabled
        }
    }
`);
