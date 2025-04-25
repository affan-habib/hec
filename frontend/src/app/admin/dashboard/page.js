'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUsers, FiBook, FiMessageSquare, FiAward,
  FiMessageCircle, FiPackage, FiDollarSign,
  FiTrendingUp, FiBarChart2, FiPieChart, FiActivity
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnalyticsCard from '@/components/ui/AnalyticsCard';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import analyticsService from '@/services/analyticsService';

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    students: { count: 0, previousCount: 0, percentChange: 0 },
    tutors: { count: 0, previousCount: 0, percentChange: 0 },
    assets: { count: 0, previousCount: 0, percentChange: 0 },
    revenue: { amount: 0, previousAmount: 0, percentChange: 0 },
  });
  const [userGrowth, setUserGrowth] = useState(null);
  const [activityDistribution, setActivityDistribution] = useState(null);
  const [assetUsage, setAssetUsage] = useState(null);
  const [topAssets, setTopAssets] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState({
    stats: false,
    userGrowth: false,
    activityDistribution: false,
    assetUsage: false,
    topAssets: false,
    recentActivities: false
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Fetch dashboard stats
      try {
        const response = await analyticsService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError(prev => ({ ...prev, stats: true }));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(prev => ({ ...prev, stats: true }));
      }

      // Fetch user growth data
      try {
        const response = await analyticsService.getUserGrowth();
        if (response.success) {
          setUserGrowth(response.data);
        } else {
          setError(prev => ({ ...prev, userGrowth: true }));
        }
      } catch (err) {
        console.error('Error fetching user growth data:', err);
        setError(prev => ({ ...prev, userGrowth: true }));
      }

      // Fetch activity distribution data
      try {
        const response = await analyticsService.getActivityDistribution();
        if (response.success) {
          setActivityDistribution(response.data);
        } else {
          setError(prev => ({ ...prev, activityDistribution: true }));
        }
      } catch (err) {
        console.error('Error fetching activity distribution data:', err);
        setError(prev => ({ ...prev, activityDistribution: true }));
      }

      // Fetch asset usage data
      try {
        const response = await analyticsService.getAssetUsage();
        if (response.success) {
          setAssetUsage(response.data);
        } else {
          setError(prev => ({ ...prev, assetUsage: true }));
        }
      } catch (err) {
        console.error('Error fetching asset usage data:', err);
        setError(prev => ({ ...prev, assetUsage: true }));
      }

      // Fetch top assets data
      try {
        const response = await analyticsService.getTopAssets();
        if (response.success) {
          setTopAssets(response.data);
        } else {
          setError(prev => ({ ...prev, topAssets: true }));
        }
      } catch (err) {
        console.error('Error fetching top assets data:', err);
        setError(prev => ({ ...prev, topAssets: true }));
      }

      // Fetch recent activities data
      try {
        const response = await analyticsService.getRecentActivities();
        if (response.success) {
          setRecentActivities(response.data);
        } else {
          setError(prev => ({ ...prev, recentActivities: true }));
        }
      } catch (err) {
        console.error('Error fetching recent activities data:', err);
        setError(prev => ({ ...prev, recentActivities: true }));
      }

      setIsLoading(false);
    };

    fetchDashboardData();
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'asset_purchase':
        return <FiPackage className="text-indigo-500" />;
      case 'chat_message':
        return <FiMessageSquare className="text-green-500" />;
      case 'diary_entry':
        return <FiBook className="text-amber-500" />;
      case 'forum_post':
        return <FiMessageCircle className="text-pink-500" />;
      case 'award_earned':
        return <FiAward className="text-blue-500" />;
      default:
        return <FiActivity className="text-gray-500" />;
    }
  };

  const getActivityLabel = (activity) => {
    switch (activity.type) {
      case 'asset_purchase':
        return `Purchased ${activity.asset}`;
      case 'chat_message':
        return activity.message;
      case 'diary_entry':
        return `New entry in ${activity.diary}`;
      case 'forum_post':
        return `Posted in ${activity.forum}`;
      case 'award_earned':
        return `Earned ${activity.award}`;
      default:
        return 'Activity';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <AnalyticsCard
            title="Students"
            value={isLoading ? '...' : error.stats ? 'Error' : stats?.students?.count}
            previousValue={error.stats ? null : stats?.students?.previousCount}
            percentChange={error.stats ? null : stats?.students?.percentChange}
            icon={<FiUsers className="h-6 w-6" />}
            onClick={error.stats ? null : () => router.push('/students')}
            loading={isLoading}
            error={error.stats}
            onRetry={() => window.location.reload()}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Tutors"
            value={isLoading ? '...' : error.stats ? 'Error' : stats?.tutors?.count}
            previousValue={error.stats ? null : stats?.tutors?.previousCount}
            percentChange={error.stats ? null : stats?.tutors?.percentChange}
            icon={<FiUsers className="h-6 w-6" />}
            onClick={error.stats ? null : () => router.push('/tutors')}
            loading={isLoading}
            error={error.stats}
            onRetry={() => window.location.reload()}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Assets"
            value={isLoading ? '...' : error.stats ? 'Error' : stats?.assets?.count}
            previousValue={error.stats ? null : stats?.assets?.previousCount}
            percentChange={error.stats ? null : stats?.assets?.percentChange}
            icon={<FiPackage className="h-6 w-6" />}
            onClick={error.stats ? null : () => router.push('/assets')}
            loading={isLoading}
            error={error.stats}
            onRetry={() => window.location.reload()}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Revenue"
            value={isLoading ? '...' : error.stats ? 'Error' : formatCurrency(stats?.revenue?.amount)}
            previousValue={error.stats ? null : stats?.revenue?.previousAmount}
            percentChange={error.stats ? null : stats?.revenue?.percentChange}
            icon={<FiDollarSign className="h-6 w-6" />}
            loading={isLoading}
            error={error.stats}
            onRetry={() => window.location.reload()}
          />
        </motion.div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* User Growth Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            <FiTrendingUp className="inline-block mr-2 text-indigo-500" />
            User Growth
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error.userGrowth ? (
            <div className="h-64 flex items-center justify-center flex-col">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load data</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            userGrowth && <LineChart data={userGrowth} height={300} />
          )}
        </motion.div>

        {/* Activity Distribution Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            <FiPieChart className="inline-block mr-2 text-indigo-500" />
            Activity Distribution
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error.activityDistribution ? (
            <div className="h-64 flex items-center justify-center flex-col">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load data</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            activityDistribution && <PieChart data={activityDistribution} height={300} doughnut={true} />
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Asset Usage Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            <FiBarChart2 className="inline-block mr-2 text-indigo-500" />
            Asset Usage
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error.assetUsage ? (
            <div className="h-64 flex items-center justify-center flex-col">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load data</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            assetUsage && <BarChart data={assetUsage} height={300} />
          )}
        </motion.div>

        {/* Top Assets Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            <FiPackage className="inline-block mr-2 text-indigo-500" />
            Top Assets
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error.topAssets ? (
            <div className="h-64 flex items-center justify-center flex-col">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load data</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            topAssets && <BarChart data={{
              labels: topAssets.labels,
              datasets: [{
                label: 'Usage Count',
                data: topAssets.values,
                backgroundColor: topAssets.colors || '#4F46E5'
              }]
            }} height={300} horizontal={true} />
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            <FiActivity className="inline-block mr-2 text-indigo-500" />
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error.recentActivities ? (
            <div className="p-6 flex items-center justify-center flex-col">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load recent activities</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : recentActivities.length > 0 ? (
            <ul>
              {recentActivities.map((activity) => (
                <li key={activity.id} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {getActivityLabel(activity)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent activities found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
