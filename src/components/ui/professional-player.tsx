'use client';

import React from 'react';
import { Box, Typography, IconButton, Slider, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { usePlayer } from '@/context/player-context';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';

export default function ProfessionalPlayer() {
  const { currentTrack, isPlaying, togglePlay, progress, duration, seek } = usePlayer();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        p: { xs: 1.5, md: 2 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(15, 15, 15, 0.85)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: { xs: 2, md: 4 },
          py: 2,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Track Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: { xs: 48, md: 64 },
                height: { xs: 48, md: 64 },
                position: 'relative',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <Image
                src={currentTrack.image}
                alt={currentTrack.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  color: '#fff',
                  fontFamily: 'ClashDisplay-SemiBold',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                }}
              >
                {currentTrack.title}
              </Typography>
              <Typography
                noWrap
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'Manrope',
                  fontSize: '0.8rem',
                }}
              >
                {currentTrack.artist}
              </Typography>
            </Box>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={togglePlay}
              sx={{
                bgcolor: '#2AC318',
                color: '#000',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': { bgcolor: '#24a915' },
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>

          {/* Time Info (Desktop) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', width: 40 }}>
                {formatTime(progress)}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>/</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', width: 40 }}>
                {formatTime(duration)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Progress Slider */}
        <Box sx={{ width: '100%', px: 1 }}>
          <Slider
            size="small"
            value={progress}
            max={duration}
            onChange={(_, val) => seek(val as number)}
            sx={{
              color: '#2AC318',
              height: 4,
              padding: '13px 0',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&::before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(42, 195, 24, 0.16)',
                },
                '&.Mui-active': {
                  width: 16,
                  height: 16,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.2,
                backgroundColor: '#fff',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
