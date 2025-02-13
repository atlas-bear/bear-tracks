import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bear Tracks',
  description: 'Privacy-focused web analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        {children}
        <Script 
          src="/api/script"
          strategy="afterInteractive"
          id="bear-tracks"
        />
      </body>
    </html>
  );
}