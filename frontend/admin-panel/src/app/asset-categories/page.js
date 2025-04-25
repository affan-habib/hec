'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '@/components/ui/DataTable';
import assetCategoryService from '@/services/assetCategoryService';
import Link from 'next/link';

const AssetCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    is_active: '',
  });

  const fetchCategories = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await assetCategoryService.getAll(params);
      
      if (response.success && response.data) {
        // Handle the response structure from the backend
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
          
          // Extract pagination data
          const paginationData = response.data.pagination || {};
          setPagination({
            page: paginationData.page || 1,
            limit: paginationData.limit || 10,
            total: paginationData.total || 0,
            totalPages: paginationData.totalPages || 1,
            hasNextPage: paginationData.hasNextPage || false,
            hasPrevPage: paginationData.hasPrevPage || false,
          });
        } else if (Array.isArray(response.data)) {
          // Alternative response format
          setCategories(response.data);
          setPagination({
            ...pagination,
            total: response.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
        } else {
          console.error('Unexpected API response format:', response);
          setCategories([]);
        }
      } else {
        console.error('Unexpected API response format:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (page) => {
    fetchCategories(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCategories(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      is_active: '',
    });
    fetchCategories(1);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'display_order',
      header: 'Display Order',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleViewCategory = (category) => {
    // Navigate to category details page
    window.location.href = `/asset-categories/${category.id}`;
  };

  const handleEditCategory = (category) => {
    // Navigate to category edit page
    window.location.href = `/asset-categories/${category.id}/edit`;
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await assetCategoryService.delete(category.id);
        fetchCategories(pagination.page);
      } catch (error) {
        console.error('Error deleting asset category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Asset Categories</h1>
        <Link href="/asset-categories/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </motion.button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleFilterSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                  placeholder="Search by name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="is_active"
                name="is_active"
                value={filters.is_active}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Filter
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Reset
              </button>
            </div>
          </div>
        </form>

        <DataTable
          data={categories}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          isLoading={isLoading}
          emptyMessage="No asset categories found. Try adjusting your filters or add a new category."
        />
      </div>
    </div>
  );
};

export default AssetCategoriesPage;
