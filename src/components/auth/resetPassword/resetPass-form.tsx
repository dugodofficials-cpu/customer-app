'use client';
import { useResetPassword } from '@/hooks/auth';
import { ResetPasswordInput, resetPasswordSchema } from '@/lib/validations/auth';
import { ROUTES } from '@/util/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordForm() {
  const { mutate, isPending, error, data } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    mutate({
      token: token as string,
      password: data.password,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}
    >
      {data && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {data.data.message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Alert>
      )}
      <FormLabel
        sx={{
          color: '#fff',
          fontFamily: 'satoshi-bold',
          fontSize: '1rem',
          fontWeight: '700',
          mb: 1,
        }}
      >
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
        disabled={isPending}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
          '& .MuiFormHelperText-root': {
            color: 'error.main',
            marginLeft: 0,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={isPending}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <FormLabel
        sx={{
          color: '#fff',
          fontFamily: 'satoshi-bold',
          fontSize: '1rem',
          fontWeight: '700',
          mb: 1,
        }}
      >
        Re-enter Password
      </FormLabel>
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm Password"
        variant="outlined"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        disabled={isPending}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
          '& .MuiFormHelperText-root': {
            color: 'error.main',
            marginLeft: 0,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  disabled={isPending}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending}
        sx={{
          bgcolor: 'primary.main',
          color: '#000',
          py: 1.5,
          mb: 2,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {isPending ? 'Reset Password...' : 'Reset Password →'}
      </Button>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: '#ccc', fontFamily: 'satoshi-bold', fontSize: '0.8rem' }}
        >
          Back to Sign In?{' '}
          <Link href={ROUTES.AUTH.SIGN_IN} style={{ color: 'primary.main' }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontFamily: 'satoshi-bold',
                fontSize: '0.8rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              Sign In
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
