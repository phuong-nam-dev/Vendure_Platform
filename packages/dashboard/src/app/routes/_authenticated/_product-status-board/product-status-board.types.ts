import z from 'zod';
import { ProductSchema, StockLevelsSchema } from './product-status-board.schema.js';

export type ProductStatus = 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISABLED';

export type Product = z.infer<typeof ProductSchema>;

export type StockLevels = z.infer<typeof StockLevelsSchema>;

export type GetListProductsResponse = {
    products: {
        items: Product[];
        totalItems: number;
    };
};

export enum Status {
    ALL = 'All',
    ENABLED = 'Enabled',
    DISABLED = 'Disabled',
}

export type GetListProductsPayload = {
    filter?: {
        status?: Status;
        search?: string;
    };
    sort?: {
        sortBy: 'NAME' | 'STOCK_LEVEL' | 'STATUS';
        sortOrder: 'ASC' | 'DESC';
    };
    pagination: {
        page: number;
        perPage: number;
    };
};

export type UpdateProductEnabledInput = {
    id: string;
    enabled: boolean;
};
