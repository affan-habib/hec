'use client';

import Header from './components/Header';
import Footer from './components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950">
      <Header />

      {/* Main content */}
      <main className="flex-grow pt-24 sm:pt-28">
        {children}
      </main>

      <Footer />
    </div>
  );
}
