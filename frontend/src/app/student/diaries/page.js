'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiSearch, FiBook, FiCalendar, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StudentDiariesPage = () => {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiaries, setFilteredDiaries] = useState([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        // Mock data for now - in a real app, this would be fetched from the API
        const mockDiaries = [
          {
            id: 1,
            title: 'My English Journey',
            description: 'A diary about my progress learning English',
            created_at: '2023-08-01T10:30:00Z',
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
            description: 'Notes and exercises on English grammar',
            created_at: '2023-07-15T14:45:00Z',
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
            description: 'New words and phrases I\'ve learned',
            created_at: '2023-07-01T09:15:00Z',
            updated_at: '2023-08-05T09:15:00Z',
            pages_count: 7,
            last_page: {
              id: 15,
              title: 'Business Vocabulary',
              updated_at: '2023-08-05T09:15:00Z'
            }
          },
          {
            id: 4,
            title: 'Daily Conversations',
            description: 'Practice dialogues and everyday phrases',
            created_at: '2023-06-15T11:20:00Z',
            updated_at: '2023-07-20T16:40:00Z',
            pages_count: 10,
            last_page: {
              id: 25,
              title: 'At the Restaurant',
              updated_at: '2023-07-20T16:40:00Z'
            }
          },
          {
            id: 5,
            title: 'Reading Comprehension',
            description: 'Notes from articles and books I\'ve read',
            created_at: '2023-05-10T08:00:00Z',
            updated_at: '2023-06-30T13:15:00Z',
            pages_count: 8,
            last_page: {
              id: 33,
              title: 'The Great Gatsby - Chapter 3',
              updated_at: '2023-06-30T13:15:00Z'
            }
          }
        ];

        setDiaries(mockDiaries);
        setFilteredDiaries(mockDiaries);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching diaries:', error);
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  useEffect(() => {
    // Filter diaries based on search term
    if (searchTerm.trim() === '') {
      setFilteredDiaries(diaries);
    } else {
      const filtered = diaries.filter(diary => 
        diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (diary.description && diary.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDiaries(filtered);
    }
  }, [searchTerm, diaries]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Diaries</h1>
        <Link href="/student/diaries/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Diary
          </motion.button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
              placeholder="Search diaries"
            />
          </div>
        </div>

        {filteredDiaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDiaries.map((diary) => (
              <motion.div
                key={diary.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <FiBook className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {diary.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {diary.pages_count} pages
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {diary.description || 'No description'}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="mr-1.5 h-4 w-4" />
                      {new Date(diary.updated_at).toLocaleDateString()}
                    </div>
                    {diary.last_page && (
                      <Link href={`/student/diaries/${diary.id}/pages/${diary.last_page.id}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center">
                        <FiEdit className="mr-1 h-4 w-4" />
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <Link href={`/student/diaries/${diary.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                      View diary
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              {searchTerm ? 'Try adjusting your search term.' : 'Get started by creating a new diary.'}
            </p>
            {!searchTerm && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDiariesPage;
