'use client';

import { Box, Typography, Select, MenuItem, IconButton, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { CartItem } from '@/lib/api/cart';
import { useCart } from '@/hooks/cart';

interface ProductOptionsProps {
  color?: string;
  onSizeChange?: (size: string) => void;
  onQuantityChange?: (quantity: number) => void;
  sizes?: string[];
  cartItem?: CartItem;
  productId?: string;
}

export default function ProductOptions({
  color = 'Black',
  onSizeChange,
  onQuantityChange,
  sizes,
  cartItem,
  productId,
}: ProductOptionsProps) {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const { data: cart } = useCart();

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity || 1);
    }
  }, [cartItem]);

  const handleSizeChange = (event: SelectChangeEvent<string>) => {
    const newSize = event.target.value;

    if (productId && cart?.data.items) {
      const existingVariant = cart.data.items.find(
        (item) => item.product._id === productId && item.selectedOptions?.size === newSize
      );

      if (existingVariant) {
        setQuantity(existingVariant.quantity);
        onQuantityChange?.(existingVariant.quantity);
      } else {
        setQuantity(1);
        onQuantityChange?.(1);
      }
    }

    setSize(newSize);
    onSizeChange?.(newSize);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
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
          }}
        >
          Colour:
        </Typography>
        <Typography
          sx={{
            color: '#FFF',
            fontFamily: 'Satoshi',
            fontSize: '1.25rem',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '120%',
          }}
        >
          {color}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {sizes && (
          <Typography
            sx={{
              color: '#7B7B7B',
              fontFamily: 'Satoshi',
              fontSize: '1.25rem',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '120%',
            }}
          >
            Size:
          </Typography>
        )}
        <Select
          value={size}
          onChange={handleSizeChange}
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
          renderValue={size !== '' ? undefined : () => 'Select'}
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
            backgroundColor: '#000',
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
                mt: 1,
                '& .MuiMenuItem-root': {
                  color: '#FFF',
                  fontFamily: 'Satoshi',
                  fontSize: '1.25rem',
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
          {sizes?.map((size) => (
            <MenuItem key={size} value={size} selected={cartItem?.selectedOptions?.size === size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
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
          Quantity:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#000',
            borderRadius: '0.375rem',
            padding: '0.25rem',
            border: '1px solid #7B7B7B',
          }}
        >
          <IconButton
            onClick={() => handleQuantityChange(-1)}
            sx={{
              color: '#FFF',
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'Satoshi',
              fontSize: '1.25rem',
              minWidth: '2rem',
              textAlign: 'center',
            }}
          >
            {quantity}
          </Typography>
          <IconButton
            onClick={() => handleQuantityChange(1)}
            sx={{
              color: '#FFF',
              padding: '0.25rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
