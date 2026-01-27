'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import { useEffect, useMemo } from 'react';
import { useGetOrder } from '@/hooks/order';
import { ProductType } from '@/lib/api/products';

export default function OrderConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { data: order } = useGetOrder(orderId || '');

  useEffect(() => {
    if (!orderId) {
      router.replace(ROUTES.CHECKOUT);
    }
  }, [orderId, router]);

  const hasPhysicalProducts = useMemo(() => {
    if (!order?.data?.items) return false;
    return order.data.items.some((item) => {
      const product = item.product;
      if (typeof product === 'object' && product !== null && 'type' in product) {
        return product.type === ProductType.PHYSICAL;
      }
      return false;
    });
  }, [order]);

  if (!orderId) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#111',
        borderRadius: '1rem',
        padding: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '120px',
          height: '120px',
        }}
      >
        <Image
          src="/assets/order-success.svg"
          alt="Order Success"
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>

      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontFamily: 'ClashDisplay-Medium',
            marginBottom: 2,
          }}
        >
          Order Confirmed!
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Satoshi',
            fontSize: '1.125rem',
            maxWidth: '500px',
            margin: '0 auto',
            marginBottom: 2,
          }}
        >
          Thank you for your purchase. We&apos;ll send you a confirmation email with your order
          details.
        </Typography>
        {hasPhysicalProducts && order?.data.shippingDetails?.address && (
          <Typography
            sx={{
              color: '#fff',
              fontFamily: 'Satoshi',
              fontSize: '1.125rem',
              maxWidth: '500px',
              margin: '0 auto',
              marginBottom: 2,
            }}
          >
            It will be delivered to: {order.data.shippingDetails.address.street}{' '}
            {order.data.shippingDetails.address.city} {order.data.shippingDetails.address.state}
          </Typography>
        )}
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Satoshi',
            fontSize: '1rem',
          }}
        >
          Order ID:{' '}
          <span style={{ color: '#2AC318', fontFamily: 'ClashDisplay-Medium' }}>{orderId}</span>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginTop: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          onClick={() => router.push(ROUTES.USER.PROFILE)}
          sx={{
            backgroundColor: '#333',
            color: '#FFF',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontFamily: 'ClashDisplay-Medium',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#444',
            },
          }}
        >
          Track your order
        </Button>
        <Button
          onClick={() => router.push(ROUTES.USER.HOME)}
          sx={{
            backgroundColor: '#0B6201',
            color: '#FFF',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontFamily: 'ClashDisplay-Medium',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(42, 195, 24, 0.32)',
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginTop: 2,
        }}
      >
        <Typography
          sx={{
            color: '#7B7B7B',
            fontFamily: 'Satoshi',
            fontSize: '1rem',
          }}
        >
          Delivery takes 1 business day within Lagos and 3–5 business days outside Lagos.
        </Typography>
      </Box>
    </Box>
  );
}
