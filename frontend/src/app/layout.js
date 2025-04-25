'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Hello English Coaching - Admin Panel</title>
        <meta name="description" content="Admin panel for Hello English Coaching" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
