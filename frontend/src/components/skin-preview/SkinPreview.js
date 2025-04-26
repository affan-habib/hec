'use client';

import React, { useState, useEffect } from 'react';

const SkinPreview = ({ themeData, width = '100%', height = '100%', scale = 1 }) => {
  const [parsedThemeData, setParsedThemeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Parse theme data if it's a string
      if (typeof themeData === 'string') {
        try {
          setParsedThemeData(JSON.parse(themeData));
        } catch (e) {
          console.error('Error parsing theme data:', e);
          setError('Invalid theme data format');
        }
      } else if (typeof themeData === 'object' && themeData !== null) {
        setParsedThemeData(themeData);
      } else {
        setError('No theme data available');
      }
    } catch (error) {
      console.error('Error processing theme data:', error);
      setError('Error processing theme data');
    }
  }, [themeData]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!parsedThemeData) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Loading preview...</p>
      </div>
    );
  }

  // Check if we have the builder format (with elements, dimensions, background)
  // or the simple CSS properties format
  const isBuilderFormat = parsedThemeData.elements || parsedThemeData.dimensions || parsedThemeData.background;

  if (isBuilderFormat) {
    // Get dimensions and background from theme data (builder format)
    const dimensions = parsedThemeData.dimensions || { width: 800, height: 600 };
    const background = parsedThemeData.background || { color: '#ffffff', image: null };
    const elements = parsedThemeData.elements || [];

    return (
      <div className="relative overflow-hidden rounded-lg" style={{ width, height }}>
        <div
          className="absolute"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            backgroundColor: background.color || '#ffffff',
            backgroundImage: background.image ? `url(${background.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Render elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation || 0}deg)`,
                zIndex: element.zIndex || 1,
              }}
            >
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt={element.alt || 'Image'}
                  className="w-full h-full object-contain"
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
        </div>
      </div>
    );
  } else {
    // Handle the CSS properties format (simple key-value pairs)
    // Create a preview of the theme using the CSS properties
    return (
      <div className="relative overflow-hidden rounded-lg" style={{ width, height }}>
        <div
          className="w-full h-full p-6 flex flex-col"
          style={{
            backgroundColor: parsedThemeData.backgroundColor || '#ffffff',
            color: parsedThemeData.textColor || '#000000',
            fontFamily: parsedThemeData.fontFamily || 'Arial, sans-serif',
            boxShadow: parsedThemeData.boxShadow || 'none',
            borderRadius: parsedThemeData.borderRadius || '0px',
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{
              color: parsedThemeData.headingColor || parsedThemeData.textColor || '#000000',
            }}
          >
            Theme Preview
          </h2>

          <p className="mb-4">
            This is a preview of how text will appear with this theme.
          </p>

          <button
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: parsedThemeData.accentColor || '#3498db',
              color: '#ffffff',
              borderRadius: parsedThemeData.borderRadius || '0px',
              boxShadow: parsedThemeData.boxShadow || 'none',
            }}
          >
            Sample Button
          </button>

          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: parsedThemeData.borderRadius || '0px',
            }}
          >
            <p>Sample content block</p>
          </div>
        </div>
      </div>
    );
  }
};

export default SkinPreview;
