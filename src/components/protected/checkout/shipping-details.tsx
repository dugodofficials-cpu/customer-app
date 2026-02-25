'use client';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShippingFormData, shippingSchema } from '@/lib/validations/shipping';
import { useSnackbar } from 'notistack';
import { useUser } from '@/hooks/user';
import { useCreateOrder } from '@/hooks/order';
import { useCart } from '@/hooks/cart';
import { DeliveryStatus, OrderStatus } from '@/lib/api/order';
import { countries } from '@/util/countries';
import { ProductType } from '@/lib/api/products';

interface ShippingDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingDetails({ onNext, onBack }: ShippingDetailsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateUser } = useUser();
  const createOrder = useCreateOrder();
  const { data: cartItems } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.postalCode || '',
      country: user?.address?.country || '',
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    try {
      await updateUser.mutateAsync({
        _id: user?._id || '',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.zipCode,
          country: data.country,
        },
      });

      const hasPhysicalItems =
        cartItems?.data.items?.some((item) => item.product.type === ProductType.PHYSICAL) ?? false;
      const shippingCost = hasPhysicalItems ? 1000 : 0;
      const cartShipping = cartItems?.data.shippingCost || 0;
      const cartTotal = cartItems?.data.total || 0;
      const totalWithoutCartShipping = Math.max(0, cartTotal - cartShipping);
      const updatedTotal = totalWithoutCartShipping + shippingCost;

      await createOrder
        .mutateAsync({
          user: user?._id || '',
          shippingCost,
          tax: 0,
          discount: 0,
          total: updatedTotal,
          subtotal: cartItems?.data.subtotal,
          status: OrderStatus.PENDING,
          paymentStatus: 'PENDING',
          shippingDetails: {
            deliveryStatus: DeliveryStatus.PENDING,
            address: {
              street: data.address,
              city: data.city,
              state: data.state,
              postalCode: data.zipCode,
              country: data.country,
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
          onNext();
        });
    } catch (err) {
      console.error('Error saving shipping details:', err);
      enqueueSnackbar('Failed to save shipping details. Please try again.', { variant: 'error' });
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      fontFamily: 'Satoshi',
      '& fieldset': {
        borderColor: '#333',
      },
      '&:hover fieldset': {
        borderColor: '#666',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0B6201',
      },
      '&.Mui-error fieldset': {
        borderColor: '#d32f2f',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#7B7B7B',
      fontFamily: 'Satoshi',
      '&.Mui-focused': {
        color: '#0B6201',
      },
      '&.Mui-error': {
        color: '#d32f2f',
      },
    },
    '& .MuiFormHelperText-root': {
      fontFamily: 'Satoshi',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
        Shipping Details
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="Phone"
            type="tel"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(100% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="Address"
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register('address')}
            multiline
            rows={2}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="City"
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register('city')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="State"
            error={!!errors.state}
            helperText={errors.state?.message}
            {...register('state')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            label="ZIP Code"
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
            {...register('zipCode')}
            sx={textFieldStyles}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 1.5rem)' } }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.country}>
                <InputLabel
                  id="country-label"
                  sx={{
                    color: '#7B7B7B',
                    fontFamily: 'Satoshi',
                    '&.Mui-focused': {
                      color: '#0B6201',
                    },
                    '&.Mui-error': {
                      color: '#d32f2f',
                    },
                  }}
                >
                  Country
                </InputLabel>
                <Select
                  {...field}
                  labelId="country-label"
                  label="Country"
                  sx={{
                    ...textFieldStyles,
                    backgroundColor: '#111',
                    '& .MuiSelect-select': {
                      color: '#fff',
                      fontFamily: 'Satoshi',
                      padding: '16.5px 14px',
                    },
                    '& .MuiSelect-icon': {
                      color: '#7B7B7B',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#666',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0B6201',
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d32f2f',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#111',
                        color: '#fff',
                        border: '1px solid #333',
                        maxHeight: '300px',
                        '& .MuiMenuItem-root': {
                          fontFamily: 'Satoshi',
                          padding: '12px 16px',
                          '&:hover': {
                            backgroundColor: 'rgba(11, 98, 1, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(11, 98, 1, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(11, 98, 1, 0.3)',
                            },
                          },
                        },
                        '& .MuiList-root': {
                          padding: '8px 0',
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled sx={{ color: '#7B7B7B' }}>
                    <em>Select a country</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {errors.country && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#d32f2f',
                      fontFamily: 'Satoshi',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    {errors.country.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
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
          onClick={onBack}
          disabled={isSubmitting}
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
            '&.Mui-disabled': {
              backgroundColor: '#222',
              color: '#666',
            },
          }}
        >
          Back to Cart
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
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
            '&.Mui-disabled': {
              backgroundColor: 'rgba(11, 98, 1, 0.3)',
              color: '#666',
            },
          }}
        >
          {isSubmitting ? 'Saving...' : 'Continue to Payment'}
        </Button>
      </Box>
    </Box>
  );
}
