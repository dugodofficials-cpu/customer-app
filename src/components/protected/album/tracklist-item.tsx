'use client';
import { useAddToCart, useCart } from '@/hooks/cart';
import { Box, Button, Grid, Typography, Tooltip, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { usePlayer } from '@/context/player-context';
import { useUser } from '@/hooks/user';
import { getSavedMediaUrl, useDownloadMedia } from '@/hooks/products';
import { useGetUserOrders } from '@/hooks/order';
import { Product, ProductType } from '@/lib/api/products';

export default function TracklistItem({
  isLast,
  title,
  duration,
  url,
  price,
  image,
  _id,
}: {
  isLast: boolean;
  title: string;
  duration: string;
  url: string;
  price: number;
  image: string;
  _id: string;
}) {
  const { data: cartItems } = useCart();
  const { mutate: addToCart, isPending } = useAddToCart();
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { user } = useUser();
  const { mutate: downloadMedia, isPending: isDownloading } = useDownloadMedia();
  const { data: orders } = useGetUserOrders(user?._id || '', {
    page: 1,
    type: ProductType.DIGITAL,
  });
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const isPurchased = orders?.data?.some((order) =>
    order.items.some((item) => {
      if (!item.product) return false;
      const product = item.product as Product;
      return product._id === _id;
    })
  );

  function handleAddToCart() {
    if (cartItems?.data?.items?.some((item) => item.product._id === _id)) {
      return;
    }
    addToCart({
      item: {
        product: _id,
        quantity: 1,
      },
    });
  }

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    if (!url) {
      setTooltipOpen(true);
    }
  };

  const handleMedia = (id: string) => {
    if (!url) {
      handleAddToCart();
      handleTooltipClose();
    } else {
      const savedMediaUrl = getSavedMediaUrl(id);
      if (savedMediaUrl) {
        playTrack({
          id,
          title,
          artist: 'DuGod',
          image,
          audioUrl: savedMediaUrl,
        });
        return;
      }
      downloadMedia(
        { id, isDownloaded: false },
        {
          onSuccess: (data) => {
            playTrack({
              id,
              title,
              artist: 'DuGod',
              image,
              audioUrl: data.data.url,
            });
          },
        }
      );
    }
  };

  const isAddedToCart = cartItems?.data?.items?.some((item) => item.product._id === _id);

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: '0.5rem', md: '0' },
        width: '100%',
        borderBottom: isLast ? 'none' : '1px solid #3F3F3F',
        padding: '1.25rem 0',
      }}
    >
      <Grid
        size={{ xs: 12, sm: 5 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Box
          sx={{
            width: '3.4375rem',
            height: '3.1875rem',
            borderRadius: '0.25rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image src={image} alt="track" fill style={{ objectFit: 'cover' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Typography
            sx={{
              color: '#2AC318',
              fontFamily: 'Manrope',
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '120%',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Image src="/assets/duration.svg" alt="duration" width={24} height={24} />
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'Satoshi',
                fontSize: '0.75rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '120%',
              }}
            >
              {duration}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid
        size={{ xs: 6 }}
        sx={{
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
          gap: '0.5rem',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
        }}
      >
        <Tooltip
          title={!url ? 'Purchase this track to unlock playback' : ''}
          arrow
          placement="top"
          open={tooltipOpen}
          onClose={handleTooltipClose}
          onOpen={handleTooltipOpen}
          enterTouchDelay={0}
          leaveTouchDelay={5000}
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                color: '#fff',
                fontSize: '0.875rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                maxWidth: '200px',
                textAlign: 'center',
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(0, 0, 0, 0.9)',
              },
            },
          }}
        >
          <Box
            sx={{ width: { xs: '100%', md: 'auto' } }}
            onClick={handleTooltipOpen}
            onTouchStart={handleTooltipOpen}
          >
            <Button
              onClick={() => handleMedia(_id)}
              sx={{
                display: 'flex',
                padding: '0.25rem 0.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: { xs: '100%', md: '12.5rem' },
                borderRadius: '0.25rem',
                border: '0.4px solid #FFF',
                background:
                  currentTrack?.id === _id && isPlaying
                    ? 'rgba(42, 195, 24, 0.2)'
                    : 'rgba(255, 255, 255, 0.10)',
                '&:active': {
                  background: 'rgba(255, 255, 255, 0.15)',
                },
              }}
              startIcon={
                isDownloading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Image
                    src={currentTrack?.id === _id && isPlaying ? '/assets/pause.svg' : '/assets/play.svg'}
                    alt="play"
                    width={24}
                    height={24}
                  />
                )
              }
            >
              {isDownloading ? '...' : currentTrack?.id === _id && isPlaying ? 'Playing' : 'Play'}
            </Button>
          </Box>
        </Tooltip>
        {!isPurchased && (
          <Button
            onClick={handleAddToCart}
            sx={{
              display: 'flex',
              padding: '0.25rem 0.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.25rem',
              width: { xs: '100%', md: '12rem' },
              borderRadius: '0.25rem',
              border: '0.4px solid #FFE836',
              background: isAddedToCart ? '#FFE836' : '#0F3D09',
              color: isAddedToCart ? '#000' : '#FFF',
            }}
            startIcon={
              <Image
                src={isAddedToCart ? '/assets/cart-dark.svg' : '/assets/bag.svg'}
                alt="bag"
                width={24}
                height={24}
              />
            }
            disabled={isPending}
          >
            {isAddedToCart || isPending ? 'Added to Cart' : `BUY ₦${price.toLocaleString()}`}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
