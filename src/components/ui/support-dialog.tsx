'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { useUser } from '@/hooks/user';
import { useSnackbar } from 'notistack';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportDialog({ open, onClose }: SupportDialogProps) {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [supportAmount, setSupportAmount] = useState('');

  const handlePayment = () => {
    const amount = parseFloat(supportAmount);
    if (!amount || amount < 1000) {
      enqueueSnackbar('Minimum support amount is ₦1,000', { variant: 'error' });
      return;
    }

    if (!user?.email) {
      enqueueSnackbar('Please sign in to make a payment', { variant: 'error' });
      return;
    }

    const paystackInstance = new PaystackPop();
    paystackInstance.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email: user.email,
      amount: amount * 100, // Convert to kobo
      metadata: {
        custom_fields: [
          {
            display_name: 'Support Type',
            variable_name: 'support_type',
            value: 'movement_support',
          },
          {
            display_name: 'User Email',
            variable_name: 'user_email',
            value: user.email,
          },
          {
            display_name: 'Support Amount',
            variable_name: 'support_amount',
            value: amount.toString(),
          },
        ],
      },
      onSuccess: () => {
        enqueueSnackbar('Thank you for your support!', { variant: 'success' });
        onClose();
        setSupportAmount('');
      },
      onError: () => {
        enqueueSnackbar('Payment failed. Please try again.', { variant: 'error' });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0D0D0D',
          border: '1px solid rgba(103, 97, 97, 0.30)',
          borderRadius: '0.75rem',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFF',
          fontFamily: 'ClashDisplay-Bold',
          fontSize: '1.5rem',
          pb: 1,
        }}
      >
        Support the Movement
        <IconButton onClick={onClose} sx={{ color: '#FFF' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', mt: 1 }}>
          <TextField
            label="Amount (₦)"
            type="number"
            value={supportAmount}
            onChange={(e) => setSupportAmount(e.target.value)}
            fullWidth
            InputProps={{
              sx: {
                color: '#FFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(103, 97, 97, 0.30)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2AC318',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2AC318',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#C4C4C4',
                '&.Mui-focused': {
                  color: '#2AC318',
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: '#7B7B7B',
                fontFamily: 'Satoshi',
                fontSize: '0.875rem',
              },
            }}
          />
          <Button
            onClick={handlePayment}
            sx={{
              display: 'flex',
              padding: '0.75rem',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '2rem',
              background: '#FFE836',
              '&:hover': {
                background: '#FFE836',
                opacity: 0.9,
              },
            }}
          >
            <Typography
              sx={{
                color: '#0C0C0C',
                textAlign: 'center',
                fontFamily: 'Manrope',
                fontSize: '0.875rem',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '120%',
              }}
            >
              Proceed to Payment
            </Typography>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
