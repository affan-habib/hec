'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiUser, FiSend, FiPaperclip, FiImage, FiFile, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import chatService from '@/services/chatService';

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
      if (!user) return;

      setLoading(true);
      try {
        // Get chats from API
        const response = await chatService.getAll();

        if (response.success) {
          let filteredChats = response.data || [];

          // Apply search filter if any
          if (searchTerm) {
            filteredChats = filteredChats.filter(chat =>
              chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (chat.last_message && chat.last_message.content.toLowerCase().includes(searchTerm.toLowerCase()))
            );
          }

          setChats(filteredChats);

          // If a chat ID is provided, select that chat
          if (selectedChatId) {
            const chat = filteredChats.find(c => c.id === parseInt(selectedChatId));
            if (chat) {
              setSelectedChat(chat);

              // Mark messages as read
              try {
                await chatService.markAsRead(chat.id);
              } catch (readError) {
                console.error('Error marking messages as read:', readError);
              }
            }
          }
        } else {
          console.error('Failed to fetch chats:', response.message);
          setChats([]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [selectedChatId, userType, searchTerm, user]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          // Get messages from API
          const response = await chatService.getChatMessages(selectedChat.id);

          if (response.success) {
            setMessages(response.data || []);
            setTimeout(scrollToBottom, 100);
          } else {
            console.error('Failed to fetch messages:', response.message);
            setMessages([]);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        }
      };

      fetchMessages();

      // Set up polling for new messages
      const intervalId = setInterval(fetchMessages, 10000); // Poll every 10 seconds

      return () => {
        clearInterval(intervalId); // Clean up on unmount or when chat changes
      };
    }
  }, [selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat) return;

    // Optimistically add the message to the UI
    const tempMsg = {
      id: 'temp-' + Date.now(),
      sender_id: user?.id,
      sender_name: user?.first_name + ' ' + user?.last_name || 'You',
      sender_role: userType,
      content: newMessage,
      timestamp: new Date().toISOString(),
      is_read: true,
      pending: true
    };

    setMessages([...messages, tempMsg]);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      // Send message to API
      const response = await chatService.sendMessage(selectedChat.id, messageContent);

      if (response.success) {
        // Replace the temporary message with the real one from the server
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === tempMsg.id ? response.data : msg
          )
        );
      } else {
        console.error('Failed to send message:', response.message);
        // Mark the message as failed
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === tempMsg.id ? { ...msg, failed: true, pending: false } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Mark the message as failed
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === tempMsg.id ? { ...msg, failed: true, pending: false } : msg
        )
      );
    }
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
                            ? message.failed
                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              : message.pending
                                ? 'bg-indigo-400 text-white'
                                : 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex justify-end items-center mt-1 text-xs ${
                          message.sender_role === userType
                            ? message.failed
                              ? 'text-red-600 dark:text-red-400'
                              : message.pending
                                ? 'text-indigo-100'
                                : 'text-indigo-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.failed && (
                            <span className="mr-1">Failed to send</span>
                          )}
                          {message.pending && (
                            <span className="mr-1">Sending...</span>
                          )}
                          <span>{formatTimestamp(message.timestamp)}</span>
                        </div>
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
