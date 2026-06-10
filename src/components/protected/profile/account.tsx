'use client';

import { useLogout } from '@/hooks/auth';
import { useUser } from '@/hooks/user';
import { ShippingFormData, shippingSchema } from '@/lib/validations/shipping';
import { countries } from '@/util/countries';
import { zodResolver } from '@hookform/resolvers/zod';
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
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { apiClient } from '@/lib/api/client';

export default function Account() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateUser } = useUser();
  const logoutMutation = useLogout();
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err) {
      console.error('Error saving shipping details:', err);
      enqueueSnackbar('Failed to save shipping details. Please try again.', { variant: 'error' });
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size must be less than 5MB', { variant: 'error' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Only image files are allowed', { variant: 'error' });
      return;
    }

    setUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await apiClient<{ data: { picture: string } }>(
        `users/${user?._id}/profile-picture`,
        {
          method: 'POST',
          body: formData,
        }
      );

      // Update user data with new picture
      await updateUser.mutateAsync({
        _id: user?._id || '',
        picture: response.data.picture,
      });

      enqueueSnackbar('Profile picture updated successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      enqueueSnackbar('Failed to upload profile picture. Please try again.', { variant: 'error' });
    } finally {
      setUploadingPicture(false);
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
        maxWidth: '60rem',
        marginInline: 'auto',
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
        Account Details
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #0B6201',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#222',
          }}
        >
          {user?.picture ? (
            <Image
              src={user.picture}
              alt="Profile"
              width={120}
              height={120}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Image
              src="/assets/user.svg"
              alt="Default Profile"
              width={60}
              height={60}
            />
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPicture}
            sx={{
              backgroundColor: '#0B6201',
              color: '#FFF',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontFamily: 'Satoshi',
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
            {uploadingPicture ? 'Uploading...' : 'Change Profile Picture'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            style={{ display: 'none' }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#7B7B7B',
              fontFamily: 'Satoshi',
            }}
          >
            JPG, PNG or GIF. Max size 5MB
          </Typography>
        </Box>
      </Box>

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
          justifyContent: 'center',
          marginTop: 4,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
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
            '&.Mui-disabled': {
              backgroundColor: 'rgba(11, 98, 1, 0.3)',
              color: '#666',
            },
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          onClick={() => {
            logoutMutation.mutate();
          }}
          startIcon={<Image src="/assets/logout.svg" alt="logout" width={24} height={24} />}
          disabled={logoutMutation.isPending}
          sx={{
            backgroundColor: '#D91313',
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
          Log out
        </Button>
      </Box>
    </Box>
  );
}
