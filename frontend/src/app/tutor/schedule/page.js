'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function TutorSchedulePage() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is just mock data for demonstration
    const mockSessions = [
      {
        id: 1,
        title: 'Grammar Session',
        student: { id: 1, name: 'Jane Cooper' },
        start_time: new Date(new Date().setHours(10, 0, 0, 0)),
        end_time: new Date(new Date().setHours(11, 0, 0, 0)),
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Vocabulary Review',
        student: { id: 2, name: 'Cody Fisher' },
        start_time: new Date(new Date().setHours(13, 30, 0, 0)),
        end_time: new Date(new Date().setHours(14, 30, 0, 0)),
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Speaking Practice',
        student: { id: 3, name: 'Esther Howard' },
        start_time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0, 0, 0),
        end_time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0),
        status: 'upcoming'
      },
      {
        id: 4,
        title: 'Writing Workshop',
        student: { id: 4, name: 'Jenny Wilson' },
        start_time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0),
        end_time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 30, 0, 0),
        status: 'upcoming'
      },
      {
        id: 5,
        title: 'Reading Comprehension',
        student: { id: 5, name: 'Kristin Watson' },
        start_time: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(11, 0, 0, 0),
        end_time: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(12, 0, 0, 0),
        status: 'upcoming'
      },
      {
        id: 6,
        title: 'Pronunciation Practice',
        student: { id: 6, name: 'Cameron Williamson' },
        start_time: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(14, 0, 0, 0),
        end_time: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(15, 0, 0, 0),
        status: 'completed'
      },
      {
        id: 7,
        title: 'Listening Exercise',
        student: { id: 7, name: 'Brooklyn Simmons' },
        start_time: new Date(new Date().setDate(new Date().getDate() - 2)).setHours(10, 30, 0, 0),
        end_time: new Date(new Date().setDate(new Date().getDate() - 2)).setHours(11, 30, 0, 0),
        status: 'completed'
      }
    ];

    setTimeout(() => {
      setSessions(mockSessions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Get days of the current week
  const getDaysOfWeek = () => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const monday = new Date(currentDate.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  // Get sessions for a specific day
  const getSessionsForDay = (date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Format time (e.g., "10:00 AM")
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date (e.g., "Mon, Aug 23")
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Schedule
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          New Session
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (currentView === 'day') {
                  newDate.setDate(newDate.getDate() - 1);
                } else if (currentView === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setMonth(newDate.getMonth() - 1);
                }
                setSelectedDate(newDate);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {currentView === 'day' ? formatDate(selectedDate) :
               currentView === 'week' ? `Week of ${formatDate(getDaysOfWeek()[0])}` :
               new Date(selectedDate).toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (currentView === 'day') {
                  newDate.setDate(newDate.getDate() + 1);
                } else if (currentView === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setMonth(newDate.getMonth() + 1);
                }
                setSelectedDate(newDate);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Today
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('day')}
              className={`px-3 py-1 text-sm rounded-md ${
                currentView === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                currentView === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                currentView === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentView === 'week' ? (
          <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
            {getDaysOfWeek().map((date, index) => (
              <div key={index} className="min-h-[500px]">
                <div className={`px-2 py-3 text-center ${
                  isToday(date) ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {date.toLocaleDateString([], { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isToday(date) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
                <div className="p-2 space-y-2">
                  {getSessionsForDay(date).map((session) => (
                    <div 
                      key={session.id} 
                      className={`p-2 rounded-md text-xs ${
                        session.status === 'completed' 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' 
                          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                      }`}
                    >
                      <div className="font-medium">{session.title}</div>
                      <div className="flex items-center mt-1">
                        <FiClock className="mr-1 h-3 w-3" />
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </div>
                      <div className="flex items-center mt-1">
                        <FiUser className="mr-1 h-3 w-3" />
                        {session.student.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              {currentView === 'day' ? 'Day view' : 'Month view'} will be implemented soon.
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Upcoming Sessions
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sessions
            .filter(session => session.status === 'upcoming')
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 5)
            .map((session) => (
              <div key={session.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(session.start_time)} • {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Student: {session.student.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="p-1 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {sessions.filter(session => session.status === 'upcoming').length === 0 && (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No upcoming sessions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
