'use client';

import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, change, changeType, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                changeType === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : changeType === 'decrease'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''}{' '}
              {change}
            </span>{' '}
            <span className="text-gray-500 dark:text-gray-400">from previous period</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
