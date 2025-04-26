'use client';

import { useState } from 'react';
import { FiPlus, FiType } from 'react-icons/fi';

const TextPanel = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [color, setColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState('left');
  
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
  
  const handleAddText = () => {
    const style = {
      fontFamily,
      fontSize,
      fontWeight,
      color,
      textAlign
    };
    
    onAddText(text || 'New Text', style);
    setText('');
  };
  
  // Quick text templates
  const textTemplates = [
    { text: 'Heading', style: { fontFamily: 'Arial', fontSize: '32px', fontWeight: 'bold', color: '#000000', textAlign: 'center' } },
    { text: 'Subheading', style: { fontFamily: 'Arial', fontSize: '24px', fontWeight: '500', color: '#333333', textAlign: 'center' } },
    { text: 'Paragraph', style: { fontFamily: 'Georgia', fontSize: '16px', fontWeight: 'normal', color: '#444444', textAlign: 'left' } },
    { text: 'Quote', style: { fontFamily: 'Georgia', fontSize: '18px', fontWeight: 'normal', color: '#666666', textAlign: 'center' } },
    { text: 'Button', style: { fontFamily: 'Arial', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white">Add Text</h3>
      
      {/* Text Input */}
      <div>
        <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Text Content
        </label>
        <div className="mt-1">
          <textarea
            id="text-content"
            name="text-content"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text content..."
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          />
        </div>
      </div>
      
      {/* Text Styling */}
      <div className="space-y-3">
        <div>
          <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Font Family
          </label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
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
            onChange={(e) => setFontSize(e.target.value)}
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
            onChange={(e) => setFontWeight(e.target.value)}
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
            onChange={(e) => setTextAlign(e.target.value)}
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
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="ml-2 flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Add Text Button */}
      <button
        type="button"
        onClick={handleAddText}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FiPlus className="-ml-1 mr-2 h-4 w-4" />
        Add Text
      </button>
      
      {/* Text Templates */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Templates</h4>
        <div className="grid grid-cols-1 gap-2">
          {textTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => onAddText(template.text, template.style)}
              className="text-left p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{
                fontFamily: template.style.fontFamily,
                fontWeight: template.style.fontWeight,
                color: template.style.color,
                textAlign: template.style.textAlign
              }}
            >
              <span style={{ fontSize: template.style.fontSize }}>{template.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
