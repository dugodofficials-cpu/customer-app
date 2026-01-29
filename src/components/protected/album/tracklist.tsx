'use client';
import PricingModal from '@/components/ui/pricing-modal';
import { useAddToCart, useCart } from '@/hooks/cart';
import { useGetUserOrders } from '@/hooks/order';
import { useProductsByAlbum } from '@/hooks/products';
import { useUser } from '@/hooks/user';
import { Product, ProductType } from '@/lib/api/products';
import { calculateTotalDuration } from '@/lib/utils/time';
import { ROUTES } from '@/util/paths';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  Skeleton,
} from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import About from '../../layout/about';
import Footer from '../../layout/footer';
import TracklistItem from './tracklist-item';

export default function Tracklist() {
  const router = useRouter();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const pathname = usePathname();
  const albumId = pathname.split('/')[2];
  const { data: albumProducts, isLoading, isError } = useProductsByAlbum(albumId);

  const { mutate: addToCart, isPending } = useAddToCart();
  const { data: cartItems } = useCart();
  const { user } = useUser();
  const { data: orders } = useGetUserOrders(user?._id || '', {
    page: 1,
    type: ProductType.DIGITAL,
  });
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  const handleOpenPricingModal = () => {
    setIsPricingModalOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingModalOpen(false);
  };

  const hasPurchased = albumProducts?.data.every(
    (product) => product.digitalDeliveryInfo?.downloadUrl
  );

  const handleAddToCart = () => {
    if (!albumProducts?.data) return;
    if (
      cartItems?.data?.items?.length &&
      albumProducts?.data.every((product) =>
        cartItems?.data?.items?.some((item) => item.product._id === product._id)
      )
    ) {
      return;
    }

    Promise.all(
      albumProducts.data.map((product) =>
        addToCart({
          item: {
            product: product._id,
            quantity: 1,
          },
        })
      )
    );
  };

  if (isLoading) {
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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '0.5rem', sm: '1rem' },
            width: '100%',
            padding: 0,
            margin: 0,
          }}
        >
          <Skeleton
            variant="text"
            width={280}
            height={40}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mt: { xs: '0.5rem' } }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '0.5rem', sm: '1rem' },
            width: '100%',
            backgroundColor: '#000',
            paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
            paddingBlock: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
            margin: 0,
          }}
        >
          <Skeleton
            variant="text"
            width={360}
            height={32}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mb: 2 }}
          />
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              alignItems: 'stretch',
            }}
          >
            <Grid
              size={{ xs: 12, lg: 9 }}
              sx={{ width: '100%', minWidth: 0, flex: { xs: '1 1 100%', lg: '1 1 auto' } }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '16rem', sm: '22rem', md: '28rem', lg: '33rem' },
                  borderRadius: '0.25rem',
                  overflow: 'hidden',
                }}
              >
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height="100%"
                  sx={{ bgcolor: 'grey.900', borderRadius: '0.25rem' }}
                />
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, lg: 3 }}
              sx={{
                display: { xs: 'none', lg: 'block' },
                width: '100%',
                minWidth: 0,
              }}
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height="33rem"
                sx={{ bgcolor: 'grey.900', borderRadius: '0.25rem' }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              marginTop: '1.5rem',
              width: '100%',
              justifyContent: 'space-between',
              maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
              marginInline: 'auto',
            }}
          >
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Box>
                <Skeleton variant="text" width={160} height={32} sx={{ bgcolor: 'grey.800' }} />
                <Box sx={{ mt: 1, display: 'flex', gap: 8 }}>
                  <Skeleton variant="rounded" width={24} height={24} sx={{ bgcolor: 'grey.900' }} />
                  <Skeleton variant="text" width={80} height={24} sx={{ bgcolor: 'grey.900' }} />
                  <Skeleton variant="rounded" width={8} height={8} sx={{ bgcolor: 'grey.900' }} />
                  <Skeleton variant="rounded" width={24} height={24} sx={{ bgcolor: 'grey.900' }} />
                  <Skeleton variant="text" width={80} height={24} sx={{ bgcolor: 'grey.900' }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    p: '0.75rem',
                    borderRadius: '0.5rem',
                    bgcolor: '#0D0D0D',
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <Skeleton
                      variant="rounded"
                      width={48}
                      height={48}
                      sx={{ bgcolor: 'grey.900', borderRadius: '0.5rem' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={20}
                        sx={{ bgcolor: 'grey.900' }}
                      />
                      <Skeleton
                        variant="text"
                        width="30%"
                        height={16}
                        sx={{ bgcolor: 'grey.900' }}
                      />
                    </Box>
                  </Box>
                  <Skeleton
                    variant="rounded"
                    width={80}
                    height={28}
                    sx={{ bgcolor: 'grey.900', borderRadius: '1rem' }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  if (!albumProducts?.data.length || isError) {
    router.push(ROUTES.MUSIC);
    return null;
  }

  const totalDuration = calculateTotalDuration(
    albumProducts?.data.map((product) => product.duration || '00:00') || []
  );

  const isAlbumPurchased = orders?.data?.some((order) =>
    albumProducts?.data.every((product) =>
      order.items.some((item) => {
        if (!item.product) return false;
        const orderProduct = item.product as Product;
        return orderProduct._id === product._id;
      })
    )
  );

  const isAddedToCart =
    cartItems?.data?.items?.length &&
    albumProducts?.data.every((product) =>
      cartItems?.data?.items?.some((item) => item.product._id === product._id)
    );

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
        onClick={() => router.push(ROUTES.MUSIC)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0rem',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1.5rem', sm: '2rem' },
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
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'Manrope',
            fontSize: '0.75rem',
            fontStyle: 'normal',
            textDecoration: 'underline',
            textUnderlineOffset: '0.2rem',
            textDecorationColor: '#2AC318',
            fontWeight: 600,
            lineHeight: '120%',
          }}
        >
          Back to albums
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
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
              xs: '1.5rem',
              sm: '2.5rem',
              md: '3.0625rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
            marginTop: { xs: '0.5rem' },
            px: { xs: '1rem', sm: 0 },
          }}
        >
          DuGod Music Catalog 🎧
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          backgroundColor: '#000',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
          margin: 0,
        }}
      >
        <Typography
          sx={{
            color: '#7B7B7B',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: {
              xs: '1rem',
              sm: '1.375rem',
              md: '1.5625rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          Access exclusive packages or shop tracks individually.
        </Typography>
        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'Manrope',
            fontSize: {
              xs: '1rem',
              sm: '1.25rem',
            },
            fontStyle: 'normal',
          }}
        >
          🔥 New Album Drop &quot;{albumProducts?.data[0].album || ''}&quot;
        </Typography>
        <Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
              margin: '0 auto',
            }}
          >
            <Grid size={{ xs: 12, lg: 9 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                  height: '33rem',
                  borderRadius: '0.25rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => setIsCoverOpen(true)}
                role="button"
                aria-label="Open album cover"
              >
                <Image
                  src={albumProducts?.data[0].albumId?.imageUrl || ''}
                  alt="album1"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </Box>
              <Dialog
                open={isCoverOpen}
                onClose={() => setIsCoverOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                  sx: { bgcolor: 'rgba(0,0,0,0.9)' },
                }}
              >
                <IconButton
                  onClick={() => setIsCoverOpen(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: '#fff',
                    zIndex: 1,
                  }}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                    bgcolor: 'transparent',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: '70vh', sm: '80vh' },
                    }}
                  >
                    <Image
                      src={albumProducts?.data[0].albumId?.imageUrl || ''}
                      alt="album cover enlarged"
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </Box>
                </DialogContent>
              </Dialog>
            </Grid>
            <Grid
              size={{ xs: 12, lg: 3 }}
              sx={{
                display: { xs: 'none', lg: 'block' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                  height: '33rem',
                  borderRadius: '0.25rem',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/bundleBanner.png"
                  alt="bundleBanner"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    width: '95%',
                    minHeight: '14rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    alignSelf: 'stretch',
                    padding: '2.25rem 0.75rem',
                    borderRadius: '0.75rem',
                    border: '2px dashed rgba(12, 12, 12, 0.40)',
                    background: 'rgba(184, 255, 203, 0.10)',
                    boxShadow: '0px 9px 35px 0px rgba(0, 0, 0, 0.10)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#0C0C0C',
                      fontFamily: 'ClashDisplay-Bold',
                      fontSize: '1.9375rem',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: '120%',
                    }}
                  >
                    Save Money!
                  </Typography>
                  <Typography
                    sx={{
                      color: '#0C0C0C',
                      fontFamily: 'Satoshi',
                      fontSize: '1.25rem',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '120%',
                    }}
                  >
                    Get more for less when you purchase a bundle!
                  </Typography>
                  <Button
                    onClick={handleOpenPricingModal}
                    startIcon={
                      <Image
                        src="/assets/bundle-icon.svg"
                        alt="arrowRight"
                        width={18}
                        height={18}
                      />
                    }
                    sx={{
                      display: 'flex',
                      padding: '0.75rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.625rem',
                      alignSelf: 'stretch',
                      borderRadius: '2rem',
                      background: '#FFE836',
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
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              marginTop: '1.5rem',
              width: '100%',
              justifyContent: 'space-between',
              maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
              marginInline: 'auto',
            }}
          >
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  color: '#FFF',
                  fontFamily: 'Manrope',
                  fontSize: '0.875rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '120%',
                  textAlign: 'center',
                }}
              >
                {albumProducts?.data[0]?.albumId?.description || ''}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12, md: 6 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'space-between' },
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: '#FFF',
                    fontFamily: 'Panchang',
                    fontSize: '1.375rem',
                    fontStyle: 'normal',
                    fontWeight: 700,
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
                    {totalDuration}
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
                gap: { xs: '1rem', lg: '0' },
              }}
            >
              <Button
                onClick={handleOpenPricingModal}
                startIcon={
                  <Image src="/assets/bundle-icon.svg" alt="arrowRight" width={18} height={18} />
                }
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  padding: '0.75rem 1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.625rem',
                  borderRadius: '2rem',
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
              {hasPurchased ? null : (
                <Button
                  onClick={handleAddToCart}
                  startIcon={
                    <Image
                      src={isAddedToCart ? '/assets/cart-dark.svg' : '/assets/dvd.svg'}
                      alt="dvd"
                      width={18}
                      height={18}
                    />
                  }
                  sx={{
                    display: isAlbumPurchased ? 'none' : 'flex',
                    padding: '0.75rem 1.5rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '2rem',
                    background: isAddedToCart ? '#FFE836' : '#0B6201',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                  disabled={isPending}
                >
                  <Typography
                    sx={{
                      color: isAddedToCart ? '#000' : '#FFF',
                      fontFamily: 'Manrope',
                      fontSize: '0.75rem',
                      fontStyle: 'normal',
                      fontWeight: 700,
                    }}
                  >
                    {isAddedToCart && !isPending ? 'Added to Cart' : 'Buy Full Album'}
                  </Typography>
                </Button>
              )}
            </Grid>
            <Grid size={{ xs: 12 }} sx={{}}>
              {albumProducts?.data.map((product, index) => (
                <TracklistItem
                  key={product._id}
                  url={product.digitalDeliveryInfo?.downloadUrl || ''}
                  isLast={index === albumProducts.data.length - 1}
                  title={product.name}
                  duration={product.duration || '00:00'}
                  price={product.price}
                  image={product?.albumId?.imageUrl || ''}
                  _id={product._id}
                />
              ))}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            marginTop: { xs: '2rem', sm: '3rem', md: '4rem' },
          }}
        >
          <About />
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
