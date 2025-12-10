import { Product, ProductStatus, StockLevels } from './product-status-board.types.js';

export function computeTotalOnHand(stockLevels?: StockLevels[] | null): number {
    if (!stockLevels || stockLevels.length === 0) return 0;
    return stockLevels.reduce((s, l) => s + (l.stockOnHand ?? 0), 0);
}

export function computeTotalAllocated(stockLevels?: StockLevels[] | null): number {
    if (!stockLevels || stockLevels.length === 0) return 0;
    return stockLevels.reduce((s, l) => s + (l.stockAllocated ?? 0), 0);
}

export function computeAvailableStock(stockLevels?: StockLevels[] | null): number {
    const onHand = computeTotalOnHand(stockLevels);
    const allocated = computeTotalAllocated(stockLevels);
    const avail = onHand - allocated;
    return avail > 0 ? avail : 0;
}

export function computeStatus(product: Product, lowStockThreshold = 10): ProductStatus {
    if (!product.enabled) return 'DISABLED';
    const avail = computeAvailableStock(product?.variants?.at(0)?.stockLevels);
    if (avail <= 0) return 'OUT_OF_STOCK';
    if (avail <= lowStockThreshold) return 'LOW_STOCK';
    return 'ACTIVE';
}

export function stockStatusClass(available: number, lowThreshold = 10) {
    if (available <= 0) return { tone: 'out', badge: 'bg-red-600 text-white' };
    if (available <= lowThreshold) return { tone: 'low', badge: 'bg-yellow-600 text-black' };
    return { tone: 'ok', badge: 'bg-green-600 text-white' };
}
