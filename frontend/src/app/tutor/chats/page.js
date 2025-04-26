'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiUser, FiSend, FiPaperclip, FiImage, FiFile, FiMessageCircle } from 'react-icons/fi';

export default function TutorChatsPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is just mock data for demonstration
    const mockStudents = [
      {
        id: 1,
        name: 'Jane Cooper',
        avatar: null,
        lastMessage: 'Thank you for your feedback!',
        lastMessageTime: '10:30 AM',
        unread: 2,
        online: true
      },
      {
        id: 2,
        name: 'Cody Fisher',
        avatar: null,
        lastMessage: 'When is our next session?',
        lastMessageTime: 'Yesterday',
        unread: 0,
        online: false
      },
      {
        id: 3,
        name: 'Esther Howard',
        avatar: null,
        lastMessage: 'I completed the homework.',
        lastMessageTime: 'Yesterday',
        unread: 1,
        online: true
      },
      {
        id: 4,
        name: 'Jenny Wilson',
        avatar: null,
        lastMessage: 'Can you help me with this grammar question?',
        lastMessageTime: 'Monday',
        unread: 0,
        online: false
      },
      {
        id: 5,
        name: 'Kristin Watson',
        avatar: null,
        lastMessage: 'I will be late for our session tomorrow.',
        lastMessageTime: 'Aug 15',
        unread: 0,
        online: false
      }
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);

    // In a real app, you would fetch messages for this student from your API
    // This is just mock data for demonstration
    const mockMessages = [
      {
        id: 1,
        sender: 'student',
        text: 'Hello! I have a question about the homework.',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 2))
      },
      {
        id: 2,
        sender: 'tutor',
        text: 'Hi there! Sure, what do you need help with?',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 2))
      },
      {
        id: 3,
        sender: 'student',
        text: 'I\'m having trouble with the past perfect tense exercise.',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 45))
      },
      {
        id: 4,
        sender: 'tutor',
        text: 'The past perfect tense is used to talk about an action that happened before another action in the past. For example: "I had finished my homework before my friend called."',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 40))
      },
      {
        id: 5,
        sender: 'student',
        text: 'Oh, I see. So in the sentence "When I arrived, the movie _____ (already/start)", I should use "had already started"?',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 35))
      },
      {
        id: 6,
        sender: 'tutor',
        text: 'Exactly! That\'s correct. The movie started before you arrived, so we use the past perfect.',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 30))
      },
      {
        id: 7,
        sender: 'student',
        text: 'Thank you for your feedback!',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 25))
      }
    ];

    setMessages(mockMessages);

    // Mark messages as read
    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        return { ...s, unread: 0 };
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'tutor',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Chats
        </h1>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex">
        {/* Students List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No students found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    selectedStudent?.id === student.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="relative px-4 py-4">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {student.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.lastMessageTime}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            {student.lastMessage}
                          </p>
                          {student.unread > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                              {student.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedStudent ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className="relative flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                  {selectedStudent.avatar ? (
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                  {selectedStudent.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedStudent.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'tutor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                          message.sender === 'tutor'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 text-right ${
                          message.sender === 'tutor' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <FiPaperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <FiImage className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <FiFile className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    className="flex-1 mx-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <FiSend className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <FiMessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  Select a student to start chatting
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose a student from the list to view your conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
