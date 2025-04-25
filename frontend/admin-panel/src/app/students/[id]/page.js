'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiBook, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import studentService from '@/services/studentService';

const StudentDetailPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getById(id);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('Failed to load student data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}?`)) {
      try {
        await studentService.delete(id);
        router.push('/students');
      } catch (error) {
        console.error('Error deleting student:', error);
        setError('Failed to delete student. Please try again.');
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
              <Link href="/students">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  Back to Students
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
          <Link href="/students">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Student Details
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/students/${id}/edit`}>
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
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
              {student.profile_image ? (
                <img
                  src={student.profile_image}
                  alt={`${student.first_name} ${student.last_name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl font-bold">
                  {student.first_name[0]}
                  {student.last_name[0]}
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Student ID: {student.id}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                <FiMail className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <a
                  href={`mailto:${student.email}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  {student.email}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {student.role}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">English Level</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.studentProfile?.level || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Native Language</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.studentProfile?.native_language || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Goals</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.studentProfile?.learning_goals || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.studentProfile?.interests || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(student.created_at).toLocaleString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(student.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <FiBook className="mr-2 h-5 w-5 text-indigo-500" />
              Diaries
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No diaries found for this student.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
              <FiAward className="mr-2 h-5 w-5 text-indigo-500" />
              Awards
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No awards found for this student.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
