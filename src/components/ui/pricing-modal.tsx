'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import RoundedButton from './rounded-button';
import { usePhysicalProducts } from '@/hooks/products';
import { ProductStatus, ProductType } from '@/lib/api/products';
import { useAddToCart, useCart } from '@/hooks/cart';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tierColors = {
  platinum: {
    primary: '#E5E4E2', // Platinum color
    secondary: '#B8B8B8',
    accent: '#F5F5F5',
    border: '#E5E4E2',
    icon: '/assets/yellow-dvd.svg',
  },
  diamond: {
    primary: '#B9F2FF', // Diamond/light blue color
    secondary: '#87CEEB',
    accent: '#E0F6FF',
    border: '#B9F2FF',
    icon: '/assets/yellow-dvd.svg',
  },
  gold: {
    primary: '#FFD700', // Gold color
    secondary: '#FFA500',
    accent: '#FFF8DC',
    border: '#FFD700',
    icon: '/assets/yellow-dvd.svg',
  },
};

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { data: cartItems } = useCart();
  const { data: bundleProducts } = usePhysicalProducts({
    type: ProductType.BUNDLE,
    status: ProductStatus.ACTIVE,
    limit: 3,
  });
  const pricingTiers = bundleProducts?.data.map((product) => ({
    name: product.name,
    id: product._id,
    price: product.price.toLocaleString(),
    features: product.bundleItems?.map((item) => item.title) || [],
    tier: product.bundleTier,
  }));

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#111',
        backdropFilter: 'blur(8px)',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: { xs: '1rem', md: '2rem' },
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#000',
            padding: '0.2rem',
            backgroundColor: '#fff',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'ClashDisplay-Bold',
          fontSize: { xs: '1.5rem', md: '2rem' },
          mb: 4,
        }}
      >
        Choose Your GODMUZIK Experience
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {pricingTiers?.length ? (
          pricingTiers.map((tier) => {
            const colors = tierColors[tier.tier || 'gold'];
            return (
              <Box
                key={tier.name}
                sx={{
                  backgroundColor: '#000',
                  borderRadius: '1rem',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  border: `2px solid ${colors.border}`,
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${colors.primary}20`,
                    border: `2px solid ${colors.primary}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderBottom: `1px solid ${colors.border}40`,
                    paddingBottom: '1rem',
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.primary,
                      fontFamily: 'Satoshi',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}
                  >
                    {tier.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: colors.primary,
                      fontFamily: 'ClashDisplay-Bold',
                      fontSize: '2rem',
                    }}
                  >
                    ₦{tier.price}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  {tier.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.25rem',
                          backgroundColor: `${colors.primary}20`,
                          borderRadius: '50%',
                        }}
                      >
                        <Image src={colors.icon} alt="feature" width={16} height={16} />
                      </Box>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontFamily: 'Manrope',
                          fontSize: '0.875rem',
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <RoundedButton
                  onClick={() =>
                    addToCart({
                      item: {
                        product: tier.id,
                        quantity: 1,
                      },
                    })
                  }
                  loading={isPending}
                  sx={{
                    backgroundColor: colors.primary,
                    color: '#000',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: colors.secondary,
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  {cartItems?.data?.items?.some((item) => item.product._id === tier.id)
                    ? 'ADDED TO CART'
                    : 'CHOOSE ' + tier.tier}
                </RoundedButton>
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              gridColumn: '1 / -1',
              backgroundColor: '#111',
              border: '1px dashed #444',
              borderRadius: '1rem',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontFamily: 'ClashDisplay-Bold',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textAlign: 'center',
              }}
            >
              Bundle experiences are coming soon
            </Typography>
            <Typography
              sx={{
                color: '#aaa',
                fontFamily: 'Manrope',
                fontSize: '0.95rem',
                textAlign: 'center',
                maxWidth: '420px',
              }}
            >
              We&apos;re putting the finishing touches on something special. Check back shortly to
              unlock exclusive GODMUZIK bundles.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
