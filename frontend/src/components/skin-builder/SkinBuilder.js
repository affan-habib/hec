'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { FiSave, FiX, FiPlus, FiImage, FiType, FiLayers, FiSettings, FiTrash2 } from 'react-icons/fi';
import AssetPanel from './AssetPanel';
import PropertyPanel from './PropertyPanel';
import TextPanel from './TextPanel';
import assetService from '@/services/assetService';
import assetCategoryService from '@/services/assetCategoryService';

const SkinBuilder = ({ skin, onSave, onExit }) => {
  // Parse theme_data if it's a string, or use default structure if not available
  const parseThemeData = () => {
    const defaultThemeData = {
      version: 1,
      elements: [],
      background: {
        color: '#ffffff',
        image: null
      },
      dimensions: {
        width: 800,
        height: 600
      }
    };

    if (!skin || !skin.theme_data) {
      return defaultThemeData;
    }

    // If theme_data is a string, try to parse it
    if (typeof skin.theme_data === 'string') {
      try {
        return JSON.parse(skin.theme_data);
      } catch (error) {
        console.error('Error parsing theme_data:', error);
        return defaultThemeData;
      }
    }

    // If theme_data is already an object, ensure it has all required properties
    const themeData = skin.theme_data;

    return {
      version: themeData.version || 1,
      elements: Array.isArray(themeData.elements) ? themeData.elements : [],
      background: {
        color: themeData.background?.color || '#ffffff',
        image: themeData.background?.image || null
      },
      dimensions: {
        width: themeData.dimensions?.width || 800,
        height: themeData.dimensions?.height || 600
      }
    };
  };

  const [themeData, setThemeData] = useState(parseThemeData());

  const [selectedElement, setSelectedElement] = useState(null);
  const [activePanel, setActivePanel] = useState('assets'); // 'assets', 'text', 'properties'
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const canvasRef = useRef(null);
  const moveableRef = useRef(null);
  const selectoRef = useRef(null);
  const elementsRef = useRef([]);

  // Load assets and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await assetCategoryService.getAll({ is_active: true });
        if (categoriesResponse.success && categoriesResponse.data && categoriesResponse.data.categories) {
          setCategories(categoriesResponse.data.categories);
        }

        // Fetch assets
        const assetsResponse = await assetService.getAll({ is_active: true, limit: 100 });
        if (assetsResponse.success && assetsResponse.data && assetsResponse.data.assets) {
          setAssets(assetsResponse.data.assets);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load assets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize elements from theme data
  useEffect(() => {
    if (themeData && themeData.elements) {
      elementsRef.current = themeData.elements.map((element) => ({
        ...element,
        ref: React.createRef()
      }));
    }
  }, [themeData]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const success = await onSave(themeData);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving skin:', error);
      setError('Failed to save skin. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new image element
  const handleAddImage = (asset) => {
    const newElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      src: asset.image_url,
      alt: asset.name,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      rotation: 0,
      zIndex: (themeData?.elements?.length || 0) + 1,
      assetId: asset.id
    };

    setThemeData({
      ...themeData,
      elements: [...(themeData?.elements || []), newElement]
    });

    setSelectedElement(newElement);
  };

  // Add a new text element
  const handleAddText = (text, style) => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: text || 'New Text',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      rotation: 0,
      zIndex: (themeData?.elements?.length || 0) + 1,
      style: style || {
        fontFamily: 'Arial',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
      }
    };

    setThemeData({
      ...themeData,
      elements: [...(themeData?.elements || []), newElement]
    });

    setSelectedElement(newElement);
  };

  // Update element properties
  const handleUpdateElement = (id, properties) => {
    setThemeData({
      ...themeData,
      elements: (themeData?.elements || []).map(element =>
        element.id === id ? { ...element, ...properties } : element
      )
    });

    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...properties });
    }
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElement) return;

    setThemeData({
      ...themeData,
      elements: (themeData?.elements || []).filter(element => element.id !== selectedElement.id)
    });

    setSelectedElement(null);
  };

  // Update background
  const handleUpdateBackground = (background) => {
    setThemeData({
      ...themeData,
      background: { ...(themeData?.background || {}), ...background }
    });
  };

  // Handle element selection
  const handleSelectElement = (elementId) => {
    const element = (themeData?.elements || []).find(el => el.id === elementId);
    setSelectedElement(element || null);

    if (element) {
      setActivePanel('properties');
    }
  };

  // Handle element movement
  const handleElementMove = (id, delta) => {
    const element = (themeData?.elements || []).find(el => el.id === id);
    if (!element) return;

    const newPosition = {
      x: element.position.x + delta.x,
      y: element.position.y + delta.y
    };

    handleUpdateElement(id, { position: newPosition });
  };

  // Handle element resize
  const handleElementResize = (id, size) => {
    handleUpdateElement(id, { size });
  };

  // Handle element rotation
  const handleElementRotate = (id, rotation) => {
    handleUpdateElement(id, { rotation });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md z-10 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skin Builder</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{skin?.name || 'New Skin'}</p>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activePanel === 'assets'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActivePanel('assets')}
          >
            <div className="flex flex-col items-center">
              <FiImage className="h-5 w-5 mb-1" />
              <span>Assets</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activePanel === 'text'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActivePanel('text')}
          >
            <div className="flex flex-col items-center">
              <FiType className="h-5 w-5 mb-1" />
              <span>Text</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activePanel === 'properties'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActivePanel('properties')}
          >
            <div className="flex flex-col items-center">
              <FiSettings className="h-5 w-5 mb-1" />
              <span>Properties</span>
            </div>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'assets' && (
            <AssetPanel
              assets={assets}
              categories={categories}
              isLoading={isLoading}
              onSelectAsset={handleAddImage}
            />
          )}

          {activePanel === 'text' && (
            <TextPanel onAddText={handleAddText} />
          )}

          {activePanel === 'properties' && (
            <PropertyPanel
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onUpdateBackground={handleUpdateBackground}
              background={themeData?.background || { color: '#ffffff', image: null }}
              onDeleteElement={handleDeleteElement}
            />
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="-ml-1 mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={onExit}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiX className="-ml-1 mr-2 h-4 w-4" />
              Exit
            </button>
          </div>

          {saveSuccess && (
            <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400">
              Skin saved successfully!
            </div>
          )}

          {error && (
            <div className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div
          ref={canvasRef}
          className="relative bg-white shadow-lg"
          style={{
            width: `${themeData?.dimensions?.width || 800}px`,
            height: `${themeData?.dimensions?.height || 600}px`,
            backgroundColor: themeData?.background?.color || '#ffffff',
            backgroundImage: themeData?.background?.image ? `url(${themeData.background.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Render elements */}
          {(themeData?.elements || []).map((element) => (
            <div
              key={element.id}
              className="absolute"
              data-element-id={element.id}
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation || 0}deg)`,
                zIndex: element.zIndex || 1,
                cursor: 'move',
                border: selectedElement && selectedElement.id === element.id ? '2px dashed #3b82f6' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectElement(element.id);
              }}
            >
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt={element.alt || 'Image'}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              )}

              {element.type === 'text' && (
                <div
                  className="w-full h-full overflow-hidden"
                  style={{
                    fontFamily: element.style?.fontFamily || 'Arial',
                    fontSize: element.style?.fontSize || '16px',
                    fontWeight: element.style?.fontWeight || 'normal',
                    color: element.style?.color || '#000000',
                    textAlign: element.style?.textAlign || 'left',
                    lineHeight: element.style?.lineHeight || 'normal',
                    padding: '4px'
                  }}
                >
                  {element.content}
                </div>
              )}
            </div>
          ))}

          {/* Moveable for drag, resize, rotate */}
          {selectedElement && (
            <Moveable
              ref={moveableRef}
              target={document.querySelector(`[data-element-id="${selectedElement.id}"]`)}
              container={canvasRef.current}
              draggable={true}
              resizable={true}
              rotatable={true}
              snappable={true}
              snapCenter={true}
              bounds={{ left: 0, top: 0, right: themeData?.dimensions?.width || 800, bottom: themeData?.dimensions?.height || 600 }}
              onDrag={({ target, delta }) => {
                handleElementMove(selectedElement.id, delta);
              }}
              onResize={({ target, width, height }) => {
                handleElementResize(selectedElement.id, { width, height });
                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
              }}
              onRotate={({ target, rotate }) => {
                handleElementRotate(selectedElement.id, rotate);
                target.style.transform = `rotate(${rotate}deg)`;
              }}
            />
          )}

          {/* Selecto for multiple selection (future enhancement) */}
          <Selecto
            ref={selectoRef}
            container={canvasRef.current}
            selectableTargets={['.absolute']}
            selectByClick={true}
            selectFromInside={false}
            toggleContinueSelect={['shift']}
            preventDefault={true}
            onSelect={({ selected }) => {
              if (selected.length > 0) {
                const elementId = selected[0].getAttribute('data-element-id');
                handleSelectElement(elementId);
              } else {
                setSelectedElement(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkinBuilder;
