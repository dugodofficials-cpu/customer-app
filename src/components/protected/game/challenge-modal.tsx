'use client';
import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnswerQuestionResponse } from '@/lib/api/blackbox';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';

interface ChallengeModalProps {
  open: boolean;
  onClose: () => void;
  question: string;
  onSubmitAnswer?: (answer: string) => void;
}

export default function ChallengeModal({
  open,
  onClose,
  question,
  onSubmitAnswer,
}: ChallengeModalProps) {
  const [answer, setAnswer] = useState('');
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<AnswerQuestionResponse>(['blackbox-answer']);
  const handleSubmit = () => {
    if (onSubmitAnswer && answer.trim() && !!question) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    } else {
      push(ROUTES.GAME.CLUES);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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
          🧩 Hidden Clue Unlocked!
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
          Solve the riddle to unlock the next clue.
        </Typography>

        {!!question && (
          <Typography
            sx={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'ClashDisplay-Medium',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: '120%',
            }}
          >
            {question}
          </Typography>
        )}

        <TextField
          fullWidth
          placeholder="Enter your answer here..."
          value={answer}
          disabled={!question}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#FFF',
              fontFamily: 'ClashDisplay-Medium',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              '& fieldset': {
                borderColor: 'rgba(255, 215, 0, 0.3)',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 215, 0, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFD700',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          }}
        />
        {data?.isCorrect && (
          <Alert severity="success" sx={{ width: '100%' }}>
            {data.secret}
          </Alert>
        )}
        {data && !data.isCorrect && (
          <Alert severity="error" sx={{ width: '100%' }}>
            The answer is incorrect. Try again.
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() && !!question}
          fullWidth={!question}
          sx={{
            borderRadius: '0.25rem',
            background: !question ? '#FFD700' : answer.trim() ? '#0B6201' : 'rgba(11, 98, 1, 0.5)',
            padding: '0.75rem 3rem',
            boxShadow: answer.trim() ? '0px 4px 24px 0px rgba(42, 195, 24, 0.32)' : 'none',
            '&:hover': {
              backgroundColor: !question
                ? '#FFD700'
                : answer.trim()
                  ? '#229A14'
                  : 'rgba(11, 98, 1, 0.5)',
            },
            '&:disabled': {
              background: 'rgba(11, 98, 1, 0.5)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          <Typography
            sx={{
              color: !question ? '#0C0C0C' : '#FFF',
              textAlign: 'center',
              fontFamily: 'Manrope',
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '120%',
            }}
          >
            {question ? 'Submit Answer' : 'Congrats you’ve opened the Black Box!'}
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
}
