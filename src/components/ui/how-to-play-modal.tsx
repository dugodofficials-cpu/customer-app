'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Zoom,
} from '@mui/material';
import { X, PlayCircle, BookOpen, ShoppingCart, User, Download } from 'lucide-react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ open, onClose }) => {
  const theme = useTheme();

  const steps = [
    {
      text: 'Open the Games tab.',
      icon: <PlayCircle size={24} color={theme.palette.primary.main} />,
    },
    {
      text: 'Tap View Game Rules and read carefully.',
      icon: <BookOpen size={24} color={theme.palette.primary.main} />,
    },
    {
      text: 'Select Buy Game Ticket and complete purchase.',
      icon: <ShoppingCart size={24} color={theme.palette.primary.main} />,
    },
    {
      text: 'Go to your Profile icon → My Purchases → Digital.',
      icon: <User size={24} color={theme.palette.primary.main} />,
    },
    {
      text: 'Download your ticket to unlock the game.',
      icon: <Download size={24} color={theme.palette.primary.main} />,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: '#121212',
          backgroundImage: 'linear-gradient(to bottom right, rgba(47, 214, 93, 0.1), rgba(0, 0, 0, 0))',
          border: '1px solid rgba(47, 214, 93, 0.2)',
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgcolor: 'primary.main',
        }}
      />
      
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.16)',
          },
          zIndex: 1,
        }}
      >
        <X size={20} />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, sm: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'ClashDisplay-Semibold',
              color: 'white',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 1,
            }}
          >
            How to Play
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500', fontFamily: 'satoshi-medium' }}>
            Follow these steps to unlock the field
          </Typography>
        </Box>

        <List sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
                py: 2,
                borderBottom: index !== steps.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'rgba(47, 214, 93, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={step.text}
                primaryTypographyProps={{
                  sx: {
                    color: 'grey.300',
                    fontFamily: 'satoshi-bold',
                    fontSize: '1rem',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{
            py: 1.5,
            borderRadius: '12px',
            fontFamily: 'ClashDisplay-Semibold',
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 8px 16px rgba(47, 214, 93, 0.2)',
            '&:hover': {
              boxShadow: '0 12px 20px rgba(47, 214, 93, 0.3)',
            },
          }}
        >
          Got it, let&apos;s go!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;
