import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import PrimaryButton from '@/components/ui/custom-button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import { useAddToCart, useCart } from '@/hooks/cart';
import { Product } from '@/lib/api/products';

interface AlbumCardProps {
  id: string;
  albumName: string;
  trackList: number;
  isPurchased: boolean;
  duration: string;
  price: string;
  buttonText: string;
  albumImage: string;
  tracks: Product[];
}

export default function AlbumCard({
  id,
  albumName,
  trackList,
  isPurchased,
  duration,
  price,
  buttonText,
  albumImage,
  tracks,
}: AlbumCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();
  const { data: cartItems } = useCart();
  const handleClick = () => {
    router.push(ROUTES.ALBUM.DETAILS.replace(':id', id));
  };

  const isAddedToCart =
    cartItems?.data?.items?.length &&
    tracks.every((track) => cartItems?.data?.items?.some((item) => item.product._id === track._id));

  const handleAddToCart = () => {
    Promise.all(
      tracks.map((track) =>
        addToCart({
          item: {
            product: track._id,
            quantity: 1,
          },
        })
      )
    );
  };

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
          src={albumImage} 
          alt={albumName} 
          fill 
          unoptimized 
          style={{ objectFit: isMobile ? 'cover' : 'contain' }} 
        />
      </Box>
      <Typography
        sx={{
          color: '#FFF',
          textAlign: 'center',
          fontFamily: 'ClashDisplay-SemiBold',
          fontSize: '1.9rem',
          fontStyle: 'normal',
          fontWeight: 600,
        }}
      >
        {albumName}
      </Typography>
      <Typography
        sx={{
          color: '#FFF',
          textAlign: 'center',
          fontFamily: 'Satoshi-Bold',
          fontSize: '1.25rem',
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
          justifyContent: 'center',
          gap: '0.75rem',
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
          {trackList}
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
          {duration}
        </Typography>
      </Box>
      {!isPurchased ? (
        <PrimaryButton
          onClick={handleAddToCart}
          disabled={isPending || trackList === 0}
          textColor={isAddedToCart ? '#000' : '#FFF'}
          sx={{
            backgroundColor: isAddedToCart ? '#FFE836' : '#0F3D09',
          }}
          startIcon={
            <Image
              src={isAddedToCart ? '/assets/cart-dark.svg' : '/assets/dvd.svg'}
              alt="play"
              width={24}
              height={24}
            />
          }
        >
          {isAddedToCart ? 'Added to Cart' : price}
        </PrimaryButton>
      ) : null}
      <PrimaryButton
        disabled={trackList === 0}
        onClick={handleClick}
        sx={{
          backgroundColor: '#202020',
          color: '#FFF',
        }}
      >
        {buttonText}
      </PrimaryButton>
    </Box>
  );
}
