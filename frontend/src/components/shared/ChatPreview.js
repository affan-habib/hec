'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMessageCircle, FiUser, FiClock, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const ChatPreview = ({ maxItems = 5, showHeader = true, onClose = null }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call
        // For now, we'll use mock data
        const mockChats = [
          {
            id: 1,
            user: {
              id: 101,
              name: 'John Smith',
              avatar: null,
              role: 'student'
            },
            last_message: {
              content: 'Hello, I have a question about the homework assignment.',
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
              is_read: false
            }
          },
          {
            id: 2,
            user: {
              id: 102,
              name: 'Sarah Johnson',
              avatar: null,
              role: 'student'
            },
            last_message: {
              content: 'Thank you for your feedback on my essay!',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              is_read: true
            }
          },
          {
            id: 3,
            user: {
              id: 103,
              name: 'Michael Brown',
              avatar: null,
              role: 'tutor'
            },
            last_message: {
              content: 'I\'ve reviewed your latest submission. Great progress!',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              is_read: true
            }
          },
          {
            id: 4,
            user: {
              id: 104,
              name: 'Emily Davis',
              avatar: null,
              role: 'student'
            },
            last_message: {
              content: 'When is our next session scheduled?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
              is_read: false
            }
          },
          {
            id: 5,
            user: {
              id: 105,
              name: 'David Wilson',
              avatar: null,
              role: 'student'
            },
            last_message: {
              content: 'I\'ve completed all the exercises for this week.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
              is_read: true
            }
          },
          {
            id: 6,
            user: {
              id: 106,
              name: 'Jessica Taylor',
              avatar: null,
              role: 'student'
            },
            last_message: {
              content: 'Could you explain the grammar rule again?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
              is_read: true
            }
          }
        ];

        // Filter chats based on user role
        let filteredChats = [];
        if (user?.role === 'admin') {
          // Admin sees all chats
          filteredChats = mockChats;
        } else if (user?.role === 'tutor') {
          // Tutor sees chats with students
          filteredChats = mockChats.filter(chat => chat.user.role === 'student');
        } else if (user?.role === 'student') {
          // Student sees chats with tutors
          filteredChats = mockChats.filter(chat => chat.user.role === 'tutor');
        }

        setChats(filteredChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Get the appropriate chat path based on user role
  const getChatPath = (chatId) => {
    switch (user?.role) {
      case 'admin':
        return `/admin/chats/${chatId}`;
      case 'tutor':
        return `/tutor/chats/${chatId}`;
      case 'student':
        return `/student/chat/${chatId}`;
      default:
        return '/auth/login';
    }
  };

  // Get the path to the full chat dashboard
  const getAllChatsPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/chats';
      case 'tutor':
        return '/tutor/chats';
      case 'student':
        return '/student/chat';
      default:
        return '/auth/login';
    }
  };

  // Format timestamp to relative time (e.g., "5m ago", "2h ago")
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const displayChats = chats.slice(0, maxItems);
  const unreadCount = chats.filter(chat => !chat.last_message.is_read).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <FiMessageCircle className="mr-2" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              &times;
            </button>
          )}
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
          </div>
        ) : displayChats.length > 0 ? (
          displayChats.map((chat) => (
            <Link
              key={chat.id}
              href={getChatPath(chat.id)}
              onClick={onClose}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-3 flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {chat.user.avatar ? (
                      <img src={chat.user.avatar} alt={chat.user.name} className="h-10 w-10 rounded-full" />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <FiClock className="inline mr-1" />
                      {formatRelativeTime(chat.last_message.timestamp)}
                    </p>
                  </div>
                  <p className={`text-sm truncate ${chat.last_message.is_read ? 'text-gray-500 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                    {chat.last_message.content}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right">
        <Link
          href={getAllChatsPath()}
          onClick={onClose}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center justify-center"
        >
          See all messages
          <FiChevronRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ChatPreview;
