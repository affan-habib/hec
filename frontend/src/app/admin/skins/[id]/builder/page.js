'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import SkinBuilder from '@/components/skin-builder/SkinBuilder';
import skinService from '@/services/skinService';

const SkinBuilderPage = ({ params }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [skin, setSkin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkin = async () => {
      try {
        const response = await skinService.getById(id);

        if (response.success && response.data) {
          // Handle different response formats
          const skinData = response.data.skin || response.data;

          // Ensure theme_data is properly formatted
          if (skinData.theme_data && typeof skinData.theme_data === 'string') {
            try {
              skinData.theme_data = JSON.parse(skinData.theme_data);
            } catch (parseError) {
              console.error('Error parsing theme_data:', parseError);
              // Keep as string, the SkinBuilder component will handle it
            }
          }

          setSkin(skinData);
        } else {
          setError('Failed to load skin data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching skin:', error);
        setError('An error occurred while fetching the skin data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkin();
  }, [id]);

  const handleSave = async (themeData) => {
    try {
      // Ensure we have a valid theme_data object or string
      let formattedThemeData;

      if (typeof themeData === 'object') {
        // If it's an object, stringify it
        formattedThemeData = JSON.stringify(themeData);
      } else if (typeof themeData === 'string') {
        // If it's already a string, make sure it's valid JSON
        try {
          // Try to parse and re-stringify to ensure valid JSON
          const parsed = JSON.parse(themeData);
          formattedThemeData = JSON.stringify(parsed);
        } catch (e) {
          // If parsing fails, use as is
          formattedThemeData = themeData;
        }
      } else {
        // For any other type, convert to string
        formattedThemeData = String(themeData);
      }

      console.log('Saving theme data:', {
        id,
        themeDataType: typeof themeData,
        formattedDataType: typeof formattedThemeData,
        formattedDataLength: formattedThemeData.length
      });

      const response = await skinService.update(id, {
        theme_data: formattedThemeData
      });

      if (response.success) {
        return true;
      } else {
        setError('Failed to save skin. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error saving skin:', error);
      setError('An error occurred while saving the skin.');
      return false;
    }
  };

  const handleExit = () => {
    router.push(`/admin/skins/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/skins')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Skins
        </button>
      </div>
    );
  }

  if (!skin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skin not found</h3>
        <button
          onClick={() => router.push('/admin/skins')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Skins
        </button>
      </div>
    );
  }

  return (
    <SkinBuilder
      skin={skin}
      onSave={handleSave}
      onExit={handleExit}
    />
  );
};

export default SkinBuilderPage;
