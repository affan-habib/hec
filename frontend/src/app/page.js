import React from 'react';
import Link from 'next/link';import Image from 'next/image';
export default function LandingPage() {  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 flex flex-col items-center justify-center text-gray-800 font-sans">      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-purple-700">환영합니다 (Welcome)!</h1>
        <p className="text-xl text-purple-600">To Your Korean Language Learning Journey</p>      </header>
      <main className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">        <div className="w-64 h-64 relative">
          <Image            src="/korean-lantern.png"
            alt="Korean Lantern"            layout="fill"
            objectFit="contain"
          />        </div>
        <div className="text-center md:text-left">          <h2 className="text-3xl font-semibold mb-4 text-purple-600">Start Your Adventure</h2>
          <p className="mb-6 text-lg">Immerse yourself in the beauty of the Korean language and culture.</p>
          <div className="space-x-4">            <Link href="/auth/login" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">              Login
            </Link>            <Link href="/auth/register" className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition duration-300">
              Register            </Link>
          </div>
        </div>      </main>
      <footer className="mt-16 text-center">        <p className="text-sm text-purple-700">© 2023 Korean Language Learning. All rights reserved.</p>
      </footer>    </div>
  );
}




















