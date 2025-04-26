'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import skinService from '@/services/skinService';
import SkinPreview from '@/components/skin-preview/SkinPreview';

const SkinsPage = () => {
  const [skins, setSkins] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    public_only: '',
    user_id: '',
  });

  useEffect(() => {
    fetchSkins();
  }, [pagination.page]);

  const fetchSkins = async (page = pagination.page) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await skinService.getAll(params);

      if (response.success && response.data) {
        setSkins(response.data.skins || []);
        setPagination({
          ...pagination,
          page: response.data.page || 1,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false,
        });
      } else {
        console.error('Unexpected API response format:', response);
      }
    } catch (error) {
      console.error('Error fetching skins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Special handling for public_only and user_id
    if (name === 'public_only') {
      // Keep as string in the UI, will be converted in the service
      setFilters({ ...filters, [name]: value });
    } else if (name === 'user_id') {
      // Ensure it's a valid integer or empty string
      const newValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
      setFilters({ ...filters, [name]: newValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkins(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      public_only: '',
      user_id: '',
    });
    fetchSkins(1);
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Skins</h1>
        <Link href="/admin/skins/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Skin
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Search by name"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="public_only" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Visibility
              </label>
              <select
                id="public_only"
                name="public_only"
                value={filters.public_only}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="true">Public Only</option>
                <option value="false">Private Only</option>
              </select>
            </div>

            <div>
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Creator ID
              </label>
              <input
                type="text"
                name="user_id"
                id="user_id"
                value={filters.user_id}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Filter by creator ID"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiFilter className="mr-2 h-4 w-4" />
                Filter
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Skins Grid */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : skins.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skins.map((skin) => (
                <Link key={skin.id} href={`/admin/skins/${skin.id}`}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow cursor-pointer"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-600">
                      {/* Skin Preview */}
                      <div className="w-full h-full flex items-center justify-center">
                        {skin.theme_data ? (
                          <div className="w-full h-full p-2 overflow-hidden">
                            <SkinPreview
                              themeData={skin.theme_data}
                              scale={0.3}
                              width="100%"
                              height="100%"
                            />
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                              {skin.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{skin.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {skin.description || 'No description'}
                      </p>
                      <div className="mt-2 flex items-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            skin.is_public
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {skin.is_public ? 'Public' : 'Private'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(skin.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      pagination.hasPrevPage
                        ? 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
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
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        pagination.page === i + 1
                          ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-200'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      pagination.hasNextPage
                        ? 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
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
            )}
          </>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No skins found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new skin.
            </p>
            <div className="mt-6">
              <Link href="/admin/skins/new">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Skin
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinsPage;
