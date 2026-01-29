'use client';
import AuthCarousel from '@/components/auth/AuthCarousel';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { AuthPageGuard } from '@/components/auth/auth-page-guard';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AuthPageGuard>
      <Grid container sx={{ minHeight: '100vh', bgcolor: '#0C0C0C' }}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            p: { xs: 2, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{
            position: { sm: 'absolute', xs: 'static' },
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 48 },
            display: 'flex',
            alignSelf: 'flex-start',
          }}>
            <Image
              src={'/assets/logo.svg'}
              alt="DuGod Logo"
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </Box>
          {children}
        </Grid>

        {isNotMobile && (
          <Grid
            size={6}
            sx={{
              bgcolor: '#000',
              position: 'relative',
              height: '100vh'
            }}
          >
            <AuthCarousel />
          </Grid>
        )}
      </Grid>
    </AuthPageGuard>
  );
} 