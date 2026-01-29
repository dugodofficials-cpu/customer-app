import {
  downloadMedia,
  DownloadMediaResponse,
  getDigitalAlbums,
  getPhysicalProducts,
  getProductById,
  getProductsByAlbum,
  PaginatedDigitalProducts,
  PaginatedProducts,
  ProductById,
  ProductsQueryParams,
  sendUploadCompletionEmail,
} from '@/lib/api/products';
import { ROUTES } from '@/util/paths';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/user';

export const useProducts = (params: ProductsQueryParams = {}) => {
  return useQuery<PaginatedDigitalProducts, Error>({
    queryKey: ['products', params],
    queryFn: () => getDigitalAlbums(params),
  });
};

export const usePhysicalProducts = (params: ProductsQueryParams = {}) => {
  return useQuery<PaginatedProducts, Error>({
    queryKey: ['physical-products', params],
    queryFn: () => getPhysicalProducts(params),
    staleTime: 1000 * 60 * 1, // 5 minutes
  });
};

export const useProductsByAlbum = (albumName: string) => {
  const router = useRouter();
  const query = useQuery({
    queryKey: ['products', 'album', albumName],
    queryFn: () => getProductsByAlbum(albumName),
    enabled: !!albumName,
    retry: false,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Failed to fetch songs from album:', query.error);
      enqueueSnackbar('Failed to load songs from album. Please try again later.', {
        variant: 'error',
      });
      router.push(ROUTES.MUSIC);
    }
  }, [query.isError, query.error]);

  return query;
};

export const useProductById = (id: string) => {
  const router = useRouter();
  const query = useQuery<ProductById, Error>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Failed to fetch product:', query.error);
      enqueueSnackbar('Failed to load product. Please try again later.', { variant: 'error' });
      router.push(ROUTES.SHOP.HOME);
    }
  }, [query.isError, query.error]);

  return query;
};

export const useDownloadMedia = () => {
  const { user } = useUser();
  
  return useMutation<DownloadMediaResponse, Error, { id: string; isDownloaded: boolean; productName?: string }>({
    mutationFn: (params: { id: string; isDownloaded?: boolean; productName?: string }) => downloadMedia(params.id),
    onSuccess: async (data, params) => {
      const mediaData = {
        url: data.data.url,
        expiresAt: new Date(Date.now() + data.data.expiresIn * 1000).getTime(),
      };
      localStorage.setItem(`dugod_media_${params.id}`, JSON.stringify(mediaData));
      if (params.isDownloaded) {
        window.open(data.data.url, '_blank');
      }

      try {
        await sendUploadCompletionEmail({
          productId: params.id,
          downloaderEmail: user?.email,
          productName: params.productName,
        });
      } catch (error) {
        console.error('Failed to send upload completion email:', error);
      }
    },
    onError: () => {
      enqueueSnackbar('Failed to download media', { variant: 'error' });
    },
  });
};

export const getSavedMediaUrl = (id: string): string | null => {
  if (typeof window === 'undefined') return null;

  const storedData = localStorage.getItem(`dugod_media_${id}`);
  if (!storedData) return null;

  try {
    const mediaData = JSON.parse(storedData);
    const now = new Date().getTime();

    if (now > mediaData.expiresAt) {
      localStorage.removeItem(`dugod_media_${id}`);
      return null;
    }

    return mediaData.url;
  } catch {
    localStorage.removeItem(`dugod_media_${id}`);
    return null;
  }
};
