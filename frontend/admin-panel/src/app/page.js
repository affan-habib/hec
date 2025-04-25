'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiBook, FiMessageSquare, FiAward } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Features of the admin panel
  const features = [
    {
      icon: <FiUsers className="h-6 w-6 text-hanbok-blue" />,
      title: 'User Management',
      description: 'Manage students and tutors with ease. View profiles, edit details, and monitor activity.'
    },
    {
      icon: <FiBook className="h-6 w-6 text-dancheong-green" />,
      title: 'Content Management',
      description: 'Create and organize learning materials, lessons, and resources for students.'
    },
    {
      icon: <FiMessageSquare className="h-6 w-6 text-dancheong-blue" />,
      title: 'Communication Tools',
      description: 'Monitor chats between tutors and students. Ensure quality interactions.'
    },
    {
      icon: <FiAward className="h-6 w-6 text-dancheong-yellow" />,
      title: 'Progress Tracking',
      description: 'Track student progress, achievements, and award badges for accomplishments.'
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block">Hello English</span>
                  <span className="block text-hanbok-blue">Admin Panel</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Manage your English coaching platform with our powerful admin tools. Monitor students, tutors, and content all in one place.
                </motion.p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {loading ? (
                    <div className="w-8 h-8 border-4 border-hanbok-blue border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isAuthenticated ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <Link
                            href="/dashboard"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-hanbok-blue hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                          >
                            Go to Dashboard
                            <FiArrowRight className="ml-2" />
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <Link
                            href="/auth/login"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-hanbok-blue hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                          >
                            Sign In
                            <FiArrowRight className="ml-2" />
                          </Link>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-hanbok-blue font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage your platform
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Our admin panel provides powerful tools to help you manage your English coaching business efficiently.
            </p>
          </div>

          <motion.div
            className="mt-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <motion.div key={index} className="relative" variants={item}>
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700 text-white">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Hello English Coaching. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
