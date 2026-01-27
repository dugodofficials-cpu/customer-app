import * as z from 'zod';
import { ProductType, ProductStatus, ProductSize } from '../api/products';

export const productDimensionsSchema = z.object({
  length: z.number().min(0, 'Length must be a positive number'),
  width: z.number().min(0, 'Width must be a positive number'),
  height: z.number().min(0, 'Height must be a positive number'),
  weight: z.number().min(0, 'Weight must be a positive number'),
  unit: z.string().min(1, 'Unit is required'),
});

export const digitalDeliveryInfoSchema = z.object({
  fileFormat: z.string().min(1, 'File format is required'),
  fileSize: z.number().min(0, 'File size must be a positive number'),
  downloadLink: z.string().url('Invalid download URL').optional(),
  streamingLink: z.string().url('Invalid streaming URL').optional(),
  accessExpiryDate: z.date().optional(),
});

const baseProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  album: z.string().min(1, 'Album name is required'),
  albumPrice: z.number().min(0, 'Album price must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  type: z.nativeEnum(ProductType, {
    errorMap: () => ({ message: 'Invalid product type' }),
  }),
  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({ message: 'Invalid product status' }),
  }),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  sizes: z.array(z.enum(['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as [ProductSize, ...ProductSize[]])),
  isActive: z.boolean(),
});

export const physicalProductSchema = baseProductSchema.extend({
  type: z.literal(ProductType.PHYSICAL),
  dimensions: productDimensionsSchema,
  stockQuantity: z.number().min(0, 'Stock quantity must be a positive number'),
  lowStockThreshold: z.number().min(0, 'Low stock threshold must be a positive number'),
});

export const digitalProductSchema = baseProductSchema.extend({
  type: z.literal(ProductType.DIGITAL),
  digitalDeliveryInfo: digitalDeliveryInfoSchema,
  trackList: z.string().optional(),
  duration: z.string().optional(),
  buttonText: z.string().optional(),
  albumImage: z.string().url('Invalid album image URL').optional(),
});

export const productSchema = z.discriminatedUnion('type', [
  physicalProductSchema,
  digitalProductSchema,
]);

export const productQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  type: z.nativeEnum(ProductType).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  exclude: z.string().optional(),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than or equal to minimum price',
    path: ['maxPrice'],
  }
);

export type ProductDimensions = z.infer<typeof productDimensionsSchema>;
export type DigitalDeliveryInfo = z.infer<typeof digitalDeliveryInfoSchema>;
export type PhysicalProduct = z.infer<typeof physicalProductSchema>;
export type DigitalProduct = z.infer<typeof digitalProductSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
