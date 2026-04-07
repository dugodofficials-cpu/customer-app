import Script from 'next/script';
import { META_PIXEL_BOOTSTRAP_SCRIPT, META_PIXEL_ID } from './meta-pixel';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script id="meta-pixel-base" strategy="beforeInteractive">
        {META_PIXEL_BOOTSTRAP_SCRIPT}
      </Script>
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
      {children}
    </>
  );
}
