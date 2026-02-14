'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CryptoPaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

export default function CryptoPaymentForm({ orderId, amount, currency, onSuccess }: CryptoPaymentFormProps) {
  const [txid, setTxid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // In a real app, these would come from an API or config
  const walletAddress = process.env.NEXT_PUBLIC_CRYPTO_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const cryptoAmount = amount; // Simple 1:1 for now, usually needs conversion

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard', { variant: 'info' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txid.trim()) {
      enqueueSnackbar('Please enter a transaction hash', { variant: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      // First, we need to create/get the payment record for this order
      // Assuming there's an endpoint to initiate a crypto payment or it's created during order creation
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.dugodofficial.com';
      
      // Step 1: Submit the hash
      // Note: We need the payment ID. For now, assuming we can find it by orderId or the backend handles it.
      // If the backend requires paymentId, we'd fetch it first.
      
      await axios.post(`${apiUrl}/payments/submit-crypto-hash-by-order`, {
        orderId,
        txid: txid.trim()
      }, {
        withCredentials: true
      });

      enqueueSnackbar('Transaction submitted for verification!', { variant: 'success' });
      onSuccess();
    } catch (error: any) {
      console.error('Crypto submission error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit transaction', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <Alert severity="info" sx={{ bgcolor: 'rgba(42, 195, 24, 0.1)', color: '#fff', '& .MuiAlert-icon': { color: '#2AC318' } }}>
        Please send exactly <strong>{cryptoAmount} BTC</strong> to the address below, then paste the transaction ID (TXID) here.
      </Alert>

      <Box sx={{ bgcolor: '#0C0C0C', p: 2, borderRadius: '0.75rem', border: '1px solid #333' }}>
        <Typography sx={{ color: '#7B7B7B', fontSize: '0.8rem', mb: 1 }}>Wallet Address (BTC)</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}>
            {walletAddress}
          </Typography>
          <Button 
            size="small" 
            onClick={() => handleCopy(walletAddress)}
            sx={{ color: '#2AC318', minWidth: 'auto' }}
          >
            <ContentCopyIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Transaction Hash (TXID)"
          variant="outlined"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          disabled={isSubmitting}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#2AC318' },
              '&.Mui-focused fieldset': { borderColor: '#2AC318' },
            },
            '& .MuiInputLabel-root': { color: '#7B7B7B' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2AC318' },
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: '#2AC318',
            color: '#000',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { bgcolor: '#24a915' },
            '&.Mui-disabled': { bgcolor: '#1a1a1a', color: '#666' }
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
        </Button>
      </Box>
    </Box>
  );
}
