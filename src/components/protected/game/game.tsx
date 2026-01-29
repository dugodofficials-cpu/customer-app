'use client';
import { Box, Button, Typography } from '@mui/material';
import Footer from '../../layout/footer';
import { ROUTES } from '@/util/paths';
import { useRouter } from 'next/navigation';
import GameModal from './game-modal';
import { useState } from 'react';
import { useAnswerBlackboxQuestion, useUserBlackboxProgress } from '@/hooks/blackbox';
import ChallengeModal from './challenge-modal';
import GameCompletedModal from './game-completed';

export default function GamePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<'game' | 'challenge' | 'none' | 'completed'>(
    'none'
  );
  const { data: blackboxProgress } = useUserBlackboxProgress();
  const answerBlackboxQuestion = useAnswerBlackboxQuestion();

  const keysHeld = blackboxProgress?.data.answeredCount || 0;
  const keysNeeded = blackboxProgress?.data.remainingCount || 0;

  const handleOpenBox = () => {
    setIsModalOpen(keysNeeded === 0 ? 'completed' : 'game');
  };

  const handleCloseModal = () => {
    setIsModalOpen('none');
  };

  const handleOpenChallenge = () => {
    setIsModalOpen('challenge');
  };

  const handleSubmitAnswer = (answer: string) => {
    answerBlackboxQuestion.mutate({
      questionId: blackboxProgress?.data.nextQuestion?._id || '',
      answer,
    });
  };

  return (
    <Box
      sx={{
        padding: { xs: '1rem', sm: 0 },
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          borderRadius: '0.75rem',
          display: 'flex',
          position: 'relative',
          padding: {
            xs: '2rem 0rem',
            sm: '4rem 2.5rem',
            md: '7.5rem 5rem',
          },
          margin: '0 auto',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto',
          width: {
            xs: '100%',
            sm: '90%',
            md: '80%',
          },
          maxWidth: '63.75rem',
          gap: '3.75rem',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'ClashDisplay-Bold',
            color: '#FFF',
            textAlign: 'center',
            fontSize: { sm: '3.0625rem', xs: '1.9rem' },
            fontWeight: 700,
            lineHeight: '120%',
          }}
        >
          🎮 The BlackBox Game
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Medium',
            fontSize: '1.5625rem',
            fontWeight: 400,
            lineHeight: '120%',
          }}
        >
          Every track. Every tag. Every visual. A puzzle lies within.
          <br />
          Collect clues. Unlock keys. Open the box.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mx: 'auto',
            width: '100%',
            padding: {
              sm: '0',
            },
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => router.push(ROUTES.GAME.RULES)}
            sx={{
              display: 'flex',
              width: { sm: '25rem', xs: '100%' },
              height: '2.6875rem',
              padding: { sm: '0.1875rem 7.3125rem', xs: '0.1875rem 1rem' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.625rem',
              flexShrink: 0,
              borderRadius: '0.5rem',
              backgroundColor: '#2AC318',
            }}
          >
            <Typography
              sx={{
                color: '#0C0C0C',
                fontFamily: 'space-grotesk',
                fontSize: { sm: '1rem', xs: '0.875rem' },
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
              }}
            >
              📜 View Game Rules
            </Typography>
          </Button>
          <Button
            onClick={handleOpenBox}
            sx={{
              display: 'flex',
              width: { sm: '25rem', xs: '100%' },
              height: '2.6875rem',
              paddingBlock: '0.1875rem',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.625rem',
              flexShrink: 0,
              borderRadius: '0.5rem',
              backgroundColor: '#1A1A1A',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontFamily: 'space-grotesk',
                fontSize: { sm: '1rem', xs: '0.875rem' },
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
              }}
            >
              🔓 Try to Open the Box
            </Typography>
          </Button>
          <Button
            onClick={() => router.push(ROUTES.GAME.CLUES)}
            sx={{
              display: 'flex',
              width: { sm: '25rem', xs: '100%' },
              height: '2.6875rem',
              paddingBlock: '0.1875rem',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.625rem',
              flexShrink: 0,
              borderRadius: '0.5rem',
              backgroundColor: '#1A1A1A',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontFamily: 'space-grotesk',
                fontSize: { sm: '1rem', xs: '0.875rem' },
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
              }}
            >
              🧩 View Your Clues
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: { xs: '2rem' },
        }}
      >
        <Footer />
      </Box>

      <GameModal
        open={isModalOpen === 'game'}
        onClose={handleCloseModal}
        keysHeld={keysHeld}
        keysNeeded={keysNeeded}
        onOpenChallenge={handleOpenChallenge}
      />

      <ChallengeModal
        open={isModalOpen === 'challenge'}
        onClose={() => setIsModalOpen('none')}
        question={blackboxProgress?.data.nextQuestion?.question || ''}
        onSubmitAnswer={handleSubmitAnswer}
      />

      <GameCompletedModal
        open={isModalOpen === 'completed'}
        onClose={() => setIsModalOpen('none')}
      />
    </Box>
  );
}
