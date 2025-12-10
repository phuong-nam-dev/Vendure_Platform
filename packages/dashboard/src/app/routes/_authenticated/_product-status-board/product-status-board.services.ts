import { api } from '@/vdb/index.js';
import { productListDocument, updateProductEnabled } from './product-status-board.graphql.js';
import { GetListProductsResponse, UpdateProductEnabledInput } from './product-status-board.types.js';

export const getListProduct = async (variables: { options?: any } = {}) => {
    try {
        const res = await api.query<Promise<GetListProductsResponse>>(productListDocument, {
            options: variables.options,
        });

        if (!res) throw new Error('No response from API');

        return res;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const updateProductEnabledServices = async (variables: UpdateProductEnabledInput) => {
    try {
        const res = await api.mutate(updateProductEnabled, {
            input: {
                ...variables,
            },
        });

        if (!res) throw new Error('No response from API');

        return res;
    } catch (error) {
        console.error('Error updating product enabled status:', error);
        throw error;
    }
};
