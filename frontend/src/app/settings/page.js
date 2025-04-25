'use client';

import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <FiSettings className="mr-2" /> Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'appearance'
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400">
                General settings will be available in a future update. This is a placeholder page.
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400">
                Notification settings will be available in a future update. This is a placeholder page.
              </p>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400">
                Appearance settings will be available in a future update. This is a placeholder page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
