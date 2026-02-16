'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  progress: number;
  duration: number;
  seek: (value: number) => void;
  isPlayerOpen: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
  playbackError: string | null;
  isBuffering: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getReadablePlaybackError = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    try {
      return JSON.stringify(err);
    } catch {
      return 'Unknown playback error';
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      const code = audio.error?.code;
      setPlaybackError(
        code
          ? `Unable to play this track (error code: ${code}). Please try again.`
          : 'Unable to play this track. Please try again.'
      );
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  const openPlayer = () => setIsPlayerOpen(true);
  const closePlayer = () => setIsPlayerOpen(false);

  const playTrack = (track: Track) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id) {
        setPlaybackError(null);
        setIsPlayerOpen(true);
        togglePlay();
      } else {
        setPlaybackError(null);
        setIsBuffering(true);
        audioRef.current.src = track.audioUrl;
        setCurrentTrack(track);
        setIsPlayerOpen(true);

        const playPromise = audioRef.current.play();
        if (playPromise && typeof (playPromise as Promise<void>).then === 'function') {
          (playPromise as Promise<void>)
            .then(() => {
              setIsBuffering(false);
              setIsPlaying(true);
            })
            .catch((err) => {
              setIsBuffering(false);
              setIsPlaying(false);
              setPlaybackError(getReadablePlaybackError(err));
            });
        } else {
          setIsBuffering(false);
          setIsPlaying(true);
        }
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsBuffering(false);
      } else {
        setPlaybackError(null);
        setIsBuffering(true);
        const playPromise = audioRef.current.play();
        if (playPromise && typeof (playPromise as Promise<void>).then === 'function') {
          (playPromise as Promise<void>)
            .then(() => {
              setIsBuffering(false);
              setIsPlaying(true);
            })
            .catch((err) => {
              setIsBuffering(false);
              setIsPlaying(false);
              setPlaybackError(getReadablePlaybackError(err));
            });
        } else {
          setIsBuffering(false);
          setIsPlaying(true);
        }
      }
    }
  };

  const seek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        progress,
        duration,
        seek,
        isPlayerOpen,
        openPlayer,
        closePlayer,
        playbackError,
        isBuffering,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
