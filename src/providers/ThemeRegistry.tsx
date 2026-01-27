'use client';
import * as React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './emotionCache';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-satoshi)',
    h1: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'var(--font-satoshi)',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#2AC318',
      light: '#FFE836',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'satoshi';
          src: url('/fonts/Satoshi-Regular.woff2') format('woff2'),
               url('/fonts/Satoshi-Regular.woff') format('woff'),
               url('/fonts/Satoshi-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'satoshi-medium';
          src: url('/fonts/Satoshi-Medium.woff2') format('woff2'),
               url('/fonts/Satoshi-Medium.woff') format('woff'),
               url('/fonts/Satoshi-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'satoshi-bold';
          src: url('/fonts/Satoshi-Bold.woff2') format('woff2'),
               url('/fonts/Satoshi-Bold.woff') format('woff'),
               url('/fonts/Satoshi-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
      `,
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          fontFamily: 'var(--font-satoshi)',
        },
        notchedOutline: {
          borderRadius: '0.375rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-satoshi)',
          fontWeight: 700,
          textTransform: 'none',
        },
      },
    },
  },
});

const clientSideEmotionCache = createEmotionCache();

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
