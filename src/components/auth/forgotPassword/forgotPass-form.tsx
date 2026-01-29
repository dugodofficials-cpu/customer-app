'use client';
import { useForgotPassword } from '@/hooks/auth';
import { ForgotPassInput, forgotPassSchema } from '@/lib/validations/auth';
import { ROUTES } from '@/util/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, FormLabel, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function ForgotPassForm() {
  const { mutate, isPending, error, data } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassInput>({
    resolver: zodResolver(forgotPassSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPassInput) => {
    mutate(data.email);
  };

  console.log(data);

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
        Email
      </FormLabel>
      <TextField
        fullWidth
        placeholder="john.doe@example.com"
        variant="outlined"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
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
