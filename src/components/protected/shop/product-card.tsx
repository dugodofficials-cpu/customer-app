import RoundedButton from '@/components/ui/rounded-button';
import { ProductType } from '@/lib/api/products';
import { ROUTES } from '@/util/paths';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AlbumCardProps {
  id: string;
  productName: string;
  price: string;
  productImage: string;
  stockQuantity: number;
  productType: ProductType;
}

export default function ProductCard({
  id,
  productName,
  price,
  productImage,
  stockQuantity,
  productType,
}: AlbumCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const handleClick = () => {
    if (isOutOfStock) return;
    router.push(ROUTES.SHOP.DETAILS.replace(':id', id));
  };

  const isOutOfStock = stockQuantity <= 0 && productType === ProductType.PHYSICAL;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: { xs: '20rem', sm: '22rem', xl: '30rem' },
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.75rem',
        }}
      >
        <Image
          src={productImage || '/assets/product-placeholder.svg'}
          alt={productName}
          fill
          objectFit={isMobile ? 'cover' : 'contain'}
        />
      </Box>
      <Typography
        sx={{
          color: '#FFF',
          textAlign: 'center',
          fontFamily: 'panchang-bold',
          fontSize: '1.25rem',
          fontStyle: 'normal',
          fontWeight: 700,
        }}
      >
        {productName}
      </Typography>
      <Typography
        sx={{
          color: '#FFF',
          textAlign: 'center',
          fontFamily: 'panchang',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '120%',
        }}
      >
        ₦{Number(price).toLocaleString()}
      </Typography>

      <RoundedButton
        onClick={isOutOfStock ? undefined : handleClick}
        disabled={isOutOfStock}
        sx={{
          backgroundColor: isOutOfStock ? '#7B7B7B' : '#0B6201',
          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          color: '#FFF',
          padding: '0.75rem 3rem',
          '&:hover': {
            backgroundColor: 'rgba(42, 195, 24, 0.32)',
          },
        }}
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
      >
        {isOutOfStock ? 'Out of Stock' : 'View Product'}
      </RoundedButton>
    </Box>
  );
}
