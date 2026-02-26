'use client';
import { usePhysicalProducts } from '@/hooks/products';
import { ProductStatus, ProductType } from '@/lib/api/products';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import { useState } from 'react';
import SectionBg from '../../../../public/assets/section-bg.png';
import Footer from '../../layout/footer';
import ProductCard from './product-card';

export default function Shop() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('All');
  const {
    data: physicalProducts,
    isLoading,
    isError,
  } = usePhysicalProducts({
    status: ProductStatus.ACTIVE,
    isActive: true,
    sortBy:
      sort === 'Price: Low to High'
        ? 'price'
        : sort === 'Price: High to Low'
          ? 'price'
          : sort === 'Newest'
            ? 'createdAt'
            : sort === 'Oldest'
              ? 'createdAt'
              : sort === 'All'
                ? 'createdAt'
                : 'createdAt',
    sortOrder:
      sort === 'Price: Low to High'
        ? 'asc'
        : sort === 'Price: High to Low'
          ? 'desc'
          : sort === 'Newest'
            ? 'desc'
            : sort === 'Oldest'
              ? 'asc'
              : sort === 'All'
                ? 'desc'
                : 'desc',
    limit: 12,
    page,
  });

  const shopProducts = (physicalProducts?.data || []).filter(
    (p) => p.type === ProductType.PHYSICAL || p.type === ProductType.DIGITAL,
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
    setPage(1); // Reset to first page when sorting changes
  };

  if (isLoading)
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
            width={260}
            height={48}
            sx={{ bgcolor: 'grey.800', mx: 'auto', mt: { xs: '4rem' } }}
          />
          <Skeleton
            variant="text"
            width={320}
            height={28}
            sx={{ bgcolor: 'grey.800', mx: 'auto' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '0.5rem', sm: '1rem' },
            width: '100%',
            backgroundImage: `url(${SectionBg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000',
            paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
            paddingBlock: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
            margin: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: { xs: '1.5rem', sm: '2rem' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: '1rem', sm: 0 },
            }}
          >
            <Skeleton variant="text" width={220} height={36} sx={{ bgcolor: 'grey.800' }} />
            <Skeleton variant="rounded" width={112} height={40} sx={{ bgcolor: 'grey.800' }} />
          </Box>
          <Box>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 320,
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
          </Box>
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
            <Footer />
          </Box>
        </Box>
      </Box>
    );

  if (isError || !physicalProducts?.data) {
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
        <Typography>Failed to load products. Please try again later.</Typography>
      </Box>
    );
  }

  if (!shopProducts || shopProducts.length === 0)
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
        <Typography>No products found.</Typography>
      </Box>
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
          DuGod SHOP
        </Typography>
        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Medium',
            fontWeight: 500,
            fontSize: {
              xs: '1.25rem',
              sm: '1.375rem',
              md: '1.5625rem',
            },
          }}
        >
          Official DuGod WEDAR 🛍️ Style the vibe.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          backgroundImage: `url(${SectionBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
          margin: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: { xs: '1.5rem', sm: '2rem' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: '1rem', sm: 0 },
          }}
        >
          <Typography
            sx={{
              color: '#FFF',
              textAlign: { xs: 'center', sm: 'left' },
              fontFamily: 'panchang-bold',
              fontSize: {
                xs: '1.25rem',
                sm: '1.375rem',
                md: '1.5625rem',
              },
              fontStyle: 'normal',
              letterSpacing: '-0.05rem',
              fontWeight: 700,
              lineHeight: '90%',
            }}
          >
            🛍️ Limited Merch Drop <br />
            <small
              style={{
                fontSize: '0.75rem',
                letterSpacing: '-0.03rem',
                fontFamily: 'panchang',
                fontWeight: 400,
              }}
            >
              Only While Stocks Last
            </small>
          </Typography>
          <Select
            value={sort}
            onChange={handleSortChange}
            IconComponent={() => (
              <IconButton
                sx={{
                  color: '#FFF',
                  padding: 0,
                  position: 'absolute',
                  right: 8,
                  pointerEvents: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Image src="/assets/arrow-down.svg" alt="arrow-down" width={16} height={16} />
              </IconButton>
            )}
            displayEmpty
            renderValue={sort !== '' ? undefined : () => 'Sort'}
            sx={{
              color: '#FFF',
              fontFamily: 'Satoshi',
              fontSize: '1.25rem',
              fontStyle: 'normal',
              fontWeight: 400,
              borderRadius: '0.375rem',
              border: '1px solid #7B7B7B',
              padding: '0.5rem',
              width: '7rem',
              height: '2.5rem',
              backgroundColor: '#3F3F3F',
              '& .MuiSelect-select': {
                color: '#FFF',
                padding: '0.25rem 0.5rem',
                paddingRight: '2rem !important',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#000',
                  border: '1px solid #7B7B7B',
                  borderRadius: '0.375rem',
                  fontFamily: 'panchang',
                  mt: 1,
                  '& .MuiMenuItem-root': {
                    color: '#FFF',
                    fontFamily: 'panchang',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
            <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
          </Select>
        </Box>
        <Box>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {shopProducts.map((product) => (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <ProductCard
                    id={product._id}
                    productName={product.name}
                    price={String(product.price)}
                    productImage={product.images?.[0] || ''}
                    stockQuantity={product.stockQuantity || 0}
                    productType={product.type}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          {physicalProducts.meta.totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Pagination
                count={physicalProducts.meta.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#fff',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    minWidth: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#0B6201',
                      borderColor: '#0B6201',
                      '&:hover': {
                        backgroundColor: '#0B6201',
                      },
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
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
