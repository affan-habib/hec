'use client';

import { useState, useEffect } from 'react';
import { FiTrash2, FiMove, FiMaximize, FiRotateCw, FiLayers, FiImage, FiType } from 'react-icons/fi';

const PropertyPanel = ({ selectedElement, onUpdateElement, onUpdateBackground, background, onDeleteElement }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  const [zIndex, setZIndex] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState('');
  
  // Text-specific properties
  const [textContent, setTextContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16px');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textColor, setTextColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState('left');
  
  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setPosition(selectedElement.position || { x: 0, y: 0 });
      setSize(selectedElement.size || { width: 100, height: 100 });
      setRotation(selectedElement.rotation || 0);
      setZIndex(selectedElement.zIndex || 1);
      
      if (selectedElement.type === 'text') {
        setTextContent(selectedElement.content || '');
        setFontFamily(selectedElement.style?.fontFamily || 'Arial');
        setFontSize(selectedElement.style?.fontSize || '16px');
        setFontWeight(selectedElement.style?.fontWeight || 'normal');
        setTextColor(selectedElement.style?.color || '#000000');
        setTextAlign(selectedElement.style?.textAlign || 'left');
      }
    }
  }, [selectedElement]);
  
  // Update background state
  useEffect(() => {
    if (background) {
      setBgColor(background.color || '#ffffff');
      setBgImage(background.image || '');
    }
  }, [background]);
  
  // Handle position change
  const handlePositionChange = (axis, value) => {
    const newPosition = { ...position, [axis]: parseInt(value) || 0 };
    setPosition(newPosition);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { position: newPosition });
    }
  };
  
  // Handle size change
  const handleSizeChange = (dimension, value) => {
    const newSize = { ...size, [dimension]: parseInt(value) || 0 };
    setSize(newSize);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { size: newSize });
    }
  };
  
  // Handle rotation change
  const handleRotationChange = (value) => {
    const newRotation = parseInt(value) || 0;
    setRotation(newRotation);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { rotation: newRotation });
    }
  };
  
  // Handle z-index change
  const handleZIndexChange = (value) => {
    const newZIndex = parseInt(value) || 1;
    setZIndex(newZIndex);
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { zIndex: newZIndex });
    }
  };
  
  // Handle text content change
  const handleTextContentChange = (value) => {
    setTextContent(value);
    if (selectedElement && selectedElement.type === 'text') {
      onUpdateElement(selectedElement.id, { content: value });
    }
  };
  
  // Handle text style change
  const handleTextStyleChange = (property, value) => {
    const newStyle = { ...(selectedElement?.style || {}), [property]: value };
    
    // Update local state based on property
    switch (property) {
      case 'fontFamily':
        setFontFamily(value);
        break;
      case 'fontSize':
        setFontSize(value);
        break;
      case 'fontWeight':
        setFontWeight(value);
        break;
      case 'color':
        setTextColor(value);
        break;
      case 'textAlign':
        setTextAlign(value);
        break;
      default:
        break;
    }
    
    if (selectedElement && selectedElement.type === 'text') {
      onUpdateElement(selectedElement.id, { style: newStyle });
    }
  };
  
  // Handle background color change
  const handleBgColorChange = (value) => {
    setBgColor(value);
    onUpdateBackground({ color: value });
  };
  
  // Handle background image change
  const handleBgImageChange = (value) => {
    setBgImage(value);
    onUpdateBackground({ image: value });
  };
  
  const fontFamilies = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Tahoma',
    'Trebuchet MS',
    'Impact'
  ];
  
  const fontSizes = [
    '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px', '64px', '72px'
  ];
  
  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '100', label: 'Thin' },
    { value: '300', label: 'Light' },
    { value: '500', label: 'Medium' },
    { value: '700', label: 'Bold' },
    { value: '900', label: 'Black' }
  ];
  
  const textAlignOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];
  
  // If no element is selected, show background properties
  if (!selectedElement) {
    return (
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white">Background Properties</h3>
        
        <div>
          <label htmlFor="bg-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="color"
              id="bg-color"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="h-8 w-8 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="ml-2 flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="bg-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Image URL
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="bg-image"
              value={bgImage}
              onChange={(e) => handleBgImageChange(e.target.value)}
              placeholder="Enter image URL..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for no background image
          </p>
        </div>
        
        {bgImage && (
          <div className="mt-2">
            <button
              onClick={() => handleBgImageChange('')}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FiTrash2 className="mr-1 h-3 w-3" />
              Remove Image
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-900 dark:text-white">
          {selectedElement.type === 'image' ? 'Image Properties' : 'Text Properties'}
        </h3>
        <button
          onClick={onDeleteElement}
          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FiTrash2 className="mr-1 h-3 w-3" />
          Delete
        </button>
      </div>
      
      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
          <FiMove className="mr-1 h-4 w-4" />
          Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="position-x" className="block text-xs text-gray-500 dark:text-gray-400">
              X
            </label>
            <input
              type="number"
              id="position-x"
              value={position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          <div>
            <label htmlFor="position-y" className="block text-xs text-gray-500 dark:text-gray-400">
              Y
            </label>
            <input
              type="number"
              id="position-y"
              value={position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
          <FiMaximize className="mr-1 h-4 w-4" />
          Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="size-width" className="block text-xs text-gray-500 dark:text-gray-400">
              Width
            </label>
            <input
              type="number"
              id="size-width"
              value={size.width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          <div>
            <label htmlFor="size-height" className="block text-xs text-gray-500 dark:text-gray-400">
              Height
            </label>
            <input
              type="number"
              id="size-height"
              value={size.height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Rotation */}
      <div>
        <label htmlFor="rotation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
          <FiRotateCw className="mr-1 h-4 w-4" />
          Rotation (degrees)
        </label>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => handleRotationChange(e.target.value)}
          className="mt-1 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">0°</span>
          <input
            type="number"
            value={rotation}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="w-16 text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">360°</span>
        </div>
      </div>
      
      {/* Z-Index */}
      <div>
        <label htmlFor="z-index" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
          <FiLayers className="mr-1 h-4 w-4" />
          Layer (Z-Index)
        </label>
        <input
          type="number"
          id="z-index"
          min="1"
          value={zIndex}
          onChange={(e) => handleZIndexChange(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Higher values appear on top
        </p>
      </div>
      
      {/* Text-specific properties */}
      {selectedElement.type === 'text' && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiType className="mr-1 h-4 w-4" />
              Text Properties
            </h4>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content
                </label>
                <textarea
                  id="text-content"
                  rows={2}
                  value={textContent}
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Family
                </label>
                <select
                  id="font-family"
                  value={fontFamily}
                  onChange={(e) => handleTextStyleChange('fontFamily', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Size
                </label>
                <select
                  id="font-size"
                  value={fontSize}
                  onChange={(e) => handleTextStyleChange('fontSize', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="font-weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Weight
                </label>
                <select
                  id="font-weight"
                  value={fontWeight}
                  onChange={(e) => handleTextStyleChange('fontWeight', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {fontWeights.map((weight) => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="text-align" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Align
                </label>
                <select
                  id="text-align"
                  value={textAlign}
                  onChange={(e) => handleTextStyleChange('textAlign', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {textAlignOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="text-color"
                    value={textColor}
                    onChange={(e) => handleTextStyleChange('color', e.target.value)}
                    className="h-8 w-8 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleTextStyleChange('color', e.target.value)}
                    className="ml-2 flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Image-specific properties */}
      {selectedElement.type === 'image' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FiImage className="mr-1 h-4 w-4" />
            Image Properties
          </h4>
          
          <div className="mt-2">
            <img
              src={selectedElement.src}
              alt={selectedElement.alt || 'Selected image'}
              className="w-full h-auto rounded-md border border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {selectedElement.alt || 'No alt text provided'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
