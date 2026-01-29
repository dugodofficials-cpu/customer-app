'use client';
import { ChangePasswordInput, changePasswordSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      console.log('Form data:', data);
      
    } catch (error) {
      console.error('Sign-up error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}>
      <FormLabel sx={{ color: '#fff', fontFamily: 'satoshi-bold', fontSize: '1rem', fontWeight: '700', mb: 1 }}>
        OTP
      </FormLabel>
      <TextField
        fullWidth
        placeholder="123456"
        variant="outlined"
        {...register('OTP')}
        error={!!errors.OTP}
        helperText={errors.OTP?.message}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
          },
          '& .MuiFormHelperText-root': {
            color: 'error.main',
            marginLeft: 0
          }
        }}
      />

      <FormLabel sx={{ color: '#fff', fontFamily: 'satoshi-bold', fontSize: '1rem', fontWeight: '700', mb: 1 }}>
        Password
      </FormLabel>
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        placeholder="Cool Password"
        variant="outlined"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
          },
          '& .MuiFormHelperText-root': {
            color: 'error.main',
            marginLeft: 0
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
        }}
      />

      <FormLabel sx={{ color: '#fff', fontFamily: 'satoshi-bold', fontSize: '1rem', fontWeight: '700', mb: 1 }}>
        Confirm Password
      </FormLabel>
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm Password"
        variant="outlined"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
          },
          '& .MuiFormHelperText-root': {
            color: 'error.main',
            marginLeft: 0
          }
        }}
        slotProps={{
          input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
        }}
      />
      

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          bgcolor: 'primary.main',
          color: '#000',
          py: 1.5,
          mb: 2,
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
      >
        Reset Password →
      </Button>
    </Box>
  );
} 