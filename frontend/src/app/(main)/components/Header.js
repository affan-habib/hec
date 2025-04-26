'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiBook, FiMessageSquare, FiAward } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const submenuRefs = useRef({});
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  // Handle submenu toggle
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/auth/login';

    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      case 'student':
        return '/student';
      default:
        return '/auth/login';
    }
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeSubmenu && submenuRefs.current[activeSubmenu] &&
          !submenuRefs.current[activeSubmenu].contains(event.target)) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSubmenu]);

  // Navigation items with submenus
  const navItems = [
    {
      name: 'Home',
      href: '/main',
    },
    {
      name: 'Features',
      submenu: [
        { name: 'Diary Writing', href: '/main/features/diary' },
        { name: 'Tutor Chat', href: '/main/features/chat' },
        { name: 'Awards System', href: '/main/features/awards' },
      ],
    },
    {
      name: 'Resources',
      submenu: [
        { name: 'Learning Materials', href: '/main/resources/materials' },
        { name: 'Practice Exercises', href: '/main/resources/exercises' },
        { name: 'Language Tips', href: '/main/resources/tips' },
      ],
    },
    {
      name: 'About',
      href: '/main/about',
    },
    {
      name: 'Contact',
      href: '/main/contact',
    },
  ];

  // Header animation variants
  const headerVariants = {
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      height: '70px',
      backdropFilter: 'blur(10px)',
    },
    top: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      height: '90px',
      backdropFilter: 'blur(0px)',
    },
  };

  // Submenu animation variants
  const submenuVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  return (
    <>
      {/* Header */}
      <motion.header
        className="fixed w-full z-50 transition-all duration-300 p-4"
        initial="top"
        animate={isScrolled ? 'scrolled' : 'top'}
        variants={headerVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/main" className="flex items-center">
              <motion.div
                className="text-2xl font-bold text-purple-700 dark:text-purple-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-pink-600 dark:text-pink-400">안녕</span> English
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative" ref={el => submenuRefs.current[item.name] = el}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 ${
                          activeSubmenu === item.name ? 'text-purple-600 dark:text-purple-400' : ''
                        }`}
                      >
                        {item.name}
                        <motion.span
                          animate={{ rotate: activeSubmenu === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-1"
                        >
                          <FiChevronDown />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {activeSubmenu === item.name && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={submenuVariants}
                            className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-20 border border-gray-200 dark:border-gray-700"
                          >
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 ${
                        pathname === item.href ? 'text-purple-600 dark:text-purple-400' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Auth Buttons or Profile Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative" ref={el => submenuRefs.current['profile'] = el}>
                  <button
                    onClick={() => toggleSubmenu('profile')}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <span>{user?.first_name || 'User'}</span>
                    <motion.span
                      animate={{ rotate: activeSubmenu === 'profile' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiChevronDown />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {activeSubmenu === 'profile' && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={submenuVariants}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-20 border border-gray-200 dark:border-gray-700"
                      >
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          <FiUser className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                        {user?.role === 'student' && (
                          <>
                            <Link
                              href="/student/diaries"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                            >
                              <FiBook className="mr-2 h-4 w-4" />
                              My Diaries
                            </Link>
                            <Link
                              href="/student/chats"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                            >
                              <FiMessageSquare className="mr-2 h-4 w-4" />
                              Chat with Tutor
                            </Link>
                            <Link
                              href="/student/awards"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                            >
                              <FiAward className="mr-2 h-4 w-4" />
                              My Awards
                            </Link>
                          </>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          <FiSettings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:from-purple-700 hover:to-pink-600 transition-colors duration-200"
                    >
                      Register
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:outline-none"
              >
                <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  <span className="text-pink-600 dark:text-pink-400">안녕</span> English
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:outline-none"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4">
                {navItems.map((item) => (
                  <div key={item.name} className="mb-4">
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className="flex items-center justify-between w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                        >
                          {item.name}
                          <motion.span
                            animate={{ rotate: activeSubmenu === item.name ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FiChevronDown />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {activeSubmenu === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4 mt-2 space-y-2 overflow-hidden"
                            >
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                        {user?.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiUser className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                        </div>
                      </div>
                    </div>

                    <Link href={getDashboardLink()}>
                      <button className="w-full flex items-center px-4 py-2 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200">
                        <FiUser className="mr-2 h-5 w-5" />
                        Dashboard
                      </button>
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors duration-200"
                    >
                      <FiLogOut className="mr-2 h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <button className="w-full px-4 py-2 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200">
                        Login
                      </button>
                    </Link>
                    <Link href="/auth/register">
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:from-purple-700 hover:to-pink-600 transition-colors duration-200">
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
