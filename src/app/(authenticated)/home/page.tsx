'use client';

import LandingPage from '@/components/protected/home/landing';
import HowToPlayModal from '@/components/ui/how-to-play-modal';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [openHowToPlay, setOpenHowToPlay] = useState(false);

  useEffect(() => {
    setOpenHowToPlay(true);
  }, []);

  return (
    <>
      <HowToPlayModal open={openHowToPlay} onClose={() => setOpenHowToPlay(false)} />
      <LandingPage />
    </>
  );
}