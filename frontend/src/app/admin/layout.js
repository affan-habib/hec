'use client';

import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Hello English Coaching - Admin Panel</title>
        <meta name="description" content="Admin panel for Hello English Coaching" />
      </head>
      <MainLayout>{children}</MainLayout>
    </html>
  );
}
