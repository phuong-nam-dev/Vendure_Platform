import {
    Button,
    cn,
    Input,
    Page,
    PageBlock,
    PageTitle,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/vdb/index.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader2, LucideFileWarning, Search, X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import ProductCard from './components/product-card.js';
import { useGetListProducts } from './product-status-board.hooks.js';
import { GetListProductsPayload, GetListProductsResponse, Status } from './product-status-board.types.js';

export const Route = createFileRoute('/_authenticated/_product-status-board/product-status-board')({
    component: ProductStatusBoard,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            page: (search.page as number) || 1,
            perPage: (search.perPage as number) || 24,
        };
    },
});

function ProductStatusBoard() {
    const [search, setSearch] = useState('');

    const searchParams = Route.useSearch();

    const debouncedSearch = useDebounce(search, 500);

    const perPage = (searchParams.perPage as number) || 24;

    const page = (searchParams.page as number) || 1;

    const status = searchParams.status || Status.ALL;

    const payloadFilter: GetListProductsPayload = {
        filter: {
            search: debouncedSearch,
            status,
        },
        pagination: {
            page,
            perPage: perPage,
        },
    };

    const { data: productsData, isPending, isFetching, isError, refetch } = useGetListProducts(payloadFilter);

    if (isError) return <ErrorProductsStatusBoard isFetching={isFetching} refetch={() => refetch()} />;

    return (
        <Page pageId="product-status-board">
            <PageTitle>
                <Trans>Product Status Board</Trans>
            </PageTitle>

            <PageBlock
                blockId="product-status-board"
                column="main"
                className="h-[calc(100vh-146px)]"
                classNameCardContent={cn('flex flex-col gap-4 justify-between h-full')}
            >
                <ProductFilter search={search} onChangeSearch={value => setSearch(value)} />

                {isPending ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ProductContentContainer>
                        <ProductContent productsData={productsData} payloadFilter={payloadFilter} />
                    </ProductContentContainer>
                )}

                <ProductPagination productsData={productsData} />
            </PageBlock>
        </Page>
    );
}

const ErrorProductsStatusBoard = ({ isFetching, refetch }: { isFetching: boolean; refetch: () => void }) => {
    const { t } = useLingui();

    return (
        <Page pageId="product-status-board" className="h-full p-4">
            <PageTitle>
                <Trans>Product Status Board</Trans>
            </PageTitle>
            <PageBlock
                blockId="product-status-board"
                column="main"
                className="h-[calc(100vh-208px)] flex items-center justify-center"
            >
                <div className="max-w-xl w-full rounded-2xl p-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <LucideFileWarning className="w-10 h-10 text-red-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">{t`Failed to load products`}</h3>
                    <p className="text-sm text-white mb-4">{t`An unexpected error occurred.`}</p>
                    <p className="text-xs text-white mb-4">
                        {t`If the problem persists, contact the admin.`}
                    </p>

                    <div className="flex justify-center gap-3">
                        <Button onClick={() => refetch()} className="px-4 py-2">
                            {isFetching ? 'Retrying…' : 'Retry'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => window.location.reload()}
                            className="px-4 py-2"
                        >
                            {t`Reload page`}
                        </Button>
                    </div>
                </div>
            </PageBlock>
        </Page>
    );
};

const ProductFilter = ({
    search,
    onChangeSearch,
}: {
    search: string;
    onChangeSearch: (value: string) => void;
}) => {
    const { t } = useLingui();

    const [status, setStatus] = useState<string>('');

    const navigate = useNavigate({ from: Route.fullPath });

    const onClear = () => {
        onChangeSearch('');
        navigate({
            search: (prev: any) => {
                const updated = { ...prev, page: 1, perPage: 24 };
                delete updated.search;
                return updated;
            },
        });
    };

    const handleChangeStatus = (value: string) => {
        setStatus(value);
        navigate({
            search: (prev: any) => {
                return { ...prev, status: value, page: 1 };
            },
        });
    };

    return (
        <div className="space-y-4 flex-shrink-0">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow flex items-center gap-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assets..."
                        value={search}
                        onChange={e => onChangeSearch(e.target.value)}
                        className="pl-8"
                    />
                    {search && (
                        <Button variant="ghost" size="sm" onClick={onClear} className="absolute right-0">
                            <X className="h-4 w-4 mr-1" /> {t`Clear filters`}
                        </Button>
                    )}
                </div>
                <Select value={status} onValueChange={handleChangeStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Status.ALL}>All</SelectItem>
                        <SelectItem value={Status.ENABLED}>Enabled</SelectItem>
                        <SelectItem value={Status.DISABLED}>Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const ProductContentContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    (props, ref) => {
        return (
            <div
                className="h-full max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden flex-1"
                ref={ref}
            >
                <div
                    data-product-status-board
                    className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-1"
                >
                    {props.children}
                </div>
            </div>
        );
    },
);

const ProductContent = ({
    productsData,
    payloadFilter,
}: {
    productsData?: GetListProductsResponse;
    payloadFilter: GetListProductsPayload;
}) => {
    const { t } = useLingui();

    const items = productsData?.products.items || [];

    if (items.length === 0) {
        return (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <img
                    src="/empty_product.webp"
                    alt={t`No results`}
                    className="mx-auto mb-4 h-24 w-24 object-contain"
                />
                <div>{t`No results`}</div>
            </div>
        );
    }

    return items.map(product => (
        <ProductCard key={product.id} product={product} payloadFilter={payloadFilter} />
    ));
};

const ProductPagination = ({ productsData }: { productsData?: GetListProductsResponse }) => {
    const { t } = useLingui();

    const searchParams = Route.useSearch();

    const perPage = (searchParams.perPage as number) || 24;

    const page = (searchParams.page as number) || 1;

    const totalItems = productsData?.products.totalItems || 0;

    const totalPages = Math.ceil(totalItems / perPage);

    const navigate = useNavigate({ from: Route.fullPath });

    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        navigate({
            search: (prev: any) => ({ ...prev, page: newPage }),
        });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        navigate({
            search: (prev: any) => ({ ...prev, page: 1, perPage: newPageSize }),
        });
    };

    return (
        <div className="flex justify-end flex-col md:flex-row items-center md:justify-between gap-4 flex-shrink-0">
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t`Items per page`}</span>
                <Select
                    value={(perPage || 0).toString()}
                    onValueChange={value => {
                        const newPageSize = parseInt(value, 10);
                        handlePageSizeChange(newPageSize);
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[12, 24, 48, 96].map(size => (
                            <SelectItem key={size} value={`${size}`}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {totalPages > 1 && (
                <Pagination className="w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                size="default"
                                onClick={e => {
                                    e.preventDefault();
                                    goToPage(page - 1);
                                }}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {page > 2 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(1);
                                    }}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {page > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {page > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(page - 1);
                                    }}
                                >
                                    {page - 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {page}
                            </PaginationLink>
                        </PaginationItem>

                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(page + 1);
                                    }}
                                >
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {page < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {page < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        goToPage(totalPages);
                                    }}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    goToPage(page + 1);
                                }}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};
