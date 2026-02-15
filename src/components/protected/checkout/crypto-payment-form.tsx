'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CryptoNetwork {
  name: string;
  coin: string;
  address: string;
  networkName: string;
}

const CRYPTO_NETWORKS: CryptoNetwork[] = [
  { name: 'Ethereum', coin: 'ETH', networkName: 'ERC20', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Bitcoin', coin: 'BTC', networkName: 'Native SegWit', address: 'bc1qq9luswn06crznjej90pmgdxdv2c963u9hfjf2u' },
  { name: 'Solana', coin: 'SOL', networkName: 'Solana', address: '9mAs57DBZfDNuniq3PiqGvkW6YuBKKmtBrJTHueBKd4y' },
  { name: 'Tron', coin: 'TRX/USDT', networkName: 'TRC20', address: 'TQywuv16Wn49BEkKRoELtnEVevFgk6MLkw' },
  { name: 'Linea', coin: 'ETH', networkName: 'Linea', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Arbitrum', coin: 'ETH', networkName: 'Arbitrum One', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'BNB Chain', coin: 'BNB/USDT', networkName: 'BEP20', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Base', coin: 'ETH', networkName: 'Base', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Optimism', coin: 'ETH', networkName: 'OP Mainnet', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Polygon', coin: 'MATIC', networkName: 'Polygon POS', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
];

interface CryptoPaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

export default function CryptoPaymentForm({ orderId, amount, currency, onSuccess }: CryptoPaymentFormProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork>(CRYPTO_NETWORKS[0]);
  const [txid, setTxid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.dugodofficial.com';
      
      await axios.post(`${apiUrl}/payments/submit-crypto-hash-by-order`, {
        orderId,
        txid: txid.trim(),
        metadata: {
          network: selectedNetwork.name,
          chain: selectedNetwork.networkName,
          coin: selectedNetwork.coin
        }
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
      <FormControl fullWidth sx={{
        '& .MuiOutlinedInput-root': {
          color: '#fff',
          '& fieldset': { borderColor: '#333' },
          '&:hover fieldset': { borderColor: '#2AC318' },
          '&.Mui-focused fieldset': { borderColor: '#2AC318' },
        },
        '& .MuiInputLabel-root': { color: '#7B7B7B' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2AC318' },
      }}>
        <InputLabel id="network-select-label">Select Coin & Network</InputLabel>
        <Select
          labelId="network-select-label"
          value={selectedNetwork.name}
          label="Select Coin & Network"
          onChange={(e) => {
            const network = CRYPTO_NETWORKS.find(n => n.name === e.target.value);
            if (network) setSelectedNetwork(network);
          }}
          sx={{
            '& .MuiSvgIcon-root': { color: '#7B7B7B' }
          }}
        >
          {CRYPTO_NETWORKS.map((network) => (
            <MenuItem key={network.name} value={network.name}>
              {network.name} ({network.networkName})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Alert severity="info" sx={{ bgcolor: 'rgba(42, 195, 24, 0.1)', color: '#fff', '& .MuiAlert-icon': { color: '#2AC318' } }}>
        Please send your payment to the <strong>{selectedNetwork.name} ({selectedNetwork.networkName})</strong> address below, then paste the transaction ID (TXID) here.
      </Alert>

      <Box sx={{ bgcolor: '#0C0C0C', p: 2, borderRadius: '0.75rem', border: '1px solid #333' }}>
        <Typography sx={{ color: '#7B7B7B', fontSize: '0.8rem', mb: 1 }}>
          {selectedNetwork.name} ({selectedNetwork.networkName}) Address
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}>
            {selectedNetwork.address}
          </Typography>
          <Button 
            size="small" 
            onClick={() => handleCopy(selectedNetwork.address)}
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
          placeholder="Paste your transaction hash here"
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
