'use client';

import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/util/paths';
import Image from 'next/image';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: '#000',
      }}
    >
      <Box
        sx={{
          maxWidth: 640,
          textAlign: 'center',
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '300px',
            height: '200px',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Image
            src="/assets/404.svg"
            alt="Error Illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'ClashDisplay-Bold',
            mb: 2,
          }}
        >
          Something went wrong!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re
          working on fixing it.
        </Typography>

        {error.digest && (
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              mb: 2,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
            }}
          >
            Error ID: {error.digest}
          </Typography>
        )}

        {process.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              mt: 2,
              mb: 3,
              p: 2,
              bgcolor: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.3)',
              borderRadius: 1,
              textAlign: 'left',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                wordBreak: 'break-word',
              }}
            >
              {error.message}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            onClick={reset}
            sx={{
              bgcolor: '#2AC318',
              color: '#000',
              py: 1.5,
              px: 4,
              fontFamily: 'Manrope',
              fontWeight: 700,
              borderRadius: '2rem',
              '&:hover': {
                bgcolor: '#2AC318',
                opacity: 0.9,
              },
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push(ROUTES.HOME)}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              py: 1.5,
              px: 4,
              fontFamily: 'Manrope',
              fontWeight: 700,
              borderRadius: '2rem',
              '&:hover': {
                borderColor: '#2AC318',
                bgcolor: 'rgba(42, 195, 24, 0.1)',
              },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

