'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiCalendar, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StudentDiaryDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [diaryPages, setDiaryPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiaryAndPages = async () => {
      try {
        // Mock data for now - in a real app, this would be fetched from the API
        const mockDiary = {
          id: parseInt(id),
          title: 'My English Journey',
          description: 'A diary about my progress learning English',
          created_at: '2023-08-01T10:30:00Z',
          updated_at: '2023-08-15T10:30:00Z',
          pages_count: 5
        };

        const mockPages = [
          {
            id: 1,
            diary_id: parseInt(id),
            title: 'First Day of Class',
            content: 'Today was my first day of English class. I learned basic greetings and introductions.',
            page_number: 1,
            created_at: '2023-08-01T10:30:00Z',
            updated_at: '2023-08-01T10:30:00Z'
          },
          {
            id: 2,
            diary_id: parseInt(id),
            title: 'Learning Vocabulary',
            content: 'Today I learned 20 new words related to food and cooking.',
            page_number: 2,
            created_at: '2023-08-05T14:45:00Z',
            updated_at: '2023-08-05T14:45:00Z'
          },
          {
            id: 3,
            diary_id: parseInt(id),
            title: 'Grammar Practice',
            content: 'I practiced using present perfect tense today. It\'s still a bit confusing but I\'m getting better.',
            page_number: 3,
            created_at: '2023-08-08T09:15:00Z',
            updated_at: '2023-08-08T09:15:00Z'
          },
          {
            id: 4,
            diary_id: parseInt(id),
            title: 'Conversation Practice',
            content: 'Had a conversation with a native speaker today. I was nervous but managed to communicate effectively.',
            page_number: 4,
            created_at: '2023-08-12T16:30:00Z',
            updated_at: '2023-08-12T16:30:00Z'
          },
          {
            id: 5,
            diary_id: parseInt(id),
            title: 'My Trip to London',
            content: 'I visited London last weekend and practiced my English with locals. It was an amazing experience!',
            page_number: 5,
            created_at: '2023-08-15T10:30:00Z',
            updated_at: '2023-08-15T10:30:00Z'
          }
        ];

        setDiary(mockDiary);
        setDiaryPages(mockPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching diary:', error);
        setError('Failed to load diary data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDiaryAndPages();
  }, [id]);

  const handleDeleteDiary = async () => {
    if (window.confirm(`Are you sure you want to delete the diary "${diary.title}"?`)) {
      try {
        // In a real app, this would be an API call to delete the diary
        console.log('Deleting diary:', diary.id);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to the diaries page
        router.push('/student/diaries');
      } catch (error) {
        console.error('Error deleting diary:', error);
        setError('Failed to delete diary. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <div className="mt-4">
              <Link href="/student/diaries">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diaries
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Diary not found</p>
            <div className="mt-4">
              <Link href="/student/diaries">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diaries
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/student/diaries">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {diary.title}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/student/diaries/${id}/edit`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiEdit className="-ml-1 mr-2 h-5 w-5" />
              Edit
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteDiary}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
            Delete
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Diary Details
          </h2>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diary.description || 'No description available'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diary.created_at ? new Date(diary.created_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diary.updated_at ? new Date(diary.updated_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Diary Pages
          </h2>
          <Link href={`/student/diaries/${id}/pages/new`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-1 h-4 w-4" />
              Add Page
            </motion.button>
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {diaryPages.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {diaryPages.map((page) => (
                <li key={page.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Link href={`/student/diaries/${id}/pages/${page.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiFileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {page.title || `Page ${page.page_number}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Page {page.page_number}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar className="mr-1.5 h-4 w-4" />
                        {new Date(page.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {page.content}
                      </p>
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
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pages found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new diary page.
              </p>
              <div className="mt-6">
                <Link href={`/student/diaries/${id}/pages/new`}>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Page
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDiaryDetailPage;
