import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { satoshi } from './fonts';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'DuGod',
  description: 'DuGod Entertainment',
  icons: {
    icon: '/favicon.ico',
  },
};

export const generateThemeColor = () => ({
  color: '#2AC318',
  media: '(prefers-color-scheme: light)',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className={satoshi.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
