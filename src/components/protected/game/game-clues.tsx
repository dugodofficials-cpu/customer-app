'use client';
import { ROUTES } from '@/util/paths';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Footer from '../../layout/footer';
import BlackboxTable from '../profile/blackbox-table';

export default function GameCluesPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        padding: { xs: '1rem', sm: 0 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          borderRadius: '0.75rem',
          border: '2px solid rgba(21, 21, 21, 0.40)',
          background: '#000',
          boxShadow: '0px 68px 32px 0px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          position: 'relative',

          padding: {
            xs: '2rem 1rem',
            sm: '4rem 2.5rem',
            md: '7.5rem 5rem',
          },
          margin: {
            xs: '5rem auto 0',
            sm: '0 auto',
          },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: 'auto',
          width: {
            xs: '100%',
            sm: '90%',
            md: '80%',
          },
          maxWidth: '63.75rem',
          backgroundColor: '#000',
          gap: '3.75rem',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'ClashDisplay-Bold',
            color: '#FFF',
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '3.0625rem' },
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          These are the clues you&apos;ve discovered so far.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            width: '100%',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'ClashDisplay-Bold',
              fontSize: { xs: '1.5rem', sm: '1.9375rem' },
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            Clue Table
          </Typography>

          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              borderRadius: '0.5rem',
            }}
          >
            <BlackboxTable />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            onClick={() => router.push(ROUTES.MUSIC)}
            fullWidth
            sx={{
              display: 'flex',
              height: '2.6875rem',
              padding: { xs: '0.1875rem 1rem' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.625rem',
              borderRadius: '0.5rem',
              background: '#2AC318',
            }}
          >
            <Typography
              sx={{
                color: '#000',
                fontFamily: 'space-grotesk',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              🎧 Explore Music for Clues
            </Typography>
          </Button>
          <Button
            fullWidth
            onClick={() => router.push(ROUTES.SHOP.HOME)}
            sx={{
              display: 'flex',
              height: '2.6875rem',
              padding: { xs: '0.1875rem 1rem' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.625rem',
              borderRadius: '0.5rem',
              border: '1px solid #FFF',
              background: '#202020',
              color: '#FFF',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontFamily: 'space-grotesk',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              🛍️ Check Shop for Clues
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: { xs: '0' },
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
