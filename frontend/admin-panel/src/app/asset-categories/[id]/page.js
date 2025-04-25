'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';
import assetCategoryService from '@/services/assetCategoryService';
import assetService from '@/services/assetService';

const AssetCategoryDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryAndAssets = async () => {
      try {
        // Fetch category details
        const categoryResponse = await assetCategoryService.getById(id);
        
        if (categoryResponse.success && categoryResponse.data) {
          setCategory(categoryResponse.data);
          
          // If the category has assets property, use it
          if (categoryResponse.data.assets && Array.isArray(categoryResponse.data.assets)) {
            setAssets(categoryResponse.data.assets);
          } else {
            // Otherwise, fetch assets by category
            try {
              const assetsResponse = await assetService.getByCategory(id);
              if (assetsResponse.success && assetsResponse.data && Array.isArray(assetsResponse.data.assets)) {
                setAssets(assetsResponse.data.assets);
              }
            } catch (assetError) {
              console.error('Error fetching assets:', assetError);
            }
          }
        } else {
          console.error('Unexpected API response format:', categoryResponse);
          setError('Failed to load category data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching asset category:', error);
        setError('Failed to load category data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndAssets();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await assetCategoryService.delete(id);
        router.push('/asset-categories');
      } catch (error) {
        console.error('Error deleting asset category:', error);
        setError('Failed to delete category. Please try again.');
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
              <Link href="/asset-categories">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Asset Categories
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
          <Link href="/asset-categories">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Asset Category Details
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/asset-categories/${id}/edit`}>
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
            onClick={handleDelete}
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
              <FiGrid className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category ID: {category.id}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {category.description || 'No description available'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {category.display_order}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {category.created_at ? new Date(category.created_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {category.updated_at ? new Date(category.updated_at).toLocaleString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Assets in this Category
          </h3>
          <Link href={`/assets/new?category_id=${id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-1 h-4 w-4" />
              Add Asset
            </motion.button>
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {assets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {assets.map((asset) => (
                <Link key={asset.id} href={`/assets/${asset.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={asset.image_url}
                        alt={asset.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      {asset.is_premium && (
                        <div className="absolute top-0 right-0 m-1 px-2 py-1 bg-yellow-500 text-xs font-bold rounded text-white">
                          Premium
                        </div>
                      )}
                      {!asset.is_free && !asset.is_premium && (
                        <div className="absolute top-0 right-0 m-1 px-2 py-1 bg-blue-500 text-xs font-bold rounded text-white">
                          Paid
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {asset.is_free
                          ? 'Free'
                          : asset.price > 0
                          ? `$${asset.price}`
                          : `${asset.points_required} points`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No assets found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCategoryDetailPage;
