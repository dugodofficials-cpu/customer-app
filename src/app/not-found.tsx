'use client';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

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
            src="/assets/404.svg"
            alt="404 Illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '4rem' },
            fontFamily: 'satoshi-bold',
            mb: 2,
            background: '#2AC318',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontFamily: 'satoshi-bold',
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
          }}
        >
          Oops! The page you&apos;re looking for seems to have wandered off. Don&apos;t worry
          though, you can easily navigate back to our main page.
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push('/')}
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
          Back to Home →
        </Button>
      </Box>
    </Container>
  );
}
