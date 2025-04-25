'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '@/components/ui/DataTable';
import studentService from '@/services/studentService';
import Link from 'next/link';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
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
    level: '',
  });

  const fetchStudents = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await studentService.getAll(params);
      setStudents(response.data.students);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
        hasNextPage: response.data.hasNextPage || false,
        hasPrevPage: response.data.hasPrevPage || false,
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handlePageChange = (page) => {
    fetchStudents(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStudents(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      level: '',
    });
    fetchStudents(1);
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
      key: 'studentProfile.level',
      header: 'Level',
      render: (value) => value || 'N/A',
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleViewStudent = (student) => {
    // Navigate to student details page
    window.location.href = `/students/${student.id}`;
  };

  const handleEditStudent = (student) => {
    // Navigate to student edit page
    window.location.href = `/students/${student.id}/edit`;
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      try {
        await studentService.delete(student.id);
        fetchStudents(pagination.page);
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Students</h1>
        <Link href="/students/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Student
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
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Level
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="level"
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
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
          data={students}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewStudent}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          isLoading={isLoading}
          emptyMessage="No students found. Try adjusting your filters or add a new student."
        />
      </div>
    </div>
  );
};

export default StudentsPage;
