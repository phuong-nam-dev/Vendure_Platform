import z from 'zod';

export const AssetSchema = z.object({
    id: z.string(),
    preview: z.string().url(),
});

export const StockLevelsSchema = z.object({
    id: z.string(),
    stockOnHand: z.number(),
    stockAllocated: z.number(),
});

export const ProductVariantSchema = z.object({
    id: z.string(),
    stockLevels: z.array(StockLevelsSchema),
    stockLevel: z.string().nullish(),
});

export const ProductSchema = z.object({
    id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    featuredAsset: AssetSchema.nullish(),
    name: z.string(),
    slug: z.string(),
    enabled: z.boolean(),
    description: z.string(),
    variants: z.array(ProductVariantSchema),
});
