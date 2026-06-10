import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { satoshi } from './fonts';
import { META_PIXEL_BASE_CODE, META_PIXEL_ID } from './meta-pixel';

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_BASE_CODE }} />
      </head>
      <body className={satoshi.className}>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
