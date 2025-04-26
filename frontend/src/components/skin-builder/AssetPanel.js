'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiImage } from 'react-icons/fi';

const AssetPanel = ({ assets, categories, isLoading, onSelectAsset }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter assets based on category and search term
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory ? asset.category_id === parseInt(selectedCategory) : true;
    const matchesSearch = searchTerm 
      ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white">Assets</h3>
      
      {/* Search and Filter */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Assets Grid */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-600"
              >
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 dark:bg-gray-600">
                  {asset.image_url ? (
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {asset.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetPanel;
