import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReaderProps {
  title: string;
  content: string;
  onClose: () => void;
  isLoading?: boolean;
}

import { useReaderSettings } from '../contexts/ReaderSettingsContext';
import { useTheme } from '../contexts/ThemeContext';

const Reader: React.FC<ReaderProps> = ({ title, content, onClose, isLoading }) => {
  const { settings } = useReaderSettings();
  const { theme } = useTheme();

  const getThemeColors = () => {
    // Use app's theme instead of reader settings theme
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-black',
          text: 'text-white',
          border: 'border-gray-800',
          secondary: 'text-gray-400'
        };
      case 'sepia':
        return {
          bg: 'bg-[#faf4e8]',
          text: 'text-gray-900',
          border: 'border-[#e0d5b7]',
          secondary: 'text-gray-600'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          border: 'border-gray-100',
          secondary: 'text-gray-600'
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className={`fixed inset-0 ${themeColors.bg} z-50 overflow-y-auto animate-fadeIn`}>
      {/* Header */}
      <div className={`sticky top-0 ${themeColors.bg} py-3 px-4 flex items-center justify-between ${themeColors.border} border-b z-10 backdrop-blur-lg bg-opacity-80`}>
        <h1 className={`text-lg font-medium ${themeColors.text} truncate max-w-[70%]`}>{title}</h1>
        <div className="flex items-center gap-3">
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 text-sm ${themeColors.secondary} hover:text-blue-400 transition-colors flex items-center gap-1`}
          >
            Wikipedia ↗
          </a>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full hover:bg-gray-100/10 transition-colors`}
          >
            <X size={20} className={themeColors.text} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="animate-pulse space-y-4 mt-8">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
          </div>
        ) : (
          <article className="py-8">
            <style>{`
              .content {
                font-family: ${settings.fontFamily || 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'};
                font-size: ${settings.fontSize || '18px'};
                line-height: ${settings.lineHeight || '1.8'};
                color: ${theme === 'dark' ? '#e5e7eb' : '#1a1a1a'};
                background-color: ${theme === 'dark' ? '#111827' : 'transparent'};
              }
              .content p {
                margin-bottom: 1.8em;
                letter-spacing: -0.003em;
              }
              .content h2 {
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 1.75em;
                font-weight: 600;
                margin-top: 2em;
                margin-bottom: 0.8em;
                letter-spacing: -0.02em;
                color: ${theme === 'dark' ? '#f3f4f6' : '#000'};
              }
              .content img {
                max-width: min(100%, 800px);
                width: 100%;
                height: auto;
                aspect-ratio: auto;
                margin: 2em auto;
                border-radius: 12px;
                display: block;
                object-fit: contain;
                filter: ${theme === 'dark' ? 'brightness(0.85) contrast(1.1)' : 'none'};
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .content a {
                color: ${theme === 'dark' ? '#93c5fd' : '#3b82f6'};
                text-decoration: none;
                transition: all 0.2s;
              }
              .content a:hover {
                color: ${theme === 'dark' ? '#bfdbfe' : '#60a5fa'};
              }
              .content ul, .content ol {
                padding-left: 1.5em;
                margin-bottom: 1.8em;
              }
              .content li {
                margin-bottom: 0.8em;
              }
              .content blockquote {
                margin: 2em 0;
                padding: 1em 1.5em;
                border-left: 4px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
                background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
                border-radius: 0 8px 8px 0;
                font-style: italic;
                color: ${theme === 'dark' ? '#d1d5db' : 'inherit'};
              }
              .content table {
                width: 100%;
                margin: 2em 0;
                border-collapse: collapse;
              }
              .content th, .content td {
                padding: 0.75em;
                border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
              }
              .content th {
                background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
                color: ${theme === 'dark' ? '#f3f4f6' : 'inherit'};
              }
            `}</style>
            <div 
              className="content"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </article>
        )}
      </div>
    </div>
  );
};

export default Reader;