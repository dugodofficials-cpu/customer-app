'use client';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import Image from 'next/image';
import { useResendVerification, useVerifyEmailToken } from '@/hooks/auth';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const resendMutation = useResendVerification();
  const verifyEmailMutation = useVerifyEmailToken();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    }
  }, [token]);

  const handleResendEmail = () => {
    if (email) {
      resendMutation.mutate(email);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          color: '#fff',
        }}
      >
        {resendMutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 4, width: '100%', maxWidth: '500px' }}>
            {resendMutation.data.message}
          </Alert>
        )}

        {resendMutation.error && (
          <Alert severity="error" sx={{ mb: 4, width: '100%', maxWidth: '500px' }}>
            {resendMutation.error instanceof Error
              ? resendMutation.error.message
              : 'An error occurred'}
          </Alert>
        )}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            height: '300px',
            mb: 4,
          }}
        >
          <Image
            src="/assets/email-verification.svg"
            alt="Email Verification"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: 'satoshi-bold',
            mb: 2,
            background: ' #2AC318',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Check Your Email
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: 'satoshi-bold',
          }}
        >
          We&apos;ve sent you a verification link
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
          }}
        >
          Please check your email inbox and click on the verification link to activate your account.
          If you don&apos;t see the email, please check your spam folder.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            onClick={() => router.push(ROUTES.AUTH.SIGN_IN)}
            sx={{
              bgcolor: 'primary.main',
              color: '#000',
              py: 1.5,
              px: 4,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Go to Sign In →
          </Button>

          <Button
            variant="outlined"
            onClick={handleResendEmail}
            disabled={resendMutation.isPending || !email}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.23)',
              py: 1.5,
              px: 4,
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                color: '#fff',
              },
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend Email'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
