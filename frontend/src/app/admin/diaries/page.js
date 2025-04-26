'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiSearch, FiRefreshCw, FiUser, FiCalendar, FiBook, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '@/components/ui/DataTable';
import diaryService from '@/services/diaryService';
import TutorAssignmentModal from '@/components/modals/TutorAssignmentModal';

const DiariesPage = () => {
  const router = useRouter();
  const [diaries, setDiaries] = useState([]);
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
    title: '',
    student_id: '',
    tutor_id: '',
  });
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const fetchDiaries = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await diaryService.getAll(params);

      if (response.success && response.data) {
        // Handle the response structure from the backend
        if (Array.isArray(response.data.diaries)) {
          setDiaries(response.data.diaries);

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
          setDiaries(response.data);
          setPagination({
            ...pagination,
            total: response.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
        } else {
          console.error('Unexpected API response format:', response);
          setDiaries([]);
        }
      } else {
        console.error('Unexpected API response format:', response);
        setDiaries([]);
      }
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setDiaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  const handlePageChange = (page) => {
    fetchDiaries(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDiaries(1);
  };

  const handleResetFilters = () => {
    setFilters({
      title: '',
      student_id: '',
      tutor_id: '',
    });
    setTimeout(() => fetchDiaries(1), 0);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'title',
      header: 'Title',
      render: (value, row) => (
        <div className="flex items-center">
          <FiBook className="mr-2 text-indigo-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Student',
      render: (value, row) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-green-500" />
          <span>
            {row.student ?
              `${row.student.first_name} ${row.student.last_name}` :
              'Unknown Student'}
          </span>
        </div>
      ),
    },
    {
      key: 'tutor',
      header: 'Tutor',
      render: (value, row) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiUser className="mr-2 text-blue-500" />
            <span>
              {row.tutor ?
                `${row.tutor.first_name} ${row.tutor.last_name}` :
                'Unassigned'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAssignTutor(row);
            }}
            className="ml-2 p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            title={row.tutor ? "Change Tutor" : "Assign Tutor"}
          >
            <FiUserPlus className="h-4 w-4" />
          </button>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value) => (
        <div className="flex items-center">
          <FiCalendar className="mr-2 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'pages_count',
      header: 'Pages',
      render: (value, row) => (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
          {value || 0}
        </span>
      ),
    },
  ];

  const handleViewDiary = (diary) => {
    router.push(`/diaries/${diary.id}`);
  };

  const handleEditDiary = (diary) => {
    router.push(`/diaries/${diary.id}/edit`);
  };

  const handleDeleteDiary = async (diary) => {
    if (window.confirm(`Are you sure you want to delete the diary "${diary.title}"?`)) {
      try {
        await diaryService.delete(diary.id);
        fetchDiaries(pagination.page);
      } catch (error) {
        console.error('Error deleting diary:', error);
        alert('Failed to delete diary. Please try again.');
      }
    }
  };

  const handleAssignTutor = (diary) => {
    setSelectedDiary(diary);
    setShowTutorModal(true);
  };

  const handleTutorAssigned = (updatedDiary) => {
    // Update the diary in the list
    setDiaries(diaries.map(d => d.id === updatedDiary.id ? { ...d, tutor: updatedDiary.tutor } : d));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Diaries</h1>
        <Link href="/admin/diaries/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Diary
          </motion.button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleFilterSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                  placeholder="Search by title"
                />
              </div>
            </div>
            <div>
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Student ID
              </label>
              <input
                type="text"
                name="student_id"
                id="student_id"
                value={filters.student_id}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                placeholder="Enter student ID"
              />
            </div>
            <div>
              <label htmlFor="tutor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tutor ID
              </label>
              <input
                type="text"
                name="tutor_id"
                id="tutor_id"
                value={filters.tutor_id}
                onChange={handleFilterChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                placeholder="Enter tutor ID"
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
          data={diaries}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewDiary}
          onEdit={handleEditDiary}
          onDelete={handleDeleteDiary}
          isLoading={isLoading}
          emptyMessage="No diaries found. Try adjusting your filters or add a new diary."
        />

        {/* Tutor Assignment Modal */}
        <TutorAssignmentModal
          isOpen={showTutorModal}
          onClose={() => setShowTutorModal(false)}
          diaryId={selectedDiary?.id}
          currentTutorId={selectedDiary?.tutor?.id}
          onAssign={handleTutorAssigned}
        />
      </div>
    </div>
  );
};

export default DiariesPage;
