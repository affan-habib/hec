'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiUser, FiSend, FiPaperclip, FiImage, FiFile, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const ChatInterface = ({ selectedChatId = null, userType = 'student' }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chats
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
          }
        ];

        // Filter chats based on user type
        let filteredChats = [];
        if (userType === 'admin') {
          // Admin sees all chats
          filteredChats = mockChats;
        } else if (userType === 'tutor') {
          // Tutor sees chats with students
          filteredChats = mockChats.filter(chat => chat.user.role === 'student');
        } else if (userType === 'student') {
          // Student sees chats with tutors
          filteredChats = mockChats.filter(chat => chat.user.role === 'tutor');
        }

        // Apply search filter if any
        if (searchTerm) {
          filteredChats = filteredChats.filter(chat =>
            chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.last_message.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setChats(filteredChats);

        // If a chat ID is provided, select that chat
        if (selectedChatId) {
          const chat = filteredChats.find(c => c.id === parseInt(selectedChatId));
          if (chat) {
            setSelectedChat(chat);
          }
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [selectedChatId, userType, searchTerm]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          // This would be replaced with an actual API call
          // For now, we'll use mock data
          const mockMessages = [
            {
              id: 1,
              sender_id: selectedChat.user.id,
              sender_name: selectedChat.user.name,
              sender_role: selectedChat.user.role,
              content: 'Hello! How can I help you today?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
              is_read: true
            },
            {
              id: 2,
              sender_id: user?.id || 999,
              sender_name: user?.first_name + ' ' + user?.last_name || 'You',
              sender_role: userType,
              content: 'I have a question about the homework assignment.',
              timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
              is_read: true
            },
            {
              id: 3,
              sender_id: selectedChat.user.id,
              sender_name: selectedChat.user.name,
              sender_role: selectedChat.user.role,
              content: 'Sure, what specifically are you having trouble with?',
              timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
              is_read: true
            },
            {
              id: 4,
              sender_id: user?.id || 999,
              sender_name: user?.first_name + ' ' + user?.last_name || 'You',
              sender_role: userType,
              content: 'I\'m not sure how to approach question 3. It asks about the main theme of the passage, but I\'m finding multiple themes.',
              timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
              is_read: true
            },
            {
              id: 5,
              sender_id: selectedChat.user.id,
              sender_name: selectedChat.user.name,
              sender_role: selectedChat.user.role,
              content: 'That\'s a good observation! Literary passages often have multiple themes. In this case, try to identify which theme is most prominently developed throughout the entire passage. Look for recurring elements or ideas that the author emphasizes.',
              timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
              is_read: true
            },
            {
              id: 6,
              sender_id: user?.id || 999,
              sender_name: user?.first_name + ' ' + user?.last_name || 'You',
              sender_role: userType,
              content: 'That makes sense. I think the theme of personal growth is mentioned most frequently.',
              timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
              is_read: true
            },
            {
              id: 7,
              sender_id: selectedChat.user.id,
              sender_name: selectedChat.user.name,
              sender_role: selectedChat.user.role,
              content: 'Great! Now try to find specific examples from the text that support this theme. This will strengthen your answer.',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              is_read: true
            },
            {
              id: 8,
              sender_id: user?.id || 999,
              sender_name: user?.first_name + ' ' + user?.last_name || 'You',
              sender_role: userType,
              content: 'I\'ll do that. Thank you for your help!',
              timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
              is_read: true
            },
            {
              id: 9,
              sender_id: selectedChat.user.id,
              sender_name: selectedChat.user.name,
              sender_role: selectedChat.user.role,
              content: 'You\'re welcome! Let me know if you have any other questions.',
              timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
              is_read: true
            }
          ];

          setMessages(mockMessages);
          setTimeout(scrollToBottom, 100);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedChat, user, userType]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedChat) return;

    const newMsg = {
      id: messages.length + 1,
      sender_id: user?.id || 999,
      sender_name: user?.first_name + ' ' + user?.last_name || 'You',
      sender_role: userType,
      content: newMessage,
      timestamp: new Date().toISOString(),
      is_read: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // In a real app, you would send this message to your API
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message groups
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      {/* Chat List */}
      <div className={`w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedChat && 'hidden md:flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : chats.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat?.id === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                  onClick={() => setSelectedChat(chat)}
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(chat.last_message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className={`text-sm truncate ${chat.last_message.is_read ? 'text-gray-500 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                        {chat.last_message.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <FiMessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No messages found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try a different search term' : 'Start a conversation with your contacts'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 flex flex-col ${!selectedChat && 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
              <button
                className="md:hidden mr-2 text-gray-500 dark:text-gray-400"
                onClick={() => setSelectedChat(null)}
              >
                &larr;
              </button>
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {selectedChat.user.avatar ? (
                    <img src={selectedChat.user.avatar} alt={selectedChat.user.name} className="h-10 w-10 rounded-full" />
                  ) : (
                    <FiUser />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedChat.user.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedChat.user.role === 'student' ? 'Student' : 'Tutor'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {groupMessagesByDate().map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">
                      {formatMessageDate(group.messages[0].timestamp)}
                    </span>
                  </div>
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender_role === userType ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender_role !== userType && (
                        <div className="flex-shrink-0 mr-3 self-end">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <FiUser size={14} />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_role === userType
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.sender_role === userType
                            ? 'text-indigo-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                      {message.sender_role === userType && (
                        <div className="flex-shrink-0 ml-3 self-end">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                            {user?.first_name ? user.first_name[0] : <FiUser size={14} />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FiPaperclip />
                </button>
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FiImage />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 mx-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full ${
                    newMessage.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <FiMessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Choose a contact from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
