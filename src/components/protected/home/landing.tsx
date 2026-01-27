'use client';
import GradientButton from '@/components/ui/gradient-button';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Footer from '../../layout/footer';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  return (
    <Box sx={{
      padding: { xs: '1rem', sm: 0 },
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <Box sx={{
        borderRadius: '0.75rem',
        border: '2px solid rgba(21, 21, 21, 0.40)',
        background: '#000',
        boxShadow: '0px 68px 32px 0px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-2px',
          border: '2px solid transparent',
          borderImage: 'linear-gradient(180deg, rgba(21, 21, 21, 0.4), rgba(42, 195, 24, 0.3))',
          borderImageSlice: 1,
          borderRadius: '0.75rem',
          zIndex: -1,
        },

        padding: {
          xs: '2rem 1rem',
          sm: '4rem 2.5rem',
          md: '7.5rem 5rem'
        },
        margin: {
          xs: '5rem auto 0',
          sm: '7rem auto 0',
        },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        width: {
          xs: '100%',
          sm: '90%',
          md: '60%'
        },
        maxWidth: '63.75rem',
        backgroundColor: '#000',
        gap: '2rem',
      }}>

        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{
            position: 'relative',
            width: { xs: '5rem', sm: '180px', md: '200px' },
            height: { xs: '2rem', sm: '43px', md: '48px' },
            mx: 'auto',
            mb: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Image
              src="/assets/headphone.svg"
              alt="Headphone"
              width={isMobile ? 40 : 60}
              height={isMobile ? 40 : 60}
              priority
            />
            <Image
              src="/assets/logo.svg"
              alt="Dugod Logo"
              width={isMobile ? 86 : 108}
              height={isMobile ? 30 : 38.8}
              priority
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'ClashDisplay-Bold',
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '1.9375rem'
              },
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '120%',
              mb: 2,
              color: '#fff',
            }}
          >
            Independent. Unfiltered. Unforgettable.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#C4C4C4',
              maxWidth: '600px',
              mx: 'auto',
              mb: { xs: 2, sm: 3, md: 4 },
              fontFamily: 'Satoshi-Bold',
              fontSize: {
                xs: '0.8rem',
                sm: '1.125rem',
                md: '1.25rem'
              },
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            Stream the latest tracks. Cop exclusive merch.
            <br />
            Real stories. Raw sound.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mx: 'auto', width: '100%' }}>
          <GradientButton
            onClick={() => router.push(ROUTES.MUSIC)}
            sx={{
              fontFamily: 'Satoshi-Bold',
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' }
            }}
            startIcon={
              <Image
                src={'/assets/music-icon.svg'}
                alt="Music"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            }
          >
            LISTEN NOW
          </GradientButton>

          <GradientButton
            onClick={() => router.push(ROUTES.SHOP.HOME)}
            sx={{
              fontFamily: 'Satoshi-Bold',
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' }
            }}
            startIcon={
              <Image
                src={'/assets/shop-icon.svg'}
                alt="Shop"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            }
          >
            VISIT SHOP
          </GradientButton>

          <GradientButton
            onClick={() => router.push(ROUTES.GAME.HOME)}
            sx={{
              fontFamily: 'Satoshi-Bold',
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' }
            }}
            startIcon={
              <Image
                src={'/assets/game-icon.svg'}
                alt="Game"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            }
          >
            BLACK BOX GAME
          </GradientButton>
        </Box>
      </Box>
      <Box sx={{
        marginTop: { xs: '4rem', sm: '6rem', md: '8.56rem' }
      }}>
        <Footer />
      </Box>
    </Box>
  );
} 