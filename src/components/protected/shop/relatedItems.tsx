'use client';
import { usePhysicalProducts } from '@/hooks/products';
import { ProductStatus, ProductType } from '@/lib/api/products';
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/util/paths';
import ProductCard from './product-card';

export default function RelatedItems({
  productId,
  category,
}: {
  productId: string;
  category: string[];
}) {
  const router = useRouter();
  const [sort, setSort] = useState('All');
  const [useCategory, setUseCategory] = useState(true);

  const {
    data: physicalProducts,
    isLoading,
    isError,
  } = usePhysicalProducts({
    type: ProductType.PHYSICAL,
    status: ProductStatus.ACTIVE,
    ...(useCategory && { category: category?.join(', ') }),
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
    limit: 9,
    page: 1,
    exclude: productId,
  });

  useEffect(() => {
    if (!isLoading && physicalProducts?.data && physicalProducts.data.length === 0 && useCategory) {
      setUseCategory(false);
    }
  }, [isLoading, physicalProducts, useCategory]);

  if (isLoading)
    return (
      <Box
        sx={{
          marginTop: 0,
          width: '100%',
          paddingInline: { xs: '1rem', sm: 0 },
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
          margin: '0 auto',
        }}
      >
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: { xs: '1.5rem', sm: '3.75rem' },
            marginBottom: { xs: '1.5rem', sm: '1.5rem' },
          }}
        >
          <Skeleton variant="text" width={200} height={36} sx={{ bgcolor: 'grey.800' }} />
          <Skeleton variant="rounded" width={112} height={40} sx={{ bgcolor: 'grey.800' }} />
        </Grid>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {[1, 2, 3].map((i) => (
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
                    <Skeleton variant="text" width="80%" height={24} sx={{ bgcolor: 'grey.900' }} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'grey.900' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
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

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
  };

  return (
    <Box
      sx={{
        marginTop: 0,
        width: '100%',
        paddingInline: { xs: '1rem', sm: 0 },
        maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
        margin: '0 auto',
      }}
    >
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: { xs: '1.5rem', sm: '3.75rem' },
          marginBottom: { xs: '1.5rem', sm: '1.5rem' },
        }}
      >
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: '1.5rem',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          More Like This
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
      </Grid>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {physicalProducts.data.map((product) => (
          <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <ProductCard
                id={product._id}
                productName={product.name}
                price={product.price.toString()}
                productImage={product.images[0]}
                stockQuantity={product.stockQuantity || 0}
                productType={product.type}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: { xs: '2rem', sm: '3rem' },
        }}
      >
        <Button
          onClick={() => router.push(ROUTES.SHOP.HOME)}
          sx={{
            display: 'flex',
            height: '2.6875rem',
            padding: { xs: '0.1875rem 1.5rem', sm: '0.1875rem 2rem' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.625rem',
            borderRadius: '0.5rem',
            border: '1px solid #FFF',
            background: 'transparent',
            color: '#FFF',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#FFF',
            },
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontFamily: 'space-grotesk',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            View More
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
