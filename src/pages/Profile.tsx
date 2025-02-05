import React, { useState, useEffect } from 'react';
import { Settings, Grid, Bookmark, Heart, Sun, Moon, Globe2, Info, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { isAuthenticated, showAuthModal, setShowAuthModal } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Load bookmarked articles from localStorage
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
      setBookmarkedArticles(bookmarks);

      // Load liked articles from localStorage
      const likes = JSON.parse(localStorage.getItem('likedArticles') || '[]');
      setLikedArticles(likes);
    }
  }, [isAuthenticated]);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleLogout = () => {
    // In a real app, implement logout logic here
    console.log('Logging out...');
  };

  const handleWikipediaLogin = () => {
    // Implement Wikipedia OAuth login
    window.location.href = 'https://meta.wikimedia.org/w/rest.php/oauth2/authorize';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-black dark:text-white">
            {isAuthenticated ? '@username' : 'Profile'}
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Settings size={24} className="text-black dark:text-white" />
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-black" />}
                  <span className="text-black dark:text-white">Dark Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Globe2 size={20} className="text-black dark:text-white" />
                  <span className="text-black dark:text-white">Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-200 dark:bg-gray-800 rounded-md px-2 py-1 text-sm max-h-40 w-40 text-ellipsis text-black dark:text-white"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="ru">Русский</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wikipedia OAuth Login Section */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
            <p className="text-black dark:text-white mb-4">Sign in with your Wikipedia account to access your profile</p>
            <button
              onClick={handleWikipediaLogin}
              className="bg-[#36c] hover:bg-[#447ff5] text-white px-6 py-2 rounded-full transition-colors flex items-center justify-center gap-2 w-full"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/32px-Wikipedia-logo-v2.svg.png"
                alt="Wikipedia Logo"
                className="w-5 h-5"
              />
              Continue with Wikipedia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;