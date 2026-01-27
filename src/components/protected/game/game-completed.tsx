'use client';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import Image from 'next/image';
import lockIcon from '../../../../public/assets/lock.svg';

interface GameCompletedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GameCompletedModal({ open, onClose }: GameCompletedModalProps) {
  const { push } = useRouter();

  const handleClaimItems = () => {
    push(ROUTES.GAME.CLUES);
  };

  const earnedItems = [
    {
      icon: '♪',
      text: 'Hidden Track: "Return of the Gods (Unreleased)"',
    },
    {
      icon: '👕',
      text: '30% Discount: DuGod Shop',
    },
    {
      icon: '🖼️',
      text: 'NFT Art Print: "Ebube Visual"',
    },
    {
      icon: '🎟️',
      text: 'Exclusive Invite: Lagos Listening Room',
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="game-completed-modal-title"
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
          maxWidth: { sm: '90%', xs: '100%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxHeight: '40rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            lineHeight: '120%',
            zIndex: 2,
          }}
        >
          Here&apos;s what you&apos;ve earned:
        </Typography>

        <Box
          sx={{
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            zIndex: 2,
          }}
        >
          {earnedItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: index < earnedItems.length - 1 ? '1rem' : 0,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </Typography>
              <Typography
                sx={{
                  color: '#FFF',
                  fontFamily: 'ClashDisplay-Medium',
                  fontSize: '1rem',
                  lineHeight: '120%',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          onClick={handleClaimItems}
          startIcon={<Image src={lockIcon} alt="lock" width={20} height={20} />}
          sx={{
            display: 'flex',
            padding: '0.75rem 3rem',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.625rem',
            borderRadius: '0.5rem',
            background: '#2AC318',
            boxShadow: '0 8px 35.5px 0 rgba(42, 195, 24, 0.32)',
            zIndex: 2,
            '&:hover': {
              backgroundColor: '#229A14',
            },
          }}
        >
          <Typography
            sx={{
              color: '#0C0C0C',
              textAlign: 'center',
              fontFamily: 'manrope',
              fontSize: '1.125rem',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '120%',
            }}
          >
            Claim My Items
          </Typography>
        </Button>

        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1,
            bottom: '-19rem',
            left: 0,
          }}
        >
          <Image
            src="/assets/clueBox.svg"
            alt="Mystery Box"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
