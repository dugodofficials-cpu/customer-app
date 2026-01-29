'use client';

import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';

export default function RateLimitPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '70vh',
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
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: '#fff' }}
        >
          You’re doing that too much
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }} gutterBottom>
          We’ve temporarily limited requests from your account due to high activity. Please wait a
          moment and try again. This helps keep things fast and reliable for everyone.
        </Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}
        >
          Error code: 429 (Too Many Requests)
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => router.push(ROUTES.USER.HOME)}>
            Go to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
