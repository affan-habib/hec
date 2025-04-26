'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiBell, FiUser, FiMoon, FiSun, FiSettings, FiLogOut, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import ChatPreview from '@/components/shared/ChatPreview';

// Function to get the appropriate profile path based on user role
const getProfilePathByRole = (user) => {
  if (!user) return '/auth/login';

  switch (user.role) {
    case 'admin':
      return '/admin/profile';
    case 'tutor':
      return '/tutor/profile';
    case 'student':
      return '/student/profile';
    default:
      return '/auth/login';
  }
};

// Function to get the appropriate settings path based on user role
const getSettingsPathByRole = (user) => {
  if (!user) return '/auth/login';

  switch (user.role) {
    case 'admin':
      return '/admin/settings';
    case 'tutor':
      return '/tutor/settings';
    case 'student':
      return '/student/settings';
    default:
      return '/auth/login';
  }
};

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatDropdownOpen, setChatDropdownOpen] = useState(false);
  const chatDropdownRef = useRef(null);

  useEffect(() => {
    // Check if dark mode is enabled in cookies
    const isDarkMode = Cookies.get('darkMode') === 'true';
    setDarkMode(isDarkMode);

    // Apply dark mode class to document if enabled
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle click outside to close chat dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setChatDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    Cookies.set('darkMode', newDarkMode.toString(), { expires: 7 }); // Expires in 7 days

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user?.role === 'admin' && 'Hello English Coaching Admin'}
              {user?.role === 'tutor' && 'Hello English Coaching Tutor'}
              {user?.role === 'student' && 'Hello English Coaching Student'}
              {!user?.role && 'Hello English Coaching'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Chat */}
            <div className="relative" ref={chatDropdownRef}>
              <button
                onClick={() => setChatDropdownOpen(!chatDropdownOpen)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative"
                aria-label="View messages"
              >
                <FiMessageCircle size={20} />
                {/* Unread indicator - this would be dynamic based on actual unread count */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* Chat Dropdown */}
              {chatDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <ChatPreview onClose={() => setChatDropdownOpen(false)} />
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="View notifications"
            >
              <FiBell size={20} />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {user?.first_name ? user.first_name[0] : <FiUser size={16} />}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : 'Admin'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <Link
                    href={getProfilePathByRole(user)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser className="mr-2" />
                    Your Profile
                  </Link>
                  <Link
                    href={getSettingsPathByRole(user)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings className="mr-2" />
                    Settings
                  </Link>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <FiLogOut className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
