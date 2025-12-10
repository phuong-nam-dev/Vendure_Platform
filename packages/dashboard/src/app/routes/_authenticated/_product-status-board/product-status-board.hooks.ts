import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { getListProduct, updateProductEnabledServices } from './product-status-board.services.js';
import {
    GetListProductsPayload,
    GetListProductsResponse,
    Status,
    UpdateProductEnabledInput,
} from './product-status-board.types.js';

export const PRODUCT_STATUS_BOARD_QUERY_KEY = 'list-product-status-board';

export function useGetListProducts(
    payload: GetListProductsPayload,
    options?: Omit<UseQueryOptions<unknown, Error, GetListProductsResponse>, 'queryKey' | 'queryFn'>,
) {
    return useQuery({
        queryKey: [PRODUCT_STATUS_BOARD_QUERY_KEY, payload],
        queryFn: async () => {
            const filter: Record<string, any> = {};

            if (payload?.filter?.search) {
                filter.name = { contains: payload.filter.search };
            }

            if (payload?.filter?.status && payload.filter.status !== Status.ALL) {
                filter.enabled = {
                    eq: payload.filter.status === Status.ENABLED ? true : false,
                };
            }

            const optionsQuery: any = {
                skip: (payload?.pagination.page - 1) * payload?.pagination.perPage,
                take: payload?.pagination.perPage,
                filter: Object.keys(filter).length > 0 ? filter : undefined,
                sort: { createdAt: 'DESC' },
            };

            const response = await getListProduct({
                options: optionsQuery,
            });

            return response;
        },
        ...options,
    });
}

export const handleUpdateSuccessEnabledOnCache = ({
    queryKey,
    queryClient,
    id,
    enabled,
}: {
    queryKey: any[];
    queryClient: ReturnType<typeof useQueryClient>;
    id: string;
    enabled: boolean;
}) => {
    return queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            products: {
                ...oldData.products,
                items: oldData.products.items.map((product: any) =>
                    product.id === id ? { ...product, enabled } : product,
                ),
            },
        };
    });
};

export function useToggleEnabled(options?: UseMutationOptions<any, Error, UpdateProductEnabledInput>) {
    return useMutation({
        mutationFn: async payload => updateProductEnabledServices(payload),
        ...options,
    });
}
