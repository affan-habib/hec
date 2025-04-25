'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiBook, FiMessageSquare, FiAward, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      href: '/student',
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      name: 'My Diaries',
      href: '/student/diaries',
      icon: <FiBook className="w-5 h-5" />,
    },
    {
      name: 'Chat',
      href: '/student/chat',
      icon: <FiMessageSquare className="w-5 h-5" />,
    },
    {
      name: 'Awards',
      href: '/student/awards',
      icon: <FiAward className="w-5 h-5" />,
    },
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('token');
    // Redirect to login page
    router.push('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:block transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            {isSidebarOpen ? (
              <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                Hello English
              </h1>
            ) : (
              <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">HE</h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
              >
                <div className="mr-3 flex-shrink-0">{item.icon}</div>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <FiLogOut className="mr-3 w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gray-600 bg-opacity-75"
                  onClick={toggleMobileMenu}
                />

                {/* Mobile menu content */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      onClick={toggleMobileMenu}
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <FiX className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                      Hello English
                    </h1>
                  </div>

                  <div className="flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 py-4 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`${
                            pathname === item.href
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                          } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                        >
                          <div className="mr-4 flex-shrink-0">{item.icon}</div>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <FiLogOut className="mr-4 w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Open sidebar</span>
                  <FiMenu className="block h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 md:hidden">
                    Hello English
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="hidden md:inline-flex text-sm text-gray-500 dark:text-gray-400 mr-2">
                      Student Portal
                    </span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
