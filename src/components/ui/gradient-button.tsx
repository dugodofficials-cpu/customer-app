'use client';
import { Button, ButtonProps, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledButton = styled(Button)<ButtonProps>(() => ({
  bgcolor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  py: 2,
  borderRadius: '0.375rem',
  position: 'relative',
  paddingBlock: '.75rem',
  overflow: 'hidden',
  border: 'none',
  isolation: 'isolate',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    background: 'linear-gradient(45deg, #3F3C3C, #23BD0F)',
    backgroundSize: '200% 200%',
    zIndex: -2,
    borderRadius: '0.5rem',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '1px',
    background: '#000',
    borderRadius: '0.375rem',
    zIndex: -1,
  },
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.15)',
    '&::before': {
      animation: `${shimmer} 3s linear infinite`,
      animationDuration: '1.5s',
      animationDirection: 'alternate',
    },
  },
}));

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function GradientButton({ children, ...props }: GradientButtonProps) {
  return (
    <StyledButton variant="contained" fullWidth {...props}>
      {children}
    </StyledButton>
  );
} 