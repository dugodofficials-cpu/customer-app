'use client';
import Navbar from '@/components/layout/navbar';
import { Box, useMediaQuery, useScrollTrigger } from '@mui/material';
import { AuthGuard } from '@/components/auth/auth-guard';
import GameBg from '../../../public/assets/game-bg.png';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 150,
  });
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const isGame = pathname.includes('game');
  const isTrack = pathname.includes('track');
  const isShop = pathname.includes('shop');
  const isCheckout = pathname.includes('checkout');
  const isProfile = pathname.includes('profile');
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuthGuard>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#000',
          overflow: 'hidden',
          padding: 0,
          margin: 0,
          backgroundColor: isHome ? 'transparent' : '#000',
          backgroundImage: isHome ? `url(${GameBg.src})` : isGame ? `url(${GameBg.src})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {!isHome && !isTrack && !isGame && !isCheckout && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40rem',
              backgroundColor: '#000',
              backgroundImage: isShop
                ? 'linear-gradient(180deg, #151515 0%, #000 50%, #151515 100%)'
                : 'none',
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.1s cubic-bezier(0,0,0.2,1)',
            }}
          >
            {!isShop && (
              <Image
                src={
                  isMobile
                    ? '/assets/header-bg-sm.svg'
                    : isProfile
                      ? '/assets/profile-bg.png'
                      : '/assets/headerBg.png'
                }
                alt="Home"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
              />
            )}
          </Box>
        )}
        <Box
          sx={{
            minHeight: '100%',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <Navbar trigger={trigger} />
          <Box
            component="main"
            sx={{
              paddingTop: { xs: trigger ? '3rem' : '0', sm: trigger ? '4rem' : '0' },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
