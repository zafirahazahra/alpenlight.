import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/lib/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AlpenLight — Sistem Smart Lighting Kantor Alpen',
  description:
    'Simulasi Smart Lighting untuk membantu mengurangi pemborosan listrik akibat lampu kantor yang tetap menyala saat ruangan kosong.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
