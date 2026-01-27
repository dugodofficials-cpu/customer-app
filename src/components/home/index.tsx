'use client';

import { ROUTES } from '@/util/paths';
import { Box, Button, Grid, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import icon from '../../../public/assets/hourglass.svg';
import lockIcon from '../../../public/assets/lock.svg';
import bgImageMobile from '../../../public/assets/startbg-sm.svg';
import bgImage from '../../../public/assets/startbg.svg';
import { useCountdown } from '@/hooks/user';

export default function HomeComponent({ initialTimeLeft }: { initialTimeLeft: string }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isShortScreen = useMediaQuery('(max-height: 667px)'); // iPhone SE height
  const { data } = useCountdown();
  const [timeLeft, setTimeLeft] = useState<string>(initialTimeLeft);
  const [isCountdownComplete, setIsCountdownComplete] = useState<boolean>(false);

  const countdown = data?.data;

  useEffect(() => {
    if (countdown === null) {
      setIsCountdownComplete(true);
    }
    if (!countdown?.launchDate) return;

    const futureTime = new Date(countdown.launchDate).getTime();

    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const difference = futureTime - currentTime;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        setIsCountdownComplete(true);
        return;
      }

      const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);

      const timeString =
        daysLeft > 0
          ? `${daysLeft.toString().padStart(2, '0')}:${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
          : `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;

      setTimeLeft(timeString);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [countdown, router]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'block',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: `url(${isMobile ? bgImageMobile.src : bgImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          position: 'relative',
          marginTop: { xs: isShortScreen ? '5rem' : '8rem', sm: '1rem' },
          width: '100%',
          marginBottom: { xs: '7rem', sm: '0rem' },
        }}
      >
        <Image
          src={icon}
          alt="icon"
          width={isShortScreen ? 30 : isMobile ? 40 : 60}
          height={isShortScreen ? 30 : isMobile ? 40 : 60}
        />
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'digital-numbers',
            fontSize: { xs: isShortScreen ? '2rem' : '2.5rem', md: '3.75rem' },
            fontWeight: 'normal',
            color: 'primary.main',
          }}
        >
          {timeLeft}
        </Typography>
      </Box>
      <Grid
        size={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '15%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body1"
            sx={{
              width: { xs: '70%', md: '35rem' },
              textAlign: 'center',
              fontFamily: 'ClashDisplay-Semibold',
              fontSize: { xs: '1.2rem', md: '1.9375rem' },
              fontWeight: '700',
              color: '#fff',
            }}
          >
            Whoever sees the contents of this box cannot leave the field.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: '5rem',
              textAlign: 'center',
              fontFamily: 'satoshi-bold',
              fontSize: { xs: '1rem', md: '1.5rem' },
              fontWeight: '700',
              color: '#7B7B7B',
              width: { xs: '80%', md: 'auto' },
            }}
          >
            Only the chosen few will unlock what lies beneath.
          </Typography>

          <Button
            onClick={() => isCountdownComplete && router.push(ROUTES.AUTH.SIGN_UP)}
            startIcon={<Image src={lockIcon} alt="lock" width={20} height={20} />}
            variant="contained"
            color="primary"
            disabled={!isCountdownComplete}
            sx={{
              fontFamily: 'manrope',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#000',
              textTransform: 'none',
              paddingInline: '1.5rem',
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            Enter the Field
          </Button>
        </Box>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          marginTop: { xs: '1rem', sm: '1.5rem' },
        }}
      >
        <Link
          component={NextLink}
          href={ROUTES.LEGAL.PRIVACY}
          sx={{
            color: '#C4C4C4',
            textDecoration: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Privacy Policy
        </Link>
        <Link
          component={NextLink}
          href={ROUTES.LEGAL.TERMS}
          sx={{
            color: '#C4C4C4',
            textDecoration: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Terms of Service
        </Link>
      </Box>
    </Grid>
  );
}
