'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUsers, FiBook, FiMessageSquare,
  FiAward, FiMessageCircle, FiImage
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import StatsCard from '@/components/ui/StatsCard';
import { api } from '@/services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: { count: 0, loading: true },
    tutors: { count: 0, loading: true },
    diaries: { count: 0, loading: true },
    chats: { count: 0, loading: true },
    awards: { count: 0, loading: true },
    forums: { count: 0, loading: true },
  });
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Helper function to safely extract count from different response formats
        const getCount = (response) => {
          if (response?.data?.data?.pagination?.total !== undefined) {
            return response.data.data.pagination.total;
          } else if (response?.data?.pagination?.total !== undefined) {
            return response.data.pagination.total;
          } else if (Array.isArray(response?.data?.data)) {
            return response.data.data.length;
          } else if (Array.isArray(response?.data)) {
            return response.data.length;
          } else {
            return 0;
          }
        };

        // Fetch students count
        const studentsResponse = await api.get('/students', { params: { limit: 1 } });

        // Fetch tutors count
        const tutorsResponse = await api.get('/tutors', { params: { limit: 1 } });

        // Fetch diaries count
        const diariesResponse = await api.get('/diaries', { params: { limit: 1 } });

        // Fetch chats count
        const chatsResponse = await api.get('/chats', { params: { limit: 1 } });

        // Fetch awards count
        const awardsResponse = await api.get('/awards', { params: { limit: 1 } });

        // Fetch forums count
        const forumsResponse = await api.get('/forums', { params: { limit: 1 } });

        setStats({
          students: {
            count: getCount(studentsResponse),
            loading: false
          },
          tutors: {
            count: getCount(tutorsResponse),
            loading: false
          },
          diaries: {
            count: getCount(diariesResponse),
            loading: false
          },
          chats: {
            count: getCount(chatsResponse),
            loading: false
          },
          awards: {
            count: getCount(awardsResponse),
            loading: false
          },
          forums: {
            count: getCount(forumsResponse),
            loading: false
          },
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set loading to false for all stats
        setStats(prevStats => {
          const newStats = { ...prevStats };
          Object.keys(newStats).forEach(key => {
            newStats[key].loading = false;
          });
          return newStats;
        });
      }
    };

    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <StatsCard
            title="Students"
            value={stats.students.loading ? 'Loading...' : stats.students.count}
            icon={<FiUsers className="h-6 w-6 text-white" />}
            onClick={() => router.push('/students')}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatsCard
            title="Tutors"
            value={stats.tutors.loading ? 'Loading...' : stats.tutors.count}
            icon={<FiUsers className="h-6 w-6 text-white" />}
            onClick={() => router.push('/tutors')}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatsCard
            title="Diaries"
            value={stats.diaries.loading ? 'Loading...' : stats.diaries.count}
            icon={<FiBook className="h-6 w-6 text-white" />}
            onClick={() => router.push('/diaries')}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatsCard
            title="Chats"
            value={stats.chats.loading ? 'Loading...' : stats.chats.count}
            icon={<FiMessageSquare className="h-6 w-6 text-white" />}
            onClick={() => router.push('/chats')}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatsCard
            title="Awards"
            value={stats.awards.loading ? 'Loading...' : stats.awards.count}
            icon={<FiAward className="h-6 w-6 text-white" />}
            onClick={() => router.push('/awards')}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatsCard
            title="Forums"
            value={stats.forums.loading ? 'Loading...' : stats.forums.count}
            icon={<FiMessageCircle className="h-6 w-6 text-white" />}
            onClick={() => router.push('/forums')}
          />
        </motion.div>
      </motion.div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      Activity {item}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        New
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiUsers className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        User {item}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <p>
                        {new Date(Date.now() - item * 3600000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
