'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '@/components/ui/DataTable';
import tutorService from '@/services/tutorService';
import chatService from '@/services/chatService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TutorsPage = () => {
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
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
    specialization: '',
    min_experience: '',
    max_hourly_rate: '',
  });
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const fetchTutors = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await tutorService.getAll(params);

      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.tutors)) {
        setTutors(response.data.tutors);

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
        setTutors(response.data);
        setPagination({
          ...pagination,
          total: response.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        console.error('Unexpected API response format:', response);
        setTutors([]);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setTutors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handlePageChange = (page) => {
    fetchTutors(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTutors(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      specialization: '',
      min_experience: '',
      max_hourly_rate: '',
    });
    fetchTutors(1);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'first_name',
      header: 'First Name',
    },
    {
      key: 'last_name',
      header: 'Last Name',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'tutorProfile.specialization',
      header: 'Specialization',
      render: (value) => value || 'N/A',
    },
    {
      key: 'tutorProfile.experience',
      header: 'Experience (Years)',
      render: (value) => value || 'N/A',
    },
    {
      key: 'tutorProfile.hourly_rate',
      header: 'Hourly Rate ($)',
      render: (value) => (value ? `$${value}` : 'N/A'),
    },
  ];

  const handleViewTutor = (tutor) => {
    // Navigate to tutor details page
    window.location.href = `/tutors/${tutor.id}`;
  };

  const handleEditTutor = (tutor) => {
    // Navigate to tutor edit page
    window.location.href = `/tutors/${tutor.id}/edit`;
  };

  const handleDeleteTutor = async (tutor) => {
    if (window.confirm(`Are you sure you want to delete ${tutor.first_name} ${tutor.last_name}?`)) {
      try {
        await tutorService.delete(tutor.id);
        fetchTutors(pagination.page);
      } catch (error) {
        console.error('Error deleting tutor:', error);
        alert('Failed to delete tutor. Please try again.');
      }
    }
  };

  const handleMessageTutor = async (tutor) => {
    try {
      setIsMessageLoading(true);
      console.log('Starting chat with tutor:', tutor.id);

      const response = await chatService.findOrCreateDirectChat(tutor.id);
      console.log('Chat response:', response);

      // Navigate to the chat page with the chat ID
      if (response && response.data) {
        console.log('Navigating to chat:', response.data.id);
        // Use window.location for a full page navigation to ensure the page is fully reloaded
        window.location.href = `/admin/chats/${response.data.id}`;
      } else {
        console.error('Invalid response from chat service:', response);
        alert('Failed to create chat. Invalid response from server.');
      }
    } catch (error) {
      console.error('Error creating chat with tutor:', error);
      alert('Failed to create chat. Please try again.');
    } finally {
      setIsMessageLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tutors</h1>
        <Link href="/admin/tutors/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Tutor
          </motion.button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleFilterSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specialization
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="specialization"
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                >
                  <option value="">All Specializations</option>
                  <option value="General English">General English</option>
                  <option value="Business English">Business English</option>
                  <option value="Academic English">Academic English</option>
                  <option value="Conversation">Conversation</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Children's English">Children's English</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="min_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min. Experience (Years)
              </label>
              <input
                type="number"
                name="min_experience"
                id="min_experience"
                min="0"
                value={filters.min_experience}
                onChange={handleFilterChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                placeholder="Min. years"
              />
            </div>
            <div>
              <label htmlFor="max_hourly_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max. Hourly Rate ($)
              </label>
              <input
                type="number"
                name="max_hourly_rate"
                id="max_hourly_rate"
                min="0"
                step="0.01"
                value={filters.max_hourly_rate}
                onChange={handleFilterChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                placeholder="Max. rate"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
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
        </form>

        <DataTable
          data={tutors}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewTutor}
          onEdit={handleEditTutor}
          onDelete={handleDeleteTutor}
          onMessage={handleMessageTutor}
          isLoading={isLoading || isMessageLoading}
          emptyMessage="No tutors found. Try adjusting your filters or add a new tutor."
        />
      </div>
    </div>
  );
};

export default TutorsPage;
