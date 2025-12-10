import { Button, Card, CardContent, CardFooter, Switch, VendureImage } from '@/vdb/index.js';
import { useLingui } from '@lingui/react/macro';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
    handleUpdateSuccessEnabledOnCache,
    PRODUCT_STATUS_BOARD_QUERY_KEY,
    useToggleEnabled,
} from '../product-status-board.hooks.js';
import { GetListProductsPayload, Product } from '../product-status-board.types.js';
import { computeAvailableStock, stockStatusClass } from '../product-status-board.utils.js';

const ProductCard = ({
    product,
    payloadFilter,
}: {
    product: Product;
    payloadFilter: GetListProductsPayload;
}) => {
    const { t } = useLingui();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useToggleEnabled();

    const enabledToggleHandler = (productId: string, currentEnabled: boolean) => {
        const queryKey = [PRODUCT_STATUS_BOARD_QUERY_KEY, payloadFilter];

        mutate(
            { id: productId, enabled: !currentEnabled },
            {
                onSuccess: () => {
                    handleUpdateSuccessEnabledOnCache({
                        queryKey,
                        queryClient,
                        id: productId,
                        enabled: !currentEnabled,
                    });

                    toast.success('Product status updated');
                },
                onError: (_err, _vars, context: any) => {
                    if (context?.prev) queryClient.setQueryData(queryKey, context.prev);

                    toast.error(t`Could not update product status`);
                },
            },
        );
    };

    const available = computeAvailableStock(product.variants?.at(0)?.stockLevels);

    const progressCap = Math.max(20, available);

    const percent = Math.min(100, Math.round((available / progressCap) * 100));

    const { badge } = stockStatusClass(available, 10);

    return (
        <Card
            key={product.id}
            className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/20 flex flex-col min-w-[120px]"
        >
            <div
                className="relative w-full bg-muted/30"
                style={{
                    aspectRatio: '1/1',
                    minHeight: '120px',
                }}
            >
                <VendureImage
                    asset={product.featuredAsset}
                    preset="thumb"
                    className="w-full h-full object-contain"
                />
            </div>
            <CardContent className="p-2">
                <p
                    className="text-base font-medium line-clamp-2 break-all min-h-[2.5rem]"
                    title={product.name}
                >
                    {product.name}
                </p>

                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{new Date(product.createdAt).toLocaleDateString()}</span>
                    <span
                        className={`px-2 py-0.5 rounded text-white text-[10px] ${product.enabled ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                        {product.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>

                <div className="mt-2 flex justify-end">
                    <Switch
                        disabled={isPending}
                        checked={product.enabled}
                        onCheckedChange={() => enabledToggleHandler(product.id, product.enabled)}
                        className="cursor-pointer"
                    />
                </div>

                <div className="mt-3">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600">Stock</span>
                        <span className="font-medium text-sm">{available}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${available <= 0 ? 'bg-red-500' : available <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${percent}%` }}
                            role="progressbar"
                            aria-valuenow={available}
                            aria-valuemin={0}
                            aria-valuemax={progressCap}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${badge}`}
                            >
                                {available <= 0 ? 'Out' : available <= 10 ? 'Low stock' : 'In stock'}
                            </span>
                            <span className="text-slate-400">
                                On hand:{' '}
                                {product?.variants
                                    ?.at(0)
                                    ?.stockLevels?.reduce((s, l) => s + (l.stockOnHand ?? 0), 0) ?? 0}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 p-2">
                <Link
                    to={`/products/${product.id}`}
                    params={{ productId: product.id }}
                    key={product.id}
                    className="w-full"
                >
                    <Button className="w-full cursor-pointer" variant={'secondary'}>
                        {t`Open in product detail`} <ChevronRight />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
