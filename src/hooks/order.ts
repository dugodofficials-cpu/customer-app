import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Order,
  OrderResponse,
  UserOrdersResponse,
  createOrder as createOrderApi,
  getOrder as getOrderApi,
  getUserOrders as getUserOrdersApi,
} from '@/lib/api/order';
import { useSnackbar } from 'notistack';
import { ProductType } from '@/lib/api/products';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<OrderResponse, Error, Partial<Order>>({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create order', {
        variant: 'error',
      });
    },
  });
};

export const useGetOrder = (id: string) => {
  return useQuery<OrderResponse, Error, OrderResponse>({
    queryKey: ['order', id],
    queryFn: () => getOrderApi(id),
  });
};

export const useGetUserOrders = (
  userId: string,
  params: {
    page?: number;
    limit?: number;
    type?: ProductType;
    includeBundleItems?: boolean;
  }
) => {
  return useQuery<UserOrdersResponse, Error, UserOrdersResponse>({
    queryKey: ['userOrders', userId, params],
    queryFn: () => getUserOrdersApi(userId, params),
  });
};
