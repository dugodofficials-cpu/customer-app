'use client';
import PrimaryButton from '@/components/ui/custom-button';
import PricingModal from '@/components/ui/pricing-modal';
import RoundedButton from '@/components/ui/rounded-button';
import { useProductsByAlbum } from '@/hooks/products';
import { ROUTES } from '@/util/paths';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Footer from '../../layout/footer';
import TracklistItem from './tracklist-item';
import { calculateTotalDuration } from '@/lib/utils/time';

export default function Track() {
  const router = useRouter();
  const pathname = usePathname();
  const albumId = pathname.split('/')[2];
  const trackId = pathname.split('/')[4];
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { data: albumProducts, isLoading } = useProductsByAlbum(albumId);

  const handleOpenPricingModal = () => {
    setIsPricingModalOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingModalOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Box
            sx={{
              width: '3rem',
              height: '3rem',
              background: '#1a1a1a',
              borderRadius: '0.5rem',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'Manrope',
            }}
          >
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '0.5rem', sm: '1rem' },
        width: '100%',
        padding: 0,
        margin: 0,
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Box
        onClick={() => router.push(ROUTES.ALBUM.DETAILS.replace(':id', albumId))}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0rem',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingTop: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
          paddingBottom: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        <IconButton>
          <ArrowBackIcon
            sx={{
              color: '#FFF',
              fontSize: '1rem',
            }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: '0.5rem', sm: '0.75rem' },
          width: '100%',
          padding: 0,
          margin: 0,
        }}
      >
        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: {
              xs: '2rem',
              sm: '2.4rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
            marginTop: { xs: '1rem', sm: '1rem', md: '1rem' },
            px: { xs: '1rem', sm: 0 },
          }}
        >
          {albumProducts?.data.find((product) => product._id === trackId)?.name || ''}
        </Typography>
        <Typography
          sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
              md: '1.25rem',
            },
            color: '#C4C4C4',
            textAlign: 'center',
            fontFamily: 'Satoshi',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          {albumProducts?.data.find((product) => product._id === trackId)?.description || ''}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Image src="/assets/duration.svg" alt="duration" width={20} height={20} />
          <Typography
            sx={{
              color: '#C4C4C4',
              fontFamily: 'Manrope',
              fontSize: '0.75rem',
              fontStyle: 'normal',
            }}
          >
            {albumProducts?.data.find((product) => product._id === trackId)?.duration || '00:00'}
          </Typography>
        </Box>
        <Button
          sx={{
            display: 'flex',
            padding: '0.25rem 0.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            width: '6.125rem',
            borderRadius: '0.25rem',
            border: '0.4px solid #FFF',
            background: 'rgba(255, 255, 255, 0.10)',
          }}
          startIcon={<Image src="/assets/play.svg" alt="play" width={24} height={24} />}
        >
          Play
        </Button>
        <RoundedButton
          textProps={{
            sx: {
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'Manrope',
              fontSize: '0.8125rem',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '120%',
            },
          }}
          sx={{
            width: '10rem',
            background: '#0B6201',
            '&:hover': {
              background: '#0B6201',
              opacity: 0.8,
            },
          }}
        >
          Buy Full Album
        </RoundedButton>
        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontWeight: 700,
            lineHeight: '120%',
            marginTop: '1.5rem',
            fontSize: {
              xs: '1rem',
              sm: '1.5625rem',
            },
          }}
        >
          🔥 From Album: <br /> &quot;{albumProducts?.data[0]?.album || ''}&quot;
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '2rem',
            paddingInline: { xs: '1rem', sm: '0' },
            overflow: 'hidden',
            maxWidth: '25.5rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingInline: { xs: '1rem', sm: '0' },
              width: '25.5rem',
              height: '24.125rem',
              maxWidth: '100%',
              maxHeight: '24.125rem',
              position: 'relative',
              borderRadius: '0.25rem',
              overflow: 'hidden',
            }}
          >
            <Image
              src={albumProducts?.data.find((product) => product._id === trackId)?.images[0] || ''}
              alt="album1"
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <PrimaryButton
            textProps={{
              sx: {
                color: '#FFF',
                fontSize: '0.75rem',
                fontStyle: 'normal',
              },
            }}
            startIcon={<Image src="/assets/dvd.svg" alt="dvd" width={24} height={24} />}
          >
            BUY NOW (₦500)
          </PrimaryButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          backgroundColor: '#000',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1rem', sm: '1.5rem', md: '2rem' },
          margin: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: { xs: '1rem 0.5rem', sm: '2rem 1.875rem' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            alignSelf: 'stretch',
            borderRadius: '0.75rem',
            background: '#0D0D0D',
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              marginTop: '1.5rem',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'space-between' },
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'Manrope',
                    fontSize: '1.375rem',
                    fontStyle: 'normal',
                    textAlign: { xs: 'center', sm: 'left' },
                    fontWeight: 700,
                    letterSpacing: '2px',
                    lineHeight: '120%',
                  }}
                >
                  Track list
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <Image src={'/assets/track.svg'} alt="track list" width={24} height={24} />
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'Manrope',
                      fontSize: '0.75rem',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '120%',
                    }}
                  >
                    {albumProducts?.data.length} songs
                  </Typography>
                  <Image src={'/assets/dot.svg'} alt="dot" width={8} height={8} />
                  <Image src={'/assets/duration.svg'} alt="duration" width={24} height={24} />
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'Manrope',
                      fontSize: '0.75rem',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '120%',
                    }}
                  >
                    {calculateTotalDuration(
                      albumProducts?.data.map((product) => product.duration || '00:00') || []
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: { xs: '1rem', sm: '0.5rem' },
              }}
            >
              <Button
                onClick={handleOpenPricingModal}
                startIcon={
                  <Image src="/assets/bundle-icon.svg" alt="arrowRight" width={18} height={18} />
                }
                sx={{
                  display: 'flex',
                  padding: '0.75rem 1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '2rem',
                  width: { xs: '100%', md: 'auto' },
                  background: '#fff',
                }}
              >
                <Typography
                  sx={{
                    color: '#0C0C0C',
                    fontFamily: 'Manrope',
                    fontSize: '0.75rem',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '120%',
                  }}
                >
                  Buy Bundle
                </Typography>
              </Button>
              <Button
                startIcon={<Image src="/assets/dvd.svg" alt="dvd" width={18} height={18} />}
                sx={{
                  display: 'flex',
                  padding: '0.75rem 1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '2rem',
                  background: '#0B6201',
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'Manrope',
                    fontSize: '0.75rem',
                    fontStyle: 'normal',
                    fontWeight: 700,
                  }}
                >
                  Buy Full Album
                </Typography>
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              {isLoading ? (
                <Typography sx={{ color: '#FFF' }}>Loading tracks...</Typography>
              ) : (
                albumProducts?.data?.map((product, index) => (
                  <TracklistItem
                    key={product._id}
                    url={product.digitalDeliveryInfo?.downloadUrl || ''}
                    isLast={index === (albumProducts?.data?.length || 0) - 1}
                    title={product.name}
                    duration={product.duration || '00:00'}
                    price={product.price}
                    image={product.images[0]}
                    _id={product._id}
                  />
                ))
              )}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            marginTop: { xs: '2rem', sm: '3rem', md: '4rem' },
          }}
        >
          <Footer />
        </Box>
      </Box>
      <PricingModal isOpen={isPricingModalOpen} onClose={handleClosePricingModal} />
    </Box>
  );
}
