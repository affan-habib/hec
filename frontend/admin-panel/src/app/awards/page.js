'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '@/components/ui/DataTable';
import awardService from '@/services/awardService';
import Link from 'next/link';

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
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
    category: '',
  });

  const fetchAwards = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await awardService.getAll(params);
      
      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.awards)) {
        setAwards(response.data.awards);
        
        // Extract pagination data
        const paginationData = response.data.pagination || {};
        setPagination({
          page: paginationData.page || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0,
          totalPages: paginationData.pages || 1,
          hasNextPage: paginationData.page < paginationData.pages,
          hasPrevPage: paginationData.page > 1,
        });
      } else if (response.success && Array.isArray(response.data)) {
        // Alternative response format
        setAwards(response.data);
        setPagination({
          ...pagination,
          total: response.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        console.error('Unexpected API response format:', response);
        setAwards([]);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handlePageChange = (page) => {
    fetchAwards(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAwards(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      category: '',
    });
    fetchAwards(1);
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
          {value}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'image_url',
      header: 'Image',
      render: (value) => (
        value ? (
          <img 
            src={value} 
            alt="Award" 
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40?text=No+Image';
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            N/A
          </div>
        )
      ),
    },
    {
      key: 'points_required',
      header: 'Points',
      render: (value) => value || 'N/A',
    },
  ];

  const handleViewAward = (award) => {
    // Navigate to award details page
    window.location.href = `/awards/${award.id}`;
  };

  const handleEditAward = (award) => {
    // Navigate to award edit page
    window.location.href = `/awards/${award.id}/edit`;
  };

  const handleDeleteAward = async (award) => {
    if (window.confirm(`Are you sure you want to delete the award "${award.name}"?`)) {
      try {
        await awardService.delete(award.id);
        fetchAwards(pagination.page);
      } catch (error) {
        console.error('Error deleting award:', error);
        alert('Failed to delete award. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Awards</h1>
        <Link href="/awards/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Award
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Participation">Participation</option>
                  <option value="Special">Special</option>
                </select>
              </div>
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
          data={awards}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewAward}
          onEdit={handleEditAward}
          onDelete={handleDeleteAward}
          isLoading={isLoading}
          emptyMessage="No awards found. Try adjusting your filters or add a new award."
        />
      </div>
    </div>
  );
};

export default AwardsPage;
