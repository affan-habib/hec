'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiMessageCircle, FiUser, FiClock, FiPlus, FiEye, FiMessageSquare, FiThumbsUp } from 'react-icons/fi';

export default function TutorForumsPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is just mock data for demonstration
    const mockTopics = [
      {
        id: 1,
        title: 'Tips for teaching pronunciation to beginners',
        author: { id: 1, name: 'John Doe', role: 'tutor' },
        category: 'teaching_tips',
        created_at: '2023-08-15T10:30:00Z',
        views: 156,
        replies: 12,
        likes: 24,
        last_reply: {
          author: { id: 2, name: 'Jane Smith', role: 'tutor' },
          created_at: '2023-08-18T14:20:00Z'
        }
      },
      {
        id: 2,
        title: 'How to help students with English articles (a, an, the)',
        author: { id: 3, name: 'Robert Johnson', role: 'tutor' },
        category: 'grammar',
        created_at: '2023-08-10T08:45:00Z',
        views: 98,
        replies: 8,
        likes: 15,
        last_reply: {
          author: { id: 4, name: 'Emily Davis', role: 'tutor' },
          created_at: '2023-08-17T11:30:00Z'
        }
      },
      {
        id: 3,
        title: 'Best resources for teaching business English',
        author: { id: 5, name: 'Sarah Wilson', role: 'tutor' },
        category: 'resources',
        created_at: '2023-08-05T16:20:00Z',
        views: 210,
        replies: 18,
        likes: 32,
        last_reply: {
          author: { id: 1, name: 'John Doe', role: 'tutor' },
          created_at: '2023-08-19T09:15:00Z'
        }
      },
      {
        id: 4,
        title: 'Strategies for keeping students engaged during online lessons',
        author: { id: 6, name: 'Michael Brown', role: 'tutor' },
        category: 'teaching_tips',
        created_at: '2023-08-12T13:10:00Z',
        views: 175,
        replies: 14,
        likes: 28,
        last_reply: {
          author: { id: 7, name: 'Lisa Taylor', role: 'tutor' },
          created_at: '2023-08-18T15:45:00Z'
        }
      },
      {
        id: 5,
        title: 'How to explain the difference between present perfect and past simple',
        author: { id: 8, name: 'David Miller', role: 'tutor' },
        category: 'grammar',
        created_at: '2023-08-08T11:30:00Z',
        views: 132,
        replies: 10,
        likes: 19,
        last_reply: {
          author: { id: 9, name: 'Karen White', role: 'tutor' },
          created_at: '2023-08-16T10:20:00Z'
        }
      },
      {
        id: 6,
        title: 'Recommended books for teaching English literature',
        author: { id: 10, name: 'Thomas Anderson', role: 'tutor' },
        category: 'resources',
        created_at: '2023-08-03T09:45:00Z',
        views: 88,
        replies: 7,
        likes: 12,
        last_reply: {
          author: { id: 11, name: 'Jennifer Lee', role: 'tutor' },
          created_at: '2023-08-14T16:30:00Z'
        }
      },
      {
        id: 7,
        title: 'Dealing with shy students in conversation classes',
        author: { id: 12, name: 'Patricia Martinez', role: 'tutor' },
        category: 'teaching_tips',
        created_at: '2023-08-14T14:15:00Z',
        views: 110,
        replies: 9,
        likes: 21,
        last_reply: {
          author: { id: 13, name: 'Richard Harris', role: 'tutor' },
          created_at: '2023-08-19T13:40:00Z'
        }
      },
      {
        id: 8,
        title: 'Tips for preparing students for IELTS speaking test',
        author: { id: 14, name: 'Elizabeth Clark', role: 'tutor' },
        category: 'exams',
        created_at: '2023-08-09T10:20:00Z',
        views: 145,
        replies: 11,
        likes: 26,
        last_reply: {
          author: { id: 15, name: 'William Turner', role: 'tutor' },
          created_at: '2023-08-17T09:10:00Z'
        }
      }
    ];

    setTimeout(() => {
      setTopics(mockTopics);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter topics based on search term and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      topic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get category label
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'teaching_tips':
        return 'Teaching Tips';
      case 'grammar':
        return 'Grammar';
      case 'resources':
        return 'Resources';
      case 'exams':
        return 'Exams';
      default:
        return category;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'teaching_tips':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'grammar':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'resources':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'exams':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tutors Forum
        </h1>
        <Link href="/tutor/forums/new">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Topic
          </button>
        </Link>
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
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('teaching_tips')}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'teaching_tips'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
              }`}
            >
              Teaching Tips
            </button>
            <button
              onClick={() => setSelectedCategory('grammar')}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'grammar'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setSelectedCategory('resources')}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'resources'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setSelectedCategory('exams')}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'exams'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
              }`}
            >
              Exams
            </button>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Topics ({filteredTopics.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No topics found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <FiMessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/tutor/forums/${topic.id}`}>
                          <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                            {topic.title}
                          </h4>
                        </Link>
                        <div className="mt-1 flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(topic.category)}`}>
                            {getCategoryLabel(topic.category)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <FiUser className="mr-1 h-3 w-3" />
                            {topic.author.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <FiClock className="mr-1 h-3 w-3" />
                            {formatDate(topic.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiEye className="mr-1 h-4 w-4" />
                      {topic.views}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiMessageSquare className="mr-1 h-4 w-4" />
                      {topic.replies}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiThumbsUp className="mr-1 h-4 w-4" />
                      {topic.likes}
                    </div>
                  </div>
                </div>
                {topic.last_reply && (
                  <div className="mt-2 ml-14 text-xs text-gray-500 dark:text-gray-400">
                    Last reply by <span className="font-medium">{topic.last_reply.author.name}</span> on {formatDate(topic.last_reply.created_at)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
