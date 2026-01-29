'use client';
import { Box, IconButton, Slider } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  onClose?: () => void;
}

export default function AudioPlayer({ audioUrl, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const seekTime = typeof newValue === 'number' ? newValue : newValue[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: { xs: '100%', md: '13rem' },
        margin: 0,
        borderRadius: '0.25rem',
        background: 'rgba(255, 255, 255, 0.10)',
      }}
    >
      <audio ref={audioRef} src={audioUrl} />
      <IconButton onClick={togglePlay} sx={{ color: '#fff' }}>
        <Image
          src={isPlaying ? '/assets/pause.svg' : '/assets/play.svg'}
          alt={isPlaying ? 'pause' : 'play'}
          width={24}
          height={24}
        />
      </IconButton>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#fff', fontSize: '0.75rem' }}>{formatTime(currentTime)}</span>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          sx={{
            color: '#2AC318',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: 'none',
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.5,
            },
          }}
        />
        <span style={{ color: '#fff', fontSize: '0.75rem' }}>{formatTime(duration)}</span>
      </Box>
      {onClose && (
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <Image src="/assets/close.svg" alt="close" width={16} height={16} />
        </IconButton>
      )}
    </Box>
  );
}
