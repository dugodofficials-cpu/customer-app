import { apiClient } from './client';

export enum ProductType {
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
  BUNDLE = 'BUNDLE',
  EBOOK = 'EBOOK',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: string;
}

export interface DigitalDeliveryInfo {
  accessKey: string;
  fileSize: number;
  downloadUrl: string;
  expiryDays: number;
  maxDownloads: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ProductType;
  status?: ProductStatus;
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  exclude?: string;
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface Product {
  _id: string;
  name: string;
  album: string;
  albumId: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
  albumPrice: number;
  color: string;
  description: string;
  sku: string;
  price: number;
  type: ProductType;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  images: string[];
  sizes: ProductSize[];

  dimensions?: ProductDimensions;
  stockQuantity?: number;
  lowStockThreshold?: number;

  digitalDeliveryInfo?: DigitalDeliveryInfo;

  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  trackList?: string;
  duration?: string;
  buttonText?: string;
  albumImage?: string;
  bundleTier?: 'platinum' | 'diamond' | 'gold';
  bundleItems?: {
    productId: string;
    quantity: number;
    title: string;
  }[];
  bundlePrice?: number;
}

export interface ProductById {
  data: Product;
  message: string;
}

export interface DownloadMediaResponse {
  message: string;
  data: {
    url: string;
    expiresIn: number;
  };
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedDigitalProducts {
  data: {
    album: string;
    albumPrice: number;
    totalTracks: number;
    coverImage: string;
    products: Product[];
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedAlbumProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getDigitalAlbums = async (
  params: ProductsQueryParams = {}
): Promise<PaginatedDigitalProducts> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  return apiClient<PaginatedDigitalProducts>(`products/digital/albums?${queryParams.toString()}`);
};

export const getPhysicalProducts = async (
  params: ProductsQueryParams = {}
): Promise<PaginatedProducts> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  if (params.exclude) {
    queryParams.append('exclude', params.exclude);
  }

  return apiClient<PaginatedProducts>(`products?${queryParams.toString()}`);
};

export const getProducts = () => {
  return apiClient('/products');
};

export const getProductsByAlbum = (albumName: string) => {
  return apiClient<PaginatedAlbumProducts>(`/products/album/${albumName}`);
};

export const getProductById = (id: string): Promise<ProductById> => {
  return apiClient<ProductById>(`/products/${id}`);
};

export const downloadMedia = (id: string) => {
  return apiClient<DownloadMediaResponse>(`/products/${id}/download`);
};

export interface SendEmailNotificationParams {
  productId: string;
  uploaderEmail?: string;
  downloaderEmail?: string;
  productName?: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  message: string;
}

export const sendUploadCompletionEmail = async (
  params: SendEmailNotificationParams
): Promise<EmailNotificationResponse> => {
  return apiClient<EmailNotificationResponse>('products/upload-complete-email', {
    method: 'POST',
    body: params,
  });
};
