'use client';

import { useCart, useRemoveFromCart, useUpdateCartItemQuantity } from '@/hooks/cart';
import { Box, Button, CircularProgress, Drawer, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Product, ProductType } from '@/lib/api/products';
import { ROUTES } from '@/util/paths';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { data: cartItems, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartItemQuantity();
  const router = useRouter();

  if (isLoading) return null;

  if (cartItems?.data.items.length === 0) return null;

  const totalAmount = cartItems?.data.total || 0;

  const handleQuantityChange = ({
    product,
    currentQuantity,
    delta,
    selectedOptions,
  }: {
    product: Product;
    currentQuantity: number;
    delta: number;
    selectedOptions?: Record<string, string>;
  }) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantity.mutate({ product, quantity: newQuantity, selectedOptions });
  };

  const handleRemoveItem = (productId: string, selectedOptions: Record<string, string>) => {
    removeFromCart.mutate({ productId, cartId: cartItems?.data._id || '', selectedOptions });
  };

  const handleCheckout = () => {
    onClose();
    router.push(ROUTES.CHECKOUT);
  };

  const handleContinueShopping = () => {
    onClose();
    router.push('/shop');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          backgroundColor: '#000',
          backgroundImage:
            'linear-gradient(180deg, rgba(11, 98, 1, 0.10) 0%, rgba(0, 0, 0, 0.00) 100%)',
          borderLeft: '1px solid rgba(103, 97, 97, 0.30)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '1.5rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'ClashDisplay-Bold',
              fontSize: '1.5rem',
            }}
          >
            Shopping Cart
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#FFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        ) : cartItems?.data.items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flex: 1,
            }}
          >
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'Satoshi',
                fontSize: '1.25rem',
                textAlign: 'center',
              }}
            >
              Your cart is empty
            </Typography>
            <Button
              onClick={handleContinueShopping}
              sx={{
                backgroundColor: '#0B6201',
                color: '#FFF',
                padding: '0.75rem 2rem',
                borderRadius: '2rem',
                '&:hover': {
                  backgroundColor: 'rgba(42, 195, 24, 0.32)',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '1rem',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#0C0C0C',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#0B6201',
                  borderRadius: '4px',
                },
              }}
            >
              {cartItems?.data.items.map((item) => {
                if(!item.product) return null;
                return(
                <Box
                  key={`${item.product._id}-${item.selectedOptions?.size}`}
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#0C0C0C',
                    border: '1px solid rgba(103, 97, 97, 0.30)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '6rem',
                      height: '6rem',
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
                      alt={item.product.name}
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
                          fontSize: '1rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {item.product.name}
                      </Typography>
                      {!!item.selectedOptions?.size && (
                        <Typography
                          sx={{
                            color: '#FFF',
                            fontFamily: 'ClashDisplay-Medium',
                            fontSize: '1rem',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <span style={{ color: '#7B7B7B', paddingRight: '0.5rem' }}>Variant:</span>{' '}
                          {item.selectedOptions?.size}
                        </Typography>
                      )}
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      {item.product.type === ProductType.PHYSICAL ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#000',
                            borderRadius: '0.375rem',
                            padding: '0.25rem',
                            border: '1px solid #7B7B7B',
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              handleQuantityChange({
                                product: item.product,
                                currentQuantity: item.quantity,
                                delta: -1,
                                selectedOptions: item.selectedOptions,
                              })
                            }
                            size="small"
                            sx={{
                              color: '#FFF',
                              padding: '0.25rem',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{
                              color: '#FFF',
                              fontFamily: 'Satoshi',
                              fontSize: '1rem',
                              minWidth: '1.5rem',
                              textAlign: 'center',
                            }}
                          >
                            {updateQuantity.isPending &&
                            updateQuantity.variables.product._id === item.product._id ? (
                              <CircularProgress size={16} sx={{ color: '#FFF' }} />
                            ) : (
                              item.quantity
                            )}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange({
                                product: item.product,
                                currentQuantity: item.quantity,
                                delta: 1,
                                selectedOptions: item.selectedOptions,
                              })
                            }
                            size="small"
                            sx={{
                              color: '#FFF',
                              padding: '0.25rem',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : null}
                      <Button
                        onClick={() =>
                          handleRemoveItem(item.product._id, item.selectedOptions || {})
                        }
                        size="small"
                        sx={{
                          color: '#FF4D4D',
                          padding: '0',
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {removeFromCart.isPending &&
                        removeFromCart.variables.productId === item.product._id ? (
                          <CircularProgress size={16} sx={{ color: '#FF4D4D' }} />
                        ) : (
                          'Remove'
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )})}
            </Box>

            <Box
              sx={{
                borderTop: '1px solid rgba(103, 97, 97, 0.30)',
                paddingTop: '1rem',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'ClashDisplay-Medium',
                    fontSize: '1.25rem',
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'ClashDisplay-Bold',
                    fontSize: '1.5rem',
                  }}
                >
                  ₦{totalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Button
                onClick={handleCheckout}
                fullWidth
                sx={{
                  backgroundColor: '#0B6201',
                  color: '#FFF',
                  padding: '1rem',
                  borderRadius: '2rem',
                  '&:hover': {
                    backgroundColor: 'rgba(42, 195, 24, 0.32)',
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
