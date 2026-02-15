'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel, Divider, Stepper, Step, StepLabel } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface CryptoNetwork {
  name: string;
  coin: string;
  id: string; // For CoinGecko API
  address: string;
  networkName: string;
}

const CRYPTO_NETWORKS: CryptoNetwork[] = [
  { name: 'Ethereum', coin: 'ETH', id: 'ethereum', networkName: 'ERC20', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Bitcoin', coin: 'BTC', id: 'bitcoin', networkName: 'Native SegWit', address: 'bc1qq9luswn06crznjej90pmgdxdv2c963u9hfjf2u' },
  { name: 'Solana', coin: 'SOL', id: 'solana', networkName: 'Solana', address: '9mAs57DBZfDNuniq3PiqGvkW6YuBKKmtBrJTHueBKd4y' },
  { name: 'Tron', coin: 'TRX/USDT', id: 'tron', networkName: 'TRC20', address: 'TQywuv16Wn49BEkKRoELtnEVevFgk6MLkw' },
  { name: 'Linea', coin: 'ETH', id: 'ethereum', networkName: 'Linea', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Arbitrum', coin: 'ETH', id: 'ethereum', networkName: 'Arbitrum One', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'BNB Chain', coin: 'BNB/USDT', id: 'binancecoin', networkName: 'BEP20', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Base', coin: 'ETH', id: 'ethereum', networkName: 'Base', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Optimism', coin: 'ETH', id: 'ethereum', networkName: 'OP Mainnet', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
  { name: 'Polygon', coin: 'MATIC', id: 'matic-network', networkName: 'Polygon POS', address: '0x47548DD6C4Ec984ADf7a53a7c51EA0D38834BD3F' },
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
  const [cryptoRate, setCryptoRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      setIsFetchingRate(true);
      try {
        // We use NGN as base if currency is NGN, else USD
        const vsCurrency = currency.toLowerCase() === 'ngn' ? 'ngn' : 'usd';
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedNetwork.id}&vs_currencies=${vsCurrency}`);
        const rate = response.data[selectedNetwork.id][vsCurrency];
        setCryptoRate(rate);
      } catch (error) {
        console.error('Error fetching crypto rate:', error);
        enqueueSnackbar('Failed to fetch real-time exchange rate', { variant: 'error' });
      } finally {
        setIsFetchingRate(false);
      }
    };

    fetchRate();
  }, [selectedNetwork, currency, enqueueSnackbar]);

  const cryptoAmount = cryptoRate ? (amount / cryptoRate).toFixed(selectedNetwork.coin === 'BTC' ? 8 : 6) : '...';

  const paymentSteps = [
    { label: 'Select Network', description: 'Choose your preferred coin and network.' },
    { label: 'Transfer Funds', description: 'Send the exact amount to the provided address.' },
    { label: 'Submit Hash', description: 'Paste the transaction ID (TXID) to confirm.' },
  ];

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
    } catch (error) {
      console.error('Crypto submission error:', error);
      let errorMessage = 'Failed to submit transaction';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      {/* Detailed Instructions Guide */}
      <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', p: 3, borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'ClashDisplay-Medium' }}>
          <InfoOutlinedIcon sx={{ color: '#2AC318' }} /> How to Pay
        </Typography>
        <Stepper activeStep={-1} orientation="vertical" sx={{
          '& .MuiStepLabel-label': { color: '#fff', fontFamily: 'Satoshi-Bold' },
          '& .MuiStepLabel-label.Mui-active': { color: '#2AC318' },
          '& .MuiStepIcon-root': { color: '#333' },
          '& .MuiStepIcon-root.Mui-active': { color: '#2AC318' },
        }}>
          {paymentSteps.map((step, index) => (
            <Step key={index} active={true}>
              <StepLabel>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{step.label}</Typography>
                <Typography sx={{ color: '#7B7B7B', fontSize: '0.8rem' }}>{step.description}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

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
        Please send exactly <strong>{isFetchingRate ? '...' : cryptoAmount} {selectedNetwork.coin.split('/')[0]}</strong> to the <strong>{selectedNetwork.name} ({selectedNetwork.networkName})</strong> address below.
      </Alert>

      <Box sx={{ bgcolor: '#0C0C0C', p: 3, borderRadius: '0.75rem', border: '1px solid #333' }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#7B7B7B', fontSize: '0.8rem', mb: 0.5 }}>Amount to Send</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ color: '#2AC318', fontFamily: 'monospace', fontWeight: 'bold' }}>
              {isFetchingRate ? <CircularProgress size={20} /> : cryptoAmount} {selectedNetwork.coin.split('/')[0]}
            </Typography>
            <Button 
              size="small" 
              onClick={() => handleCopy(cryptoAmount)}
              sx={{ color: '#2AC318', minWidth: 'auto' }}
            >
              <ContentCopyIcon fontSize="small" />
            </Button>
          </Box>
          <Typography sx={{ color: '#7B7B7B', fontSize: '0.75rem' }}>
            Equivalent to {currency} {amount.toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', my: 2 }} />

        <Box>
          <Typography sx={{ color: '#7B7B7B', fontSize: '0.8rem', mb: 0.5 }}>
            {selectedNetwork.name} ({selectedNetwork.networkName}) Address
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all', flex: 1, fontSize: '0.9rem' }}>
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
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography sx={{ color: '#fff', mb: 1, fontSize: '0.9rem', fontFamily: 'Satoshi-Bold' }}>
            Paste Transaction ID (TXID)
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="e.g. 0x123... or b10..."
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
            }}
          />
          <Typography sx={{ color: '#7B7B7B', fontSize: '0.75rem', mt: 1 }}>
            Your transaction will be verified on the blockchain automatically. This may take a few minutes.
          </Typography>
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || isFetchingRate}
          sx={{
            bgcolor: '#2AC318',
            color: '#000',
            fontWeight: 'bold',
            py: 1.5,
            fontSize: '1rem',
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
