'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiDollarSign, FiAward, FiTag, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import assetService from '@/services/assetService';

const AssetDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await assetService.getById(id);
        
        if (response.success && response.data) {
          setAsset(response.data);
        } else {
          console.error('Unexpected API response format:', response);
          setError('Failed to load asset data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching asset:', error);
        setError('Failed to load asset data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the asset "${asset.name}"?`)) {
      try {
        await assetService.delete(id);
        router.push('/assets');
      } catch (error) {
        console.error('Error deleting asset:', error);
        setError('Failed to delete asset. Please try again.');
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
              <Link href="/assets">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Assets
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
          <Link href="/assets">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Asset Details
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/assets/${id}/edit`}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img
                src={asset.image_url}
                alt={asset.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                }}
              />
            </div>
            {asset.thumbnail_url && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Thumbnail</h3>
                <div className="mt-2">
                  <img
                    src={asset.thumbnail_url}
                    alt={`${asset.name} thumbnail`}
                    className="h-16 w-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=No+Thumbnail';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {asset.name}
                </h3>
                <div className="flex space-x-2">
                  {asset.is_premium && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Premium
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      asset.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {asset.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.description || 'No description available'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <FiTag className="mr-1 h-4 w-4" />
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.category ? (
                      <Link href={`/asset-categories/${asset.category.id}`}>
                        <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                          {asset.category.name}
                        </span>
                      </Link>
                    ) : (
                      'Unknown Category'
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <FiDollarSign className="mr-1 h-4 w-4" />
                    Pricing
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.is_free ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      <div>
                        {asset.price > 0 && (
                          <div className="flex items-center">
                            <FiDollarSign className="mr-1 h-4 w-4 text-gray-400" />
                            <span>{asset.price}</span>
                          </div>
                        )}
                        {asset.points_required > 0 && (
                          <div className="flex items-center mt-1">
                            <FiAward className="mr-1 h-4 w-4 text-gray-400" />
                            <span>{asset.points_required} points</span>
                          </div>
                        )}
                      </div>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.display_order}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Asset ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.id}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.created_at ? new Date(asset.created_at).toLocaleString() : 'N/A'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {asset.updated_at ? new Date(asset.updated_at).toLocaleString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <FiUsers className="mr-2 h-5 w-5 text-indigo-500" />
                Users with this Asset
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No users have this asset yet.
              </p>
              <div className="mt-4">
                <Link href={`/assets/${id}/assign`}>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Assign to User
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailPage;
