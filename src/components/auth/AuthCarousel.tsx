'use client';
import { Box, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const slides = [
  {
    title: 'Enjoy the latest sounds from DuGod',
    visual: '/assets/authbg.png',
  },
  {
    title: 'Get huge discount and sales on high quality Merch',
    visual: '/assets/authbg2.png',
  },
  {
    title: 'Get game codes and win prizes at your finger tips',
    visual: '/assets/authbg.png',
  },
];

export default function AuthCarousel() {
  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
          bulletClass: 'swiper-pagination-bullet',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        style={{ height: '100%' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box
                component="img"
                src={slide.visual}
                alt={slide.title}
                sx={{
                  maxWidth: '100%',
                  width: '100%',
                  height: '100vh',
                  objectFit: 'cover',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-20px)',
                    },
                  },
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  position: 'absolute',
                  bottom: '3rem',
                  fontFamily: 'ClashDisplay-Bold',
                  fontSize: '1.9rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  maxWidth: '80%',
                }}
              >
                {slide.title}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active {
          background: #fff;
          transform: scale(1.2);
        }
      `}</style>
    </Box>
  );
}
