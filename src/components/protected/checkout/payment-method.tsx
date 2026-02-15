'use client';

import { Box, Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import PaystackPop from '@paystack/inline-js';
import CryptoPaymentForm from './crypto-payment-form';
import { useUser } from '@/hooks/user';
import { v4 as uuidv4 } from 'uuid';
import { useGetOrder } from '@/hooks/order';
import { useSnackbar } from 'notistack';
import { useCart, useUpdateCartStatus } from '@/hooks/cart';
import { CartStatus } from '@/lib/api/cart';

interface PaymentMethodProps {
  onNext: (step?: number) => void;
  onBack: (step?: number) => void;
  hasPhysicalItems: boolean;
}

export default function PaymentMethod({ onNext, onBack, hasPhysicalItems }: PaymentMethodProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCryptoForm, setShowCryptoForm] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const user = useUser();
  const { data: order } = useGetOrder(orderId || '');
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateCartStatus } = useUpdateCartStatus();
  const { data: cart } = useCart();

  const handleSubmit = (event: React.FormEvent, paymentMethod: string) => {
    event.preventDefault();
    
    if (paymentMethod === 'crypto') {
      setShowCryptoForm(true);
      return;
    }

    const paystackInstance = new PaystackPop();

    const onSuccess = () => {
      updateCartStatus({ cartId: cart?.data._id || '', status: CartStatus.CHECKOUT_IN_PROGRESS });
      onNext();
    };

    const transactionReference = `ORDER-${order?.data.orderNumber || uuidv4().split('-')[0]}-${Date.now()}`;
    const amountInKobo = Math.round((order?.data.total || 0) * 100);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paystackOptions: any = {
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: user.user?.email || '',
      amount: amountInKobo,
      currency: 'NGN',
      reference: transactionReference,
      metadata: {
        custom_fields: [
          {
            display_name: 'Order Number',
            variable_name: 'order_number',
            value: order?.data.orderNumber || '',
          },
          {
            display_name: 'Cart ID',
            variable_name: 'cart_id',
            value: cart?.data._id || '',
          },
          {
            display_name: 'Order ID',
            variable_name: 'order_id',
            value: orderId || '',
          },
          {
            display_name: 'Discount',
            variable_name: 'discount',
            value: order?.data.discount || 0,
          },
        ],
      },
      onSuccess: (response: unknown) => {
        console.log('Payment successful:', response);
        onSuccess();
      },
      onCancel: () => {
        enqueueSnackbar('Payment cancelled', { variant: 'info' });
      },
      onClose: () => {
        enqueueSnackbar('Payment window closed', { variant: 'info' });
      },
    };

    paystackInstance.newTransaction(paystackOptions);
  };

  if (!orderId) {
    return null;
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => handleSubmit(e, paymentMethod)}
      sx={{
        backgroundColor: '#111',
        borderRadius: '1rem',
        padding: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          fontFamily: 'ClashDisplay-Medium',
          marginBottom: 3,
        }}
      >
        Payment Method
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 66.666667%' },
          }}
        >
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ gap: 2 }}
          >
            <Box
              sx={{
                backgroundColor: '#0C0C0C',
                borderRadius: '0.75rem',
                border: '1px solid rgba(103, 97, 97, 0.30)',
                padding: 2,
              }}
            >
              <FormControlLabel
                value="card"
                control={
                  <Radio
                    sx={{
                      color: '#7B7B7B',
                      '&.Mui-checked': {
                        color: '#0B6201',
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Image
                      src="/assets/card-payment.svg"
                      alt="Card Payment"
                      width={32}
                      height={32}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: 'Satoshi',
                      }}
                    >
                      Pay with Card
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box
              sx={{
                backgroundColor: '#0C0C0C',
                borderRadius: '0.75rem',
                border: '1px solid rgba(103, 97, 97, 0.30)',
                padding: 2,
              }}
            >
              <FormControlLabel
                value="bank_transfer"
                control={
                  <Radio
                    sx={{
                      color: '#7B7B7B',
                      '&.Mui-checked': {
                        color: '#0B6201',
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Image
                      src="/assets/bank-transfer.svg"
                      alt="Bank Transfer"
                      width={32}
                      height={32}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: 'Satoshi',
                      }}
                    >
                      Bank Transfer
                    </Typography>
                  </Box>
                }
              />
            </Box>
            <Box
              sx={{
                backgroundColor: '#0C0C0C',
                borderRadius: '0.75rem',
                border: '1px solid rgba(103, 97, 97, 0.30)',
                padding: 2,
              }}
            >
              <FormControlLabel
                value="crypto"
                control={
                  <Radio
                    sx={{
                      color: '#7B7B7B',
                      '&.Mui-checked': {
                        color: '#0B6201',
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Image
                      src="/assets/card-payment.svg"
                      alt="Crypto Payment"
                      width={32}
                      height={32}
                    />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: 'Satoshi',
                      }}
                    >
                      Crypto (BTC/USDT)
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </RadioGroup>
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 33.333333%' },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#0C0C0C',
              borderRadius: '0.75rem',
              padding: 2,
              border: '1px solid rgba(103, 97, 97, 0.30)',
            }}
          >
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'ClashDisplay-Medium',
                fontSize: '1.25rem',
                marginBottom: 2,
              }}
            >
              Order Summary
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ color: '#7B7B7B', fontFamily: 'Satoshi' }}>Subtotal</Typography>
                <Typography sx={{ color: '#FFF', fontFamily: 'Satoshi' }}>
                  ₦{(order?.data.subtotal || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ color: '#7B7B7B', fontFamily: 'Satoshi' }}>Shipping</Typography>
                <Typography sx={{ color: '#FFF', fontFamily: 'Satoshi' }}>
                  ₦{(order?.data.shippingCost || 0).toLocaleString()}
                </Typography>
              </Box>
              {order?.data.discount ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="primary" sx={{ fontFamily: 'Satoshi' }}>
                    Discount
                  </Typography>
                  <Typography color="primary" sx={{ fontFamily: 'Satoshi' }}>
                    -₦{(order?.data.discount || 0).toLocaleString()}
                  </Typography>
                </Box>
              ) : null}
              <Box
                sx={{
                  height: '1px',
                  backgroundColor: '#333',
                  margin: '0.5rem 0',
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 1,
                }}
              >
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'ClashDisplay-Medium',
                    fontSize: '1.125rem',
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'ClashDisplay-Bold',
                    fontSize: '1.25rem',
                  }}
                >
                  ₦{(order?.data.total || 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Button
          onClick={() => (showCryptoForm ? setShowCryptoForm(false) : onBack(hasPhysicalItems ? 1 : 0))}
          sx={{
            order: { xs: 2, sm: 1 },
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
          {showCryptoForm ? 'Cancel' : `Back to ${hasPhysicalItems ? 'Shipping Details' : 'Cart'}`}
        </Button>
        {!showCryptoForm && (
          <Button
            type="submit"
            sx={{
              order: { xs: 1, sm: 2 },
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
            Complete Order
          </Button>
        )}
      </Box>

      {showCryptoForm && (
        <Box sx={{ mt: 4, borderTop: '1px solid #333', pt: 4 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontFamily: 'ClashDisplay-Medium' }}>
            Crypto Payment Details
          </Typography>
          <CryptoPaymentForm
            orderId={orderId}
            amount={order?.data.total || 0}
            currency={order?.data.currency || 'NGN'}
            onSuccess={() => {
              updateCartStatus({ cartId: cart?.data._id || '', status: CartStatus.CHECKOUT_IN_PROGRESS });
              onNext();
            }}
          />
        </Box>
      )}
    </Box>
  );
}
