'use client';
import { Box, Button, Typography } from '@mui/material';
import Footer from '../../layout/footer';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';

export default function GameRulesPage() {
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
          margin: '0 auto',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
            fontSize: { sm: '3.0625rem', xs: '2.4rem' },
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          The BlackBox Game 🧩
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: '1.9375rem',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          Introduction
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#7B7B7B',
            textAlign: 'center',
            fontFamily: 'Satoshi-Bold',
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          Welcome to DuGod&apos;s most immersive experience yet. The BlackBox Game is a
          multi-layered music-meets-mystery challenge where clues are hidden in every part of
          DuGod&apos;s world. Only the sharpest minds will unlock the box.
        </Typography>

        <Box
          sx={{
            borderRadius: '0.75rem',
            background: '#121212',
            boxShadow:
              '0px 143px 40px 0px rgba(105, 127, 134, 0.00), 0px 92px 37px 0px rgba(105, 127, 134, 0.01), 0px 52px 31px 0px rgba(105, 127, 134, 0.05), 0px 23px 23px 0px rgba(105, 127, 134, 0.09), 0px 6px 13px 0px rgba(105, 127, 134, 0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mx: 'auto',
            width: '100%',
            alignItems: 'center',
            padding: {
              xs: '2rem 1rem',
              sm: '1.5rem 4rem',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'ClashDisplay-Bold',
              fontSize: '1.5625rem',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            🗝️ How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#7B7B7B',
              textAlign: 'center',
              fontFamily: 'space-grotesk',
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            • Buy a game ticket from the shop
            <br />
            • Follow the map in the lyrics, music, art, merch, and more.
            <br />
            • You need all the keys to unlock the blackbox.
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: '0.75rem',
            background: '#121212',
            boxShadow:
              '0px 143px 40px 0px rgba(105, 127, 134, 0.00), 0px 92px 37px 0px rgba(105, 127, 134, 0.01), 0px 52px 31px 0px rgba(105, 127, 134, 0.05), 0px 23px 23px 0px rgba(105, 127, 134, 0.09), 0px 6px 13px 0px rgba(105, 127, 134, 0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mx: 'auto',
            width: '100%',
            alignItems: 'center',
            padding: {
              xs: '2rem 1rem',
              sm: '1.5rem 4rem',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'ClashDisplay-Bold',
              fontSize: '1.5625rem',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            Rules Preview
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#7B7B7B',
              textAlign: 'center',
              fontFamily: 'space-grotesk',
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            Must be a registered user.
            <br />
            All clues must be solved in order.
            <br />
            Listen to unlock, finishing is not about luck.
          </Typography>
        </Box>
        <Button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('postPurchaseRedirect', ROUTES.GAME.CLUES);
            }
            router.push(ROUTES.SHOP.HOME);
          }}
          sx={{
            display: 'flex',
            height: '2.6875rem',
            padding: { sm: '0.1875rem 7.3125rem', xs: '0.1875rem 1rem' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.625rem',
            width: { sm: 'auto', xs: '100%' },
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
            🔍 Start Searching for Clues
          </Typography>
        </Button>
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
