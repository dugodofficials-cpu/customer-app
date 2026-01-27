'use client';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const socialLinks = [
    { icon: '/assets/facebook.svg', alt: 'Facebook', url: 'https://facebook.com/dugodofficial' },
    {
      icon: '/assets/soundcloud.svg',
      alt: 'Soundcloud',
      url: 'https://soundcloud.com/dugodofficial',
    },
    {
      icon: '/assets/applemusic.svg',
      alt: 'Apple Music',
      url: 'https://music.apple.com/us/artist/dugod/471792794',
    },
    { icon: '/assets/twitter.svg', alt: 'Twitter', url: 'https://x.com/dugodofficial' },
    {
      icon: '/assets/spotify.svg',
      alt: 'Spotify',
      url: 'https://artists.spotify.com/c/artist/2wE1NcWeuHAiAaAlDVyEu3/profile/overview',
    },
    { icon: '/assets/instagram.svg', alt: 'Instagram', url: 'https://instagram.com/dugodofficial' },
    {
      icon: '/assets/youtube.svg',
      alt: 'Youtube',
      url: 'https://youtube.com/@dugodofficial?si=rllYroswhs0PvtOH',
    },
    {
      icon: '/assets/whatsapp.svg',
      alt: 'Whatsapp',
      url: 'https://chat.whatsapp.com/EZnY3satUfM2N4NVQzeHWV?mode=hqrc',
    },
    { icon: '/assets/telegram.svg', alt: 'Telegram', url: 'https://t.me/+4bXzfy3TLug3MWE0' },
  ];

  return (
    <Box
      sx={{
        marginBottom: { xs: '1rem', sm: '1.5rem' },
        px: { xs: '1rem', sm: 0 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
        }}
      >
        {socialLinks.map((social) => (
          <Link key={social.alt} href={social.url} target="_blank" rel="noopener noreferrer">
            <IconButton
              sx={{
                display: 'flex',
                height: { xs: '2rem', sm: '2.375rem' },
                padding: { xs: '0.3rem', sm: '0.4375rem 0.375rem' },
                alignItems: 'center',
                gap: '0.625rem',
                borderRadius: '0.5rem',
                border: '1px solid #fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Image
                src={social.icon}
                alt={social.alt}
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
              />
            </IconButton>
          </Link>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: { xs: '1rem', sm: '1.5rem' },
        }}
      >
        <Typography
          sx={{
            color: '#C4C4C4',
            fontFamily: 'Satoshi',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
            textAlign: 'center',
          }}
        >
          &copy; 2025 DEODYNE. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
