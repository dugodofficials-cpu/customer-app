'use client';
import { useProducts } from '@/hooks/products';
import { ProductStatus, ProductType } from '@/lib/api/products';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';
import About from '../../layout/about';
import Footer from '../../layout/footer';
import AlbumCard from './album-card';
import { calculateTotalDuration } from '@/lib/utils/time';

export default function Album() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProducts({
    page,
    limit: 12,
    type: ProductType.DIGITAL,
    status: ProductStatus.ACTIVE,
    isActive: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
          marginInline: 'auto',
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
            width={320}
            height={48}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mt: { xs: '4rem' } }}
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
            width={140}
            height={36}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mb: 2 }}
          />
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: '#111',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(103,97,97,0.30)',
                      overflow: 'hidden',
                      p: 1.5,
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      sx={{ bgcolor: 'grey.900', borderRadius: '0.5rem' }}
                      width="100%"
                      height={200}
                    />
                    <Box sx={{ mt: 1.5 }}>
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={24}
                        sx={{ bgcolor: 'grey.900' }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ bgcolor: 'grey.900' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Skeleton variant="rounded" width={280} height={40} sx={{ bgcolor: 'grey.800' }} />
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
      </Box>
    );
  }

  if (isError || !data?.data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: '#fff',
        }}
      >
        <Typography>Failed to load albums. Please try again later.</Typography>
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
              xs: '2rem',
              sm: '2.5rem',
              md: '3.0625rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
            marginTop: { xs: '4rem' },
            px: { xs: '1rem', sm: 0 },
          }}
        >
          Explore DuGod&apos;s <br /> Discography
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
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: {
              xs: '1.25rem',
              sm: '1.375rem',
              md: '1.5625rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          Albums
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
            {data?.data.map((album) => {
              const totalDuration = calculateTotalDuration(
                album.products.map((product) => product.duration || '00:00') || []
              );
              return (
                <Grid key={album.album} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <AlbumCard
                      id={album.album}
                      tracks={album.products}
                      albumName={album.album}
                      trackList={album.totalTracks}
                      isPurchased={album.products.every(
                        (product) => product.digitalDeliveryInfo?.downloadUrl
                      )}
                      duration={totalDuration}
                      price={'Buy Full Album'}
                      buttonText={album.totalTracks > 0 ? 'Explore Album' : 'Coming Soon'}
                      albumImage={album.coverImage || album.products[0].images[0]}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          {data && data.meta.totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#fff',
                    '&.Mui-selected': {
                      backgroundColor: '#0B6201',
                    },
                  },
                }}
              />
            </Box>
          )}
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
    </Box>
  );
}
