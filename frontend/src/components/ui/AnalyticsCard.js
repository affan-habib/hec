'use client';

import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

const AnalyticsCard = ({
  title,
  value,
  previousValue,
  percentChange,
  icon,
  onClick,
  loading = false,
  error = false,
  onRetry,
  className = '',
}) => {
  // Calculate percent change if not provided but previous value is available
  if (previousValue !== undefined && percentChange === undefined && !loading && !error) {
    if (previousValue === 0) {
      percentChange = value > 0 ? 100 : 0;
    } else {
      percentChange = ((value - previousValue) / previousValue) * 100;
    }
  }

  // Determine if change is positive, negative, or neutral
  let changeType = 'neutral';
  if (percentChange > 0) {
    changeType = 'positive';
  } else if (percentChange < 0) {
    changeType = 'negative';
  }

  // Format percent change for display
  const formattedPercentChange = percentChange !== undefined && !error
    ? `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`
    : null;

  const handleClick = (e) => {
    if (error && onRetry) {
      e.stopPropagation();
      onRetry();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className} ${
        (onClick || (error && onRetry)) ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-12 w-12 rounded-md ${
              error ? 'bg-red-500' : 'bg-indigo-500'
            } text-white`}>
              {error ? <FiRefreshCw className="h-6 w-6" /> : icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                {error ? (
                  <div className="text-lg font-medium text-red-500 dark:text-red-400">
                    Failed to load data
                  </div>
                ) : (
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {loading ? (
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      value
                    )}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/30 px-5 py-3">
          <div className="text-sm text-center">
            <span className="font-medium text-red-600 dark:text-red-400">
              Click to retry
            </span>
          </div>
        </div>
      ) : formattedPercentChange && (
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                changeType === 'positive'
                  ? 'text-green-600 dark:text-green-400'
                  : changeType === 'negative'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {formattedPercentChange}{' '}
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> from previous period</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsCard;
