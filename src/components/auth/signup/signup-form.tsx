'use client';
import { useSignUp } from '@/hooks/auth';
import { SignUpInput, signUpSchema } from '@/lib/validations/auth';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GoogleAuth from '../signin/google-auth';

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpInput) => {
    signUpMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}
    >
      {signUpMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {signUpMutation.error instanceof Error
            ? signUpMutation.error.message
            : 'An error occurred'}
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
        Email
      </FormLabel>
      <TextField
        fullWidth
        placeholder="john.doe@example.com"
        variant="outlined"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={signUpMutation.isPending}
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
        disabled={signUpMutation.isPending}
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
                  disabled={signUpMutation.isPending}
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
        disabled={signUpMutation.isPending}
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
                  disabled={signUpMutation.isPending}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link
          href={ROUTES.AUTH.FORGOT_PASSWORD}
          style={{ color: 'primary.main', textDecoration: 'none' }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'satoshi-bold',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'primary.light',
            }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={signUpMutation.isPending}
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
        {signUpMutation.isPending ? 'Creating Account...' : 'Create Account →'}
      </Button>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: '#ccc', fontFamily: 'satoshi-bold', fontSize: '0.8rem' }}
        >
          Already have an account?{' '}
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

      <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
        <Box sx={{ borderBottom: '1px solid  #2C2C2C', mb: 3 }} />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#000',
            px: 2,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          OR
        </Typography>
      </Box>

      <GoogleAuth />
    </Box>
  );
}
