'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiBook, FiUser, FiCalendar, FiEye, FiEdit, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function TutorDiariesPage() {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'reviewed'

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is just mock data for demonstration
    const mockDiaries = [
      {
        id: 1,
        title: 'My Trip to London',
        student: { id: 1, name: 'Jane Cooper' },
        created_at: '2023-08-15T10:30:00Z',
        status: 'pending',
        level: 'Intermediate'
      },
      {
        id: 2,
        title: 'Past Perfect Tense',
        student: { id: 2, name: 'Cody Fisher' },
        created_at: '2023-08-10T14:45:00Z',
        status: 'reviewed',
        level: 'Beginner',
        feedback: 'Good work on understanding the concept. Practice more examples.',
        marks: 8
      },
      {
        id: 3,
        title: 'Business Vocabulary',
        student: { id: 3, name: 'Esther Howard' },
        created_at: '2023-08-05T09:15:00Z',
        status: 'pending',
        level: 'Advanced'
      },
      {
        id: 4,
        title: 'At the Restaurant',
        student: { id: 4, name: 'Jenny Wilson' },
        created_at: '2023-08-12T16:40:00Z',
        status: 'reviewed',
        level: 'Intermediate',
        feedback: 'Excellent use of dialogue. Work on pronunciation.',
        marks: 9
      },
      {
        id: 5,
        title: 'Book Review: The Great Gatsby',
        student: { id: 5, name: 'Kristin Watson' },
        created_at: '2023-07-25T13:15:00Z',
        status: 'pending',
        level: 'Beginner'
      },
      {
        id: 6,
        title: 'My Daily Routine',
        student: { id: 6, name: 'Cameron Williamson' },
        created_at: '2023-08-18T08:30:00Z',
        status: 'reviewed',
        level: 'Advanced',
        feedback: 'Good structure but needs more varied vocabulary.',
        marks: 7
      },
      {
        id: 7,
        title: 'Future Plans and Goals',
        student: { id: 7, name: 'Brooklyn Simmons' },
        created_at: '2023-08-20T11:20:00Z',
        status: 'pending',
        level: 'Intermediate'
      },
      {
        id: 8,
        title: 'My Favorite Hobby',
        student: { id: 8, name: 'Leslie Alexander' },
        created_at: '2023-08-22T15:45:00Z',
        status: 'pending',
        level: 'Beginner'
      }
    ];

    setTimeout(() => {
      setDiaries(mockDiaries);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter diaries based on search term and status
  const filteredDiaries = diaries.filter(diary => {
    const matchesSearch = 
      diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      diary.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Student Diaries
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search diaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilterStatus('reviewed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'reviewed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Reviewed
            </button>
          </div>
        </div>
      </div>

      {/* Diaries List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Diaries ({filteredDiaries.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDiaries.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No diaries found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Diary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDiaries.map((diary) => (
                  <tr key={diary.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <FiBook className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {diary.title}
                          </div>
                          {diary.status === 'reviewed' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Mark: {diary.marks}/10
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="ml-3 text-sm text-gray-900 dark:text-white">
                          {diary.student.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        diary.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        diary.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {diary.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(diary.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        diary.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {diary.status === 'pending' ? (
                          <FiXCircle className="mr-1 h-4 w-4" />
                        ) : (
                          <FiCheckCircle className="mr-1 h-4 w-4" />
                        )}
                        {diary.status === 'pending' ? 'Pending Review' : 'Reviewed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/tutor/diaries/${diary.id}`}>
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <FiEye className="mr-1 h-4 w-4" />
                            View
                          </button>
                        </Link>
                        {diary.status === 'pending' && (
                          <Link href={`/tutor/diaries/${diary.id}/review`}>
                            <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <FiEdit className="mr-1 h-4 w-4" />
                              Review
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
