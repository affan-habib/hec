'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiUser, FiCalendar, FiBook, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import diaryService from '@/services/diaryService';

const DiaryDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [diary, setDiary] = useState(null);
  const [diaryPages, setDiaryPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchDiaryAndPages = async () => {
      try {
        // Fetch diary details
        const diaryResponse = await diaryService.getById(id);
        
        if (diaryResponse.success && diaryResponse.data) {
          setDiary(diaryResponse.data);
          
          // Fetch diary pages
          const pagesResponse = await diaryService.getDiaryPages(id, {
            page: pagination.page,
            limit: pagination.limit
          });
          
          if (pagesResponse.success && pagesResponse.data) {
            if (Array.isArray(pagesResponse.data.pages)) {
              setDiaryPages(pagesResponse.data.pages);
              
              // Extract pagination data
              const paginationData = pagesResponse.data.pagination || {};
              setPagination({
                page: paginationData.page || 1,
                limit: paginationData.limit || 10,
                total: paginationData.total || 0,
                totalPages: paginationData.totalPages || 1,
                hasNextPage: paginationData.hasNextPage || false,
                hasPrevPage: paginationData.hasPrevPage || false,
              });
            } else if (Array.isArray(pagesResponse.data)) {
              setDiaryPages(pagesResponse.data);
            }
          }
        } else {
          console.error('Unexpected API response format:', diaryResponse);
          setError('Failed to load diary data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching diary:', error);
        setError('Failed to load diary data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaryAndPages();
  }, [id, pagination.page, pagination.limit]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleDeleteDiary = async () => {
    if (window.confirm(`Are you sure you want to delete the diary "${diary.title}"?`)) {
      try {
        await diaryService.delete(id);
        router.push('/diaries');
      } catch (error) {
        console.error('Error deleting diary:', error);
        setError('Failed to delete diary. Please try again.');
      }
    }
  };

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this diary page?')) {
      try {
        await diaryService.deleteDiaryPage(id, pageId);
        
        // Refresh diary pages
        const pagesResponse = await diaryService.getDiaryPages(id, {
          page: pagination.page,
          limit: pagination.limit
        });
        
        if (pagesResponse.success && pagesResponse.data) {
          if (Array.isArray(pagesResponse.data.pages)) {
            setDiaryPages(pagesResponse.data.pages);
            
            // Extract pagination data
            const paginationData = pagesResponse.data.pagination || {};
            setPagination({
              page: paginationData.page || 1,
              limit: paginationData.limit || 10,
              total: paginationData.total || 0,
              totalPages: paginationData.totalPages || 1,
              hasNextPage: paginationData.hasNextPage || false,
              hasPrevPage: paginationData.hasPrevPage || false,
            });
          } else if (Array.isArray(pagesResponse.data)) {
            setDiaryPages(pagesResponse.data);
          }
        }
      } catch (error) {
        console.error('Error deleting diary page:', error);
        alert('Failed to delete diary page. Please try again.');
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
              <Link href="/admin/diaries">
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
              <Link href="/admin/diaries">
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
          <Link href="/admin/diaries">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Diary Details
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/diaries/${id}/edit`}>
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
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex-shrink-0 flex items-center justify-center">
              <FiBook className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {diary.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Diary ID: {diary.id}
              </p>
            </div>
          </div>
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
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <FiUser className="mr-1 h-4 w-4 text-green-500" />
                Student
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diary.student ? (
                  <Link href={`/students/${diary.student.id}`}>
                    <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                      {`${diary.student.first_name} ${diary.student.last_name}`}
                    </span>
                  </Link>
                ) : (
                  'Unknown Student'
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <FiUser className="mr-1 h-4 w-4 text-blue-500" />
                Tutor
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {diary.tutor ? (
                  <Link href={`/tutors/${diary.tutor.id}`}>
                    <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                      {`${diary.tutor.first_name} ${diary.tutor.last_name}`}
                    </span>
                  </Link>
                ) : (
                  'Unassigned'
                )}
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Diary Pages
          </h3>
          <Link href={`/diaries/${id}/pages/new`}>
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
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {diaryPages.map((page) => (
                  <li key={page.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
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
                            Created: {new Date(page.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/diaries/${id}/pages/${page.id}`}>
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            View
                          </button>
                        </Link>
                        <Link href={`/diaries/${id}/pages/${page.id}/edit`}>
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {page.content && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {page.content}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                        pagination.hasPrevPage
                          ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-800 cursor-not-allowed'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                        pagination.hasNextPage
                          ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-800 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrevPage}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                            pagination.hasPrevPage
                              ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        
                        {/* Page numbers */}
                        {[...Array(pagination.totalPages).keys()].map((pageNum) => {
                          const page = pageNum + 1;
                          // Show current page, first page, last page, and pages around current page
                          if (
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= pagination.page - 1 && page <= pagination.page + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  page === pagination.page
                                    ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-200'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } text-sm font-medium`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            (page === 2 && pagination.page > 3) ||
                            (page === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
                          ) {
                            // Show ellipsis
                            return (
                              <span
                                key={page}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                        
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                            pagination.hasNextPage
                              ? 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
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
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pages found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new diary page.
              </p>
              <div className="mt-6">
                <Link href={`/diaries/${id}/pages/new`}>
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

export default DiaryDetailPage;
