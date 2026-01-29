'use client';
import QueryProvider from '@/providers/QueryProvider';
import ThemeRegistry from '@/providers/ThemeRegistry';
import { SnackbarProvider } from 'notistack';
import { CartProvider } from '@/providers/CartProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ThemeRegistry>
        <QueryProvider>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            preventDuplicate
          >
            <CartProvider>{children}</CartProvider>
          </SnackbarProvider>
        </QueryProvider>
      </ThemeRegistry>
    </GoogleOAuthProvider>
  );
}
