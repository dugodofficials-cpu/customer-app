import { apiClient } from './client';
import { Product, ProductType } from './products';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingDetails {
  address: Address;
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryStatus: DeliveryStatus;
  deliveryNotes?: string;
}

export interface DigitalDeliveryDetails {
  email: string;
  downloadLinks: string[];
  accessKeys: string[];
  expiryDate?: Date;
  downloadCount: number;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  total: number;
  selectedOptions?: string[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];

  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;

  status: OrderStatus;
  paymentStatus: string;

  shippingDetails?: ShippingDetails;
  digitalDeliveryDetails?: DigitalDeliveryDetails;

  orderedAt: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;

  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  currency?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderResponse {
  data: Order;
  message: string;
}

export interface UserOrdersResponse {
  data: Order[];
  message: string;
}

export const createOrder = async (params: Partial<Order>): Promise<OrderResponse> => {
  return apiClient<OrderResponse>(`orders`, {
    method: 'POST',
    body: params,
  });
};

export const getOrder = async (id: string): Promise<OrderResponse> => {
  return apiClient<OrderResponse>(`orders/${id}`, {
    method: 'GET',
  });
};

export const getUserOrders = async (
  userId: string,
  params: {
    page?: number;
    limit?: number;
    type?: ProductType;
    includeBundleItems?: boolean;
  }
): Promise<UserOrdersResponse> => {
  return apiClient<UserOrdersResponse>(
    `orders/user/${userId}?page=${params.page}&limit=${params.limit}&type=${params.type}&includeBundleItems=${params.includeBundleItems || false}`,
    {
      method: 'GET',
    }
  );
};
