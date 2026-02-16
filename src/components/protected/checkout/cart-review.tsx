'use client';

import { useApplyCouponCode, useCart } from '@/hooks/cart';
import { useCreateOrder } from '@/hooks/order';
import { useUser } from '@/hooks/user';
import { AppliedDiscount, CartItem, CartItemResponse } from '@/lib/api/cart';
import { DeliveryStatus, OrderStatus } from '@/lib/api/order';
import { ROUTES } from '@/util/paths';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

interface CartReviewProps {
  onNext: (step?: number) => void;
  hasPhysicalItems: boolean;
}

export default function CartReview({ onNext, hasPhysicalItems }: CartReviewProps) {
  const { data: cartItems, isLoading } = useCart() as UseQueryResult<CartItemResponse> & {
    mutate: () => Promise<void>;
  };
  const { user } = useUser();
  const createOrder = useCreateOrder();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('');
  const { mutate: applyCouponCodeMutation, isPending: isApplyingCoupon } = useApplyCouponCode();

  const handleNext = async () => {
    if (hasPhysicalItems) {
      onNext(1);
    } else {
      try {
        await createOrder
          .mutateAsync({
            user: user?._id || '',
            shippingCost: 0,
            tax: 0,
            discount: 0,
            total: cartItems?.data.total,
            subtotal: cartItems?.data.subtotal,
            status: OrderStatus.PENDING,
            paymentStatus: 'pending',
            shippingDetails: {
              deliveryStatus: DeliveryStatus.PENDING,
              address: {
                street: user?.address?.street || 'None Provided',
                city: user?.address?.city || 'None Provided',
                state: user?.address?.state || 'None Provided',
                postalCode: user?.address?.postalCode || 'None Provided',
                country: user?.address?.country || 'None Provided',
              },
            },
            items:
              cartItems?.data.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                total: item.product.price * item.quantity,
                selectedOptions: item.selectedOptions
                  ? Object.values(item.selectedOptions)
                  : undefined,
              })) || [],
          })
          .then((response) => {
            const url = new URL(window.location.href);
            url.searchParams.set('orderId', response.data._id);
            console.log(url.toString());
            window.history.replaceState({}, '', url.toString());
            onNext(2);
          });
      } catch (err) {
        console.error('Error saving shipping details:', err);
        enqueueSnackbar('Failed to save shipping details. Please try again.', { variant: 'error' });
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      enqueueSnackbar('Please enter a coupon code', { variant: 'warning' });
      return;
    }

    if (!cartItems?.data._id) {
      enqueueSnackbar('Something went wrong. Please refresh the page and try again.', {
        variant: 'error',
      });
      return;
    }

    applyCouponCodeMutation({ code: couponCode.trim(), cartId: cartItems.data._id });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (cartItems?.data.itemCount === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'ClashDisplay-Medium',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: 'center',
          }}
        >
          You&apos;re just a few steps away from owning your vibe.
        </Typography>
        <Image src="/assets/empty-cart-lg.svg" alt="Empty Cart" width={200} height={200} />
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            textAlign: 'center',
          }}
        >
          Your cart is empty.
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'ClashDisplay-Medium',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: 'center',
          }}
        >
          Looks like you haven&apos;t added anything yet.
          <br />
          Browse music or merch to start vibing.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2,
            gap: '1rem',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Button
            onClick={() => router.push(ROUTES.MUSIC)}
            sx={{
              backgroundColor: '#0B6201',
              color: '#FFF',
              width: { xs: '100%', md: 'auto' },
              padding: '0.75rem',
              borderRadius: '0.25rem',
              fontFamily: 'ClashDisplay-Medium',
              paddingInline: '2rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(42, 195, 24, 0.32)',
              },
            }}
          >
            Explore Music
          </Button>
          <Button
            onClick={() => router.push(ROUTES.SHOP.HOME)}
            sx={{
              backgroundColor: '#0B6201',
              color: '#FFF',
              width: { xs: '100%', md: 'auto' },
              padding: '0.75rem',
              borderRadius: '0.25rem',
              fontFamily: 'ClashDisplay-Medium',
              textTransform: 'none',
              paddingInline: '2rem',
              border: '0.4px solid #FFF',
              background: 'rgba(255, 255, 255, 0.10)',
              '&:hover': {
                backgroundColor: 'rgba(42, 195, 24, 0.32)',
              },
            }}
          >
            Browse Merch
          </Button>
        </Box>
      </Box>
    );
  }

  const totalAmount = cartItems?.data.total || 0;
  const subtotal = cartItems?.data.subtotal || 0;
  const discounts = cartItems?.data.discounts || [];
  const totalDiscount = discounts.reduce((acc: number, discount: AppliedDiscount) => {
    if (discount.type === 'FIXED_AMOUNT') {
      return acc + discount.value;
    } else if (discount.type === 'PERCENTAGE') {
      return acc + (subtotal * discount.value) / 100;
    }
    return acc;
  }, 0);

  return (
    <Box
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
        Review Your Cart
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {cartItems?.data.items.map((item: CartItem) => (
              <Box
                key={`${item.product._id}-${item.selectedOptions?.size}`}
                sx={{
                  display: 'flex',
                  gap: 2,
                  padding: 2,
                  backgroundColor: '#0C0C0C',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(103, 97, 97, 0.30)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: '6rem', md: '8rem' },
                    height: { xs: '6rem', md: '8rem' },
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={
                      item.product?.albumId?.imageUrl ||
                      item.product?.images[0] ||
                      '/assets/product-placeholder.svg'
                    }
                    alt={item.product.name || 'Product'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: '#FFF',
                        fontFamily: 'ClashDisplay-Medium',
                        fontSize: '1.125rem',
                        marginBottom: 1,
                      }}
                    >
                      {item.product.name}
                    </Typography>
                    {item.selectedOptions?.size ? (
                      <Typography
                        sx={{
                          color: '#7B7B7B',
                          fontFamily: 'Satoshi',
                          fontSize: '1rem',
                          marginBottom: 0.5,
                        }}
                      >
                        Size: {item.selectedOptions?.size}
                      </Typography>
                    ) : null}
                    <Typography
                      sx={{
                        color: '#7B7B7B',
                        fontFamily: 'Satoshi',
                        fontSize: '1rem',
                      }}
                    >
                      {item.selectedOptions?.size ? `Quantity: ${item.quantity}` : 'Digital'}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'ClashDisplay-Bold',
                      fontSize: '1.25rem',
                    }}
                  >
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 33.333333%' },
            backgroundColor: '#0C0C0C',
            borderRadius: '0.75rem',
            padding: 3,
            border: '1px solid rgba(103, 97, 97, 0.30)',
            height: 'fit-content',
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
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#FFF',
                fontFamily: 'Satoshi',
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>₦{subtotal.toLocaleString()}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#FFF',
                fontFamily: 'Satoshi',
              }}
            >
              <Typography>Shipping</Typography>
              <Typography>Calculated at next step</Typography>
            </Box>

            {totalDiscount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#2AC318',
                  fontFamily: 'Satoshi',
                }}
              >
                <Typography>Discount</Typography>
                <Typography>-₦{totalDiscount.toLocaleString()}</Typography>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#FFF',
                fontFamily: 'ClashDisplay-Bold',
                fontSize: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 2,
                marginTop: 1,
              }}
            >
              <Typography>Total</Typography>
              <Typography>₦{totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4, mb: 3 }}>
            {discounts.length ? null : (
              <Typography
                sx={{
                  color: '#FFF',
                  fontFamily: 'Satoshi',
                  fontSize: '1rem',
                  marginBottom: 1,
                }}
              >
                Have a coupon code?
              </Typography>
            )}
            {discounts.length ? null : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  size="small"
                  fullWidth
                  inputProps={{
                    maxLength: 10,
                  }}
                  disabled={isApplyingCoupon}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFF',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2AC318',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  sx={{
                    backgroundColor: '#2AC318',
                    color: '#FFF',
                    '&:hover': {
                      backgroundColor: '#0B6201',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(42, 195, 24, 0.32)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                    minWidth: '100px',
                  }}
                >
                  {isApplyingCoupon ? <CircularProgress size={24} color="inherit" /> : 'Apply'}
                </Button>
              </Box>
            )}
            {discounts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {discounts.map((discount: AppliedDiscount, index: number) => (
                  <Typography
                    key={index}
                    sx={{
                      color: '#2AC318',
                      fontFamily: 'Satoshi',
                      fontSize: '0.875rem',
                    }}
                  >
                    {discount.description}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          <Button
            onClick={handleNext}
            fullWidth
            sx={{
              backgroundColor: '#2AC318',
              color: '#FFF',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              fontFamily: 'ClashDisplay-Medium',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#0B6201',
              },
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
