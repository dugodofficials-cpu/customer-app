'use client';
import RoundedButton from '@/components/ui/rounded-button';
import { useAddToCart, useCart } from '@/hooks/cart';
import { useProductById } from '@/hooks/products';
import { ProductSize, ProductType } from '@/lib/api/products';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import SectionBg from '../../../../public/assets/section-bg.png';
import Footer from '../../layout/footer';
import ProductOptions from '../../ui/product-options';
import RelatedItems from './relatedItems';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';
import { Item } from '@/lib/api/cart';

export default function ShopItem() {
  const router = useRouter();
  const pathname = usePathname();
  const productId = pathname.split('/').at(-1) || '';
  const { data: product, isError } = useProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [size, setSize] = useState<ProductSize | undefined>(undefined);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { data: cart } = useCart();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isEbook = product?.data.type === ProductType.EBOOK;

  const isInCart = cart?.data.items.find(
    (item) =>
      item.product._id === product?.data._id &&
      item.selectedOptions?.size === size &&
      item.selectedOptions?.color === product?.data?.color &&
      item.quantity === quantity
  );

  const isInCartEbook = !!cart?.data.items.find(
    (item) => item.product._id === productId && item.quantity === quantity
  );

  function handleBuyNow() {
    if (product?.data.type === ProductType.PHYSICAL) {
      if ((!size && product?.data.sizes.length) || !size) {
        enqueueSnackbar('Please select a size', { variant: 'error' });
        return;
      }
    }
    const item: Item = {
      product: productId,
      quantity,
    };

    if (!isEbook) {
      item.selectedOptions = { size: size || '', color: product?.data.color || '' };
    }

    addToCart({ item });
  }

  if (isError || !product?.data?._id) {
    return null;
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
          paddingInline: { xs: 0, sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1.5rem', sm: '2rem', md: '2.88rem' },
          margin: 0,
          overflow: 'hidden',
        }}
      >
        <Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              paddingInline: { xs: '1rem' },
              maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '1440px' },
              margin: '0 auto',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '20rem', sm: '30rem' },
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0px 19px 46.3px 0px rgba(53, 53, 53, 0.25)',
                  cursor: 'pointer',
                }}
                onClick={() => setIsImageOpen(true)}
                role="button"
                aria-label="Open product image"
              >
                <Image
                  src={product?.data.images[0] || '/assets/product-placeholder.svg'}
                  alt="product"
                  fill
                  objectFit="cover"
                />
              </Box>
              <Dialog
                open={isImageOpen}
                onClose={() => setIsImageOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(0,0,0,0.9)',
                  },
                }}
              >
                <IconButton
                  onClick={() => setIsImageOpen(false)}
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
                      src={product?.data.images[0] || '/assets/product-placeholder.svg'}
                      alt="product enlarged"
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </Box>
                </DialogContent>
              </Dialog>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  padding: { md: '2rem', xs: '2rem 1rem' },
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(103, 97, 97, 0.30)',
                  background: '#0C0C0C',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { sm: 'space-between', xs: 'flex-start' },
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'ClashDisplay-Medium',
                      fontSize: '1.5625rem',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '100%',
                    }}
                  >
                    {product?.data.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'ClashDisplay-Bold',
                      fontSize: '1.9375rem',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: '100%',
                    }}
                  >
                    ₦{product?.data.price.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ marginBlock: '1rem' }}>
                  <Typography
                    sx={{
                      color: '#FFF',
                      fontFamily: 'Manrope',
                      fontSize: '0.875rem',
                      fontStyle: 'normal',
                      textAlign: 'left',
                      fontWeight: 400,
                      lineHeight: '120%',
                    }}
                  >
                    {product?.data.description || ''}
                  </Typography>
                </Box>

                {isEbook ? null : (
                  <Box
                    sx={{
                      display: 'flex',
                      padding: '1.25rem 0.75rem',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '1.375rem',
                      width: '100%',
                      borderRadius: '0.75rem',
                      background: '#111',
                      boxShadow: '0px 12px 12px 0px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <ProductOptions
                      color={product?.data.color || ''}
                      onSizeChange={(size) => setSize(size as ProductSize)}
                      sizes={product?.data.sizes}
                      cartItem={cart?.data.items.find((item) => item.product._id === productId)}
                      onQuantityChange={(quantity) => setQuantity(quantity)}
                      productId={productId}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        paddingInline: '0.75rem',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#7B7B7B',
                          fontFamily: 'Satoshi',
                          fontSize: '1.25rem',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '120%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                        }}
                      >
                        Total:
                      </Typography>
                      <Typography
                        sx={{
                          color: '#FFF',
                          fontFamily: 'ClashDisplay-Bold',
                          fontSize: '1.9375rem',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          lineHeight: '120%',
                          gap: '1rem',
                        }}
                      >
                        ₦{Number((product?.data.price || 0) * quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <RoundedButton
                    onClick={handleBuyNow}
                    sx={{
                      background: '#0B6201',
                      paddingInline: '3rem',
                      '&:hover': {
                        background: 'rgba(42, 195, 24, 0.32)',
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
                    {isInCart
                      ? isPending
                        ? 'Adding to Cart...'
                        : 'Added to Cart'
                      : isEbook && isInCartEbook
                        ? 'Added to Cart'
                        : 'BUY NOW'}
                  </RoundedButton>
                  {!!isInCart && (
                    <RoundedButton
                      onClick={() => router.push(ROUTES.CHECKOUT)}
                      sx={{
                        background: '#FFE836',
                        paddingInline: '3rem',
                        '&:hover': {
                          background: '#FFE836',
                          opacity: 0.9,
                        },
                      }}
                      textProps={{
                        sx: {
                          color: '#0C0C0C',
                          textAlign: 'center',
                          fontFamily: 'Manrope',
                          fontSize: '0.8125rem',
                          fontStyle: 'normal',
                          fontWeight: 800,
                          lineHeight: '120%',
                        },
                      }}
                    >
                      Checkout Now
                    </RoundedButton>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <RelatedItems productId={productId} category={product?.data.categories || []} />
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
