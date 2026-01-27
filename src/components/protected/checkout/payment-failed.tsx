'use client';

import { Box, Button, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import { useEffect } from 'react';

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.replace(ROUTES.CHECKOUT);
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <Box sx={{
      backgroundColor: '#111',
      borderRadius: '1rem',
      padding: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <Box sx={{
        position: 'relative',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography sx={{
          color: '#FF4444',
          fontSize: '4rem',
        }}>
          ×
        </Typography>
      </Box>

      <Box sx={{
        textAlign: 'center',
      }}>
        <Typography variant="h4" sx={{
          color: '#FF4444',
          fontFamily: 'ClashDisplay-Medium',
          marginBottom: 2,
        }}>
          Payment Failed
        </Typography>
        <Typography sx={{
          color: '#7B7B7B',
          fontFamily: 'Satoshi',
          fontSize: '1.125rem',
          maxWidth: '500px',
          margin: '0 auto',
          marginBottom: 2,
        }}>
          We were unable to process your payment. Please try again or choose a different payment method.
        </Typography>
        <Typography sx={{
          color: '#7B7B7B',
          fontFamily: 'Satoshi',
          fontSize: '1rem',
        }}>
          Order ID: <span style={{ color: '#fff', fontFamily: 'ClashDisplay-Medium' }}>{orderId}</span>
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        gap: 2,
        marginTop: 2,
      }}>
        <Button
          onClick={() => router.push(ROUTES.HOME)}
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
          Back to Home
        </Button>
        <Button
          onClick={() => router.push(`${ROUTES.CHECKOUT}?orderId=${orderId}`)}
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
          Try Again
        </Button>
      </Box>
    </Box>
  );
} 