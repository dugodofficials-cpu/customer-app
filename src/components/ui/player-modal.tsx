'use client';

import React from 'react';
import { Box, IconButton, Modal, Slider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Image from 'next/image';
import { usePlayer } from '@/context/player-context';

function formatTime(time: number) {
  if (!Number.isFinite(time) || time < 0) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerModal() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    progress,
    duration,
    seek,
    isPlayerOpen,
    closePlayer,
    playbackError,
    isBuffering,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <Modal
      open={isPlayerOpen}
      onClose={closePlayer}
      aria-labelledby="dugod-player-title"
      aria-describedby="dugod-player-description"
      sx={{ zIndex: 1400 }}
    >
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(80% 60% at 50% 0%, rgba(42, 195, 24, 0.18) 0%, rgba(0,0,0,0) 60%), rgba(0,0,0,0.9)',
          backdropFilter: 'blur(12px)',
          p: { xs: 2, md: 4 },
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 980,
            borderRadius: { xs: '1rem', md: '1.5rem' },
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
              <Image src="/assets/logo.svg" alt="DuGod" width={28} height={28} />
              <Typography
                id="dugod-player-title"
                noWrap
                sx={{
                  color: '#fff',
                  fontFamily: 'ClashDisplay-Bold',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  letterSpacing: '0.02em',
                }}
              >
                GODMUZIK PLAYER
              </Typography>
            </Box>

            <IconButton
              onClick={closePlayer}
              sx={{
                color: '#000',
                backgroundColor: '#fff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.85)' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '420px 1fr' },
              gap: { xs: 2, md: 3 },
              p: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: { xs: '1rem', md: '1.25rem' },
                overflow: 'hidden',
                border: '1px solid rgba(42, 195, 24, 0.35)',
                backgroundColor: '#0B0B0B',
                aspectRatio: '1 / 1',
              }}
            >
              <Image
                src={currentTrack.image || '/assets/album1.png'}
                alt={currentTrack.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.70) 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  bottom: 16,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      color: '#fff',
                      fontFamily: 'ClashDisplay-SemiBold',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    {currentTrack.title}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'Manrope',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {currentTrack.artist}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '999px',
                    backgroundColor: isBuffering ? '#FFD700' : '#2AC318',
                    boxShadow: isBuffering
                      ? '0 0 0 6px rgba(255,215,0,0.16)'
                      : '0 0 0 6px rgba(42,195,24,0.16)',
                    flexShrink: 0,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: { xs: 2, md: 3 },
                minWidth: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IconButton
                  onClick={togglePlay}
                  sx={{
                    bgcolor: '#2AC318',
                    color: '#0C0C0C',
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    '&:hover': { bgcolor: '#24a915' },
                  }}
                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
              </Box>

              <Box sx={{ px: { xs: 0.5, md: 1 } }}>
                <Slider
                  value={progress}
                  max={duration || 0}
                  onChange={(_, val) => seek(val as number)}
                  sx={{
                    color: '#2AC318',
                    '& .MuiSlider-thumb': {
                      width: 14,
                      height: 14,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0px 0px 0px 8px rgba(42, 195, 24, 0.16)',
                      },
                    },
                    '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: '#fff' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope', fontSize: '0.85rem' }}>
                    {formatTime(progress)}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope', fontSize: '0.85rem' }}>
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>

              {playbackError ? (
                <Box
                  sx={{
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 77, 77, 0.35)',
                    backgroundColor: 'rgba(255, 77, 77, 0.08)',
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography
                    id="dugod-player-description"
                    sx={{ color: '#fff', fontFamily: 'Manrope', fontSize: '0.95rem' }}
                  >
                    {playbackError}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'Manrope', fontSize: '0.95rem' }}>
                    Your purchase is secured. Stream here, download in your library.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
