'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiCalendar, FiFileText, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StudentDiaryPageDetailPage = ({ params }) => {
  const { id, pageId } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [diaryPage, setDiaryPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

        const mockPage = {
          id: parseInt(pageId),
          diary_id: parseInt(id),
          title: 'My Trip to London',
          content: 'I visited London last weekend and practiced my English with locals. It was an amazing experience! I visited the Tower of London, Buckingham Palace, and the British Museum. I was nervous about speaking English at first, but everyone was very patient and helpful. I even managed to order food at a restaurant without any problems. My favorite part was talking to a local tour guide who told me interesting stories about the city\'s history. I learned many new words and phrases during this trip. I feel more confident in my English skills now.',
          page_number: 5,
          created_at: '2023-08-15T10:30:00Z',
          updated_at: '2023-08-15T10:30:00Z',
          images: [
            {
              id: 1,
              url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
              caption: 'London Bridge'
            },
            {
              id: 2,
              url: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd',
              caption: 'Big Ben'
            }
          ]
        };

        setDiary(mockDiary);
        setDiaryPage(mockPage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, pageId]);

  const handleDeletePage = async () => {
    if (window.confirm('Are you sure you want to delete this diary page?')) {
      try {
        // In a real app, this would be an API call to delete the diary page
        console.log('Deleting diary page:', pageId);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to the diary page
        router.push(`/student/diaries/${id}`);
      } catch (error) {
        console.error('Error deleting diary page:', error);
        setError('Failed to delete diary page. Please try again.');
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
              <Link href={`/student/diaries/${id}`}>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diary
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!diary || !diaryPage) {
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
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Diary page not found</p>
            <div className="mt-4">
              <Link href={`/student/diaries/${id}`}>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Diary
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
          <Link href={`/student/diaries/${id}`}>
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {diaryPage.title || `Page ${diaryPage.page_number}`}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Diary: {diary.title}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/student/diaries/${id}/pages/${pageId}/edit`}>
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
            onClick={handleDeletePage}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
            Delete
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex-shrink-0 flex items-center justify-center">
              <FiFileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Page Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {diaryPage.page_number}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {diaryPage.title && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {diaryPage.title}
                </dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <FiCalendar className="mr-1 h-4 w-4" />
                Created At
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diaryPage.created_at ? new Date(diaryPage.created_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diaryPage.updated_at ? new Date(diaryPage.updated_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Content
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="prose dark:prose-invert max-w-none">
            {diaryPage.content ? (
              <p className="whitespace-pre-line">{diaryPage.content}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No content available</p>
            )}
          </div>
        </div>
      </div>

      {diaryPage.images && diaryPage.images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <FiImage className="mr-2 h-5 w-5 text-indigo-500" />
              Images
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {diaryPage.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="h-48 w-full object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Link href={`/student/diaries/${id}`}>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
            Back to Diary
          </button>
        </Link>
        <Link href={`/student/diaries/${id}/pages/new`}>
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StudentDiaryPageDetailPage;
