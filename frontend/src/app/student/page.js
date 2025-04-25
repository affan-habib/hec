'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBook, FiMessageSquare, FiAward, FiEdit, FiPlus, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [recentDiaries, setRecentDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {


        // Mock data for now - in a real app, this would be fetched from the API
        setStudent({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          level: 'Intermediate',
          points: 250,
          awards_count: 5,
          diaries_count: 3,
          tutor: {
            id: 1,
            first_name: 'Jane',
            last_name: 'Smith'
          }
        });

        setRecentDiaries([
          {
            id: 1,
            title: 'My English Journey',
            updated_at: '2023-08-15T10:30:00Z',
            pages_count: 5,
            last_page: {
              id: 12,
              title: 'My Trip to London',
              updated_at: '2023-08-15T10:30:00Z'
            }
          },
          {
            id: 2,
            title: 'Grammar Practice',
            updated_at: '2023-08-10T14:45:00Z',
            pages_count: 3,
            last_page: {
              id: 8,
              title: 'Past Perfect Tense',
              updated_at: '2023-08-10T14:45:00Z'
            }
          },
          {
            id: 3,
            title: 'Vocabulary Notes',
            updated_at: '2023-08-05T09:15:00Z',
            pages_count: 7,
            last_page: {
              id: 15,
              title: 'Business Vocabulary',
              updated_at: '2023-08-05T09:15:00Z'
            }
          }
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome, {student?.first_name}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Diaries
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {student?.diaries_count || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <Link href="/student/diaries" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                View all diaries
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiAward className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Awards
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {student?.awards_count || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <Link href="/student/awards" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                View all awards
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiMessageSquare className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Chat
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {student?.tutor ? 'Available' : 'No tutor'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <Link href="/student/chat" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Open chat
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-500 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Points
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {student?.points || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Level: {student?.level || 'Beginner'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Diaries */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Diaries
          </h2>
          <Link href="/student/diaries/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-1 h-4 w-4" />
              New Diary
            </motion.button>
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {recentDiaries.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentDiaries.map((diary) => (
                <li key={diary.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Link href={`/student/diaries/${diary.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiBook className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {diary.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {diary.pages_count} pages
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiCalendar className="mr-1.5 h-4 w-4" />
                          {new Date(diary.updated_at).toLocaleDateString()}
                        </div>
                        {diary.last_page && (
                          <Link href={`/student/diaries/${diary.id}/pages/${diary.last_page.id}`} className="mt-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center">
                            <FiEdit className="mr-1 h-4 w-4" />
                            Continue writing
                          </Link>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No diaries found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new diary.
              </p>
              <div className="mt-6">
                <Link href="/student/diaries/new">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Diary
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        {recentDiaries.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/student/diaries" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                View all diaries
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Tutor Information */}
      {student?.tutor && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Your Tutor
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {student.tutor.first_name} {student.tutor.last_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your English tutor
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/student/chat">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiMessageSquare className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Chat with Tutor
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
