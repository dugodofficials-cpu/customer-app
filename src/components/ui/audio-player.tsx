'use client';
import { Box, IconButton, Slider } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  onClose?: () => void;
  previewDurationSeconds?: number;
}

export default function AudioPlayer({ audioUrl, onClose, previewDurationSeconds }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewStopTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      const rawDuration = audio.duration || 0;
      
      if (previewDurationSeconds && rawDuration > previewDurationSeconds) {
        // Start from middle of the song if it's a preview
        const startTime = Math.max(0, (rawDuration / 2) - (previewDurationSeconds / 2));
        audio.currentTime = startTime;
        setCurrentTime(0); // Reset display time to 0 relative to start
        setDuration(previewDurationSeconds);
      } else {
        setDuration(rawDuration);
      }
      setIsReady(true);
    };

    const onTimeUpdate = () => {
      const rawDuration = audio.duration || 0;
      const t = audio.currentTime || 0;
      
      if (previewDurationSeconds && rawDuration > previewDurationSeconds) {
        const startTime = Math.max(0, (rawDuration / 2) - (previewDurationSeconds / 2));
        const relativeTime = t - startTime;
        
        setCurrentTime(Math.max(0, relativeTime));

        if (relativeTime >= previewDurationSeconds) {
          audio.pause();
          audio.currentTime = startTime;
          setIsPlaying(false);
          setCurrentTime(0);
        }
      } else {
        setCurrentTime(t);
        if (previewDurationSeconds && t >= previewDurationSeconds) {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      if (previewStopTimeoutRef.current) {
        window.clearTimeout(previewStopTimeoutRef.current);
        previewStopTimeoutRef.current = null;
      }
      audio.pause();
      audio.currentTime = 0;
    };
  }, [previewDurationSeconds]);

  useEffect(() => {
    return () => {
      if (previewStopTimeoutRef.current) {
        window.clearTimeout(previewStopTimeoutRef.current);
        previewStopTimeoutRef.current = null;
      }
    };
  }, []);

  const schedulePreviewStop = () => {
    if (!previewDurationSeconds) return;
    if (previewStopTimeoutRef.current) {
      window.clearTimeout(previewStopTimeoutRef.current);
      previewStopTimeoutRef.current = null;
    }
    const audio = audioRef.current;
    if (!audio) return;

    const rawDuration = audio.duration || 0;
    let remainingSeconds = 0;

    if (rawDuration > previewDurationSeconds) {
      const startTime = Math.max(0, (rawDuration / 2) - (previewDurationSeconds / 2));
      const relativeTime = audio.currentTime - startTime;
      remainingSeconds = Math.max(0, previewDurationSeconds - relativeTime);
    } else {
      remainingSeconds = Math.max(0, previewDurationSeconds - audio.currentTime);
    }

    previewStopTimeoutRef.current = window.setTimeout(() => {
      const a = audioRef.current;
      if (!a) return;
      a.pause();
      
      if (rawDuration > previewDurationSeconds) {
        a.currentTime = Math.max(0, (rawDuration / 2) - (previewDurationSeconds / 2));
      } else {
        a.currentTime = 0;
      }
      
      setIsPlaying(false);
      setCurrentTime(0);
    }, remainingSeconds * 1000);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (previewStopTimeoutRef.current) {
          window.clearTimeout(previewStopTimeoutRef.current);
          previewStopTimeoutRef.current = null;
        }
      } else {
        audioRef.current.play();
        schedulePreviewStop();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const seekValue = typeof newValue === 'number' ? newValue : newValue[0];
    if (audioRef.current) {
      const rawDuration = audioRef.current.duration || 0;
      
      if (previewDurationSeconds && rawDuration > previewDurationSeconds) {
        const startTime = Math.max(0, (rawDuration / 2) - (previewDurationSeconds / 2));
        const clampedSeek = Math.min(seekValue, previewDurationSeconds);
        audioRef.current.currentTime = startTime + clampedSeek;
        setCurrentTime(clampedSeek);
      } else {
        const clampedSeek = previewDurationSeconds
          ? Math.min(seekValue, previewDurationSeconds)
          : seekValue;
        audioRef.current.currentTime = clampedSeek;
        setCurrentTime(clampedSeek);
      }
      schedulePreviewStop();
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
