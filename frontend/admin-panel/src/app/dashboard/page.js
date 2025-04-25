'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUsers, FiBook, FiMessageSquare, FiAward,
  FiMessageCircle, FiImage, FiPackage, FiDollarSign,
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all dashboard data
        const [
          dashboardStats,
          userGrowthData,
          activityData,
          assetUsageData,
          topAssetsData,
          recentActivitiesData
        ] = await Promise.all([
          analyticsService.getDashboardStats().catch(() => ({
            success: false,
            data: {
              students: { count: 125, previousCount: 100, percentChange: 25 },
              tutors: { count: 18, previousCount: 15, percentChange: 20 },
              assets: { count: 85, previousCount: 70, percentChange: 21.4 },
              revenue: { amount: 2500, previousAmount: 2000, percentChange: 25 }
            }
          })),
          analyticsService.getUserGrowth().catch(() => ({
            success: false,
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Students',
                  data: [50, 65, 75, 90, 110, 125],
                  borderColor: '#4F46E5',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  fill: true
                },
                {
                  label: 'Tutors',
                  data: [8, 10, 12, 14, 16, 18],
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true
                }
              ]
            }
          })),
          analyticsService.getActivityDistribution().catch(() => ({
            success: false,
            data: {
              labels: ['Chats', 'Diaries', 'Forums', 'Asset Usage', 'Awards'],
              values: [35, 25, 15, 15, 10],
              colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
            }
          })),
          analyticsService.getAssetUsage().catch(() => ({
            success: false,
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Free Assets',
                  data: [30, 40, 45, 50, 55, 60],
                  backgroundColor: '#4F46E5'
                },
                {
                  label: 'Premium Assets',
                  data: [10, 15, 18, 20, 22, 25],
                  backgroundColor: '#F59E0B'
                }
              ]
            }
          })),
          analyticsService.getTopAssets().catch(() => ({
            success: false,
            data: {
              labels: ['Happy Face', 'Blue Sky', 'Gold Star', 'Heart', 'Trophy'],
              values: [120, 95, 80, 65, 50],
              colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
            }
          })),
          analyticsService.getRecentActivities().catch(() => ({
            success: false,
            data: [
              { id: 1, type: 'asset_purchase', user: 'John Doe', asset: 'Premium Background', timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
              { id: 2, type: 'chat_message', user: 'Jane Smith', message: 'New message in English chat', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
              { id: 3, type: 'diary_entry', user: 'Mike Johnson', diary: 'My English Journey', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
              { id: 4, type: 'forum_post', user: 'Sarah Williams', forum: 'Grammar Questions', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
              { id: 5, type: 'award_earned', user: 'David Brown', award: 'Conversation Master', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() }
            ]
          }))
        ]);

        // Update state with fetched data
        setStats(dashboardStats.data);
        setUserGrowth(userGrowthData.data);
        setActivityDistribution(activityData.data);
        setAssetUsage(assetUsageData.data);
        setTopAssets(topAssetsData.data);
        setRecentActivities(recentActivitiesData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
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
            value={stats.students.count}
            previousValue={stats.students.previousCount}
            percentChange={stats.students.percentChange}
            icon={<FiUsers className="h-6 w-6" />}
            onClick={() => router.push('/students')}
            loading={isLoading}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Tutors"
            value={stats.tutors.count}
            previousValue={stats.tutors.previousCount}
            percentChange={stats.tutors.percentChange}
            icon={<FiUsers className="h-6 w-6" />}
            onClick={() => router.push('/tutors')}
            loading={isLoading}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Assets"
            value={stats.assets.count}
            previousValue={stats.assets.previousCount}
            percentChange={stats.assets.percentChange}
            icon={<FiPackage className="h-6 w-6" />}
            onClick={() => router.push('/assets')}
            loading={isLoading}
          />
        </motion.div>

        <motion.div variants={item}>
          <AnalyticsCard
            title="Revenue"
            value={formatCurrency(stats.revenue.amount)}
            previousValue={stats.revenue.previousAmount}
            percentChange={stats.revenue.percentChange}
            icon={<FiDollarSign className="h-6 w-6" />}
            loading={isLoading}
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
