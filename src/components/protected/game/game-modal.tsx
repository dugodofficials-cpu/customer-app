'use client';
import { Box, Button, Modal, Typography } from '@mui/material';
import Image from 'next/image';

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  keysHeld: number;
  keysNeeded: number;
  onOpenChallenge: () => void;
}

export default function GameModal({
  open,
  onClose,
  keysHeld,
  keysNeeded,
  onOpenChallenge,
}: GameModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="game-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#0B0909',
          borderRadius: '2rem',
          padding: { xs: '2rem', sm: '3rem' },
          maxWidth: { md: '50rem', sm: '80%', xs: '100%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
        }}
      >
        <Box>
          <Image
            src="/assets/box.gif"
            alt="Black Box"
            width={100}
            height={100}
            style={{
              width: '21rem',
              height: '21rem',
            }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            lineHeight: '120%',
          }}
        >
          🛑 Not enough keys to open the BlackBox.
        </Typography>

        <Typography
          sx={{
            color: '#FFD700',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            lineHeight: '120%',
          }}
        >
          You have {keysHeld} keys
        </Typography>

        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Medium',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: '120%',
          }}
        >
          You need {keysNeeded} keys
        </Typography>

        <Button
          onClick={onOpenChallenge}
          sx={{
            borderRadius: '0.25rem',
            background: '#0B6201',
            padding: '0.75rem 3rem',
            boxShadow: '0px 4px 24px 0px rgba(42, 195, 24, 0.32)',
            '&:hover': {
              backgroundColor: '#229A14',
            },
          }}
        >
          <Typography
            sx={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'Manrope',
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '120%',
            }}
          >
            🔍 Search for More Clues
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
}
