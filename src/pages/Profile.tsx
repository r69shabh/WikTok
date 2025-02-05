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
                  {theme === 'dark' ? 
                    <Moon size={20} className="text-gray-800 dark:text-white" /> : 
                    <Sun size={20} className="text-gray-800 dark:text-white" />
                  }
                  <span className="text-gray-800 dark:text-white">Dark Mode</span>
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
                  <Globe2 size={20} className="text-gray-800 dark:text-white" />
                  <span className="text-gray-800 dark:text-white">Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-200 dark:bg-gray-800 rounded-md px-2 py-1 text-sm max-h-40 w-40 text-ellipsis text-black dark:text-white"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <option value="af">Afrikaans</option>
                  <option value="sq">Albanian - Shqip</option>
                  <option value="am">Amharic - አማርኛ</option>
                  <option value="ar">Arabic - العربية</option>
                  <option value="hy">Armenian - Հայերեն</option>
                  <option value="az">Azerbaijani - Azərbaycan</option>
                  <option value="eu">Basque - Euskara</option>
                  <option value="be">Belarusian - Беларуская</option>
                  <option value="bn">Bengali - বাংলা</option>
                  <option value="bs">Bosnian - Bosanski</option>
                  <option value="bg">Bulgarian - Български</option>
                  <option value="my">Burmese - မြန်မာဘာသာ</option>
                  <option value="ca">Catalan - Català</option>
                  <option value="ceb">Cebuano</option>
                  <option value="zh">Chinese - 中文</option>
                  <option value="hr">Croatian - Hrvatski</option>
                  <option value="cs">Czech - Čeština</option>
                  <option value="da">Danish - Dansk</option>
                  <option value="nl">Dutch - Nederlands</option>
                  <option value="en">English</option>
                  <option value="eo">Esperanto</option>
                  <option value="et">Estonian - Eesti</option>
                  <option value="fi">Finnish - Suomi</option>
                  <option value="fr">French - Français</option>
                  <option value="gl">Galician - Galego</option>
                  <option value="ka">Georgian - ქართული</option>
                  <option value="de">German - Deutsch</option>
                  <option value="el">Greek - Ελληνικά</option>
                  <option value="gu">Gujarati - ગુજરાતી</option>
                  <option value="ht">Haitian Creole</option>
                  <option value="he">Hebrew - עברית</option>
                  <option value="hi">Hindi - हिन्दी</option>
                  <option value="hu">Hungarian - Magyar</option>
                  <option value="is">Icelandic - Íslenska</option>
                  <option value="id">Indonesian - Bahasa Indonesia</option>
                  <option value="ga">Irish - Gaeilge</option>
                  <option value="it">Italian - Italiano</option>
                  <option value="ja">Japanese - 日本語</option>
                  <option value="jv">Javanese - Basa Jawa</option>
                  <option value="kn">Kannada - ಕನ್ನಡ</option>
                  <option value="kk">Kazakh - Қазақша</option>
                  <option value="km">Khmer - ភាសាខ្មែរ</option>
                  <option value="ko">Korean - 한국어</option>
                  <option value="ku">Kurdish - Kurdî</option>
                  <option value="ky">Kyrgyz - Кыргызча</option>
                  <option value="lo">Lao - ລາວ</option>
                  <option value="la">Latin - Latina</option>
                  <option value="lv">Latvian - Latviešu</option>
                  <option value="lt">Lithuanian - Lietuvių</option>
                  <option value="lb">Luxembourgish - Lëtzebuergesch</option>
                  <option value="mk">Macedonian - Македонски</option>
                  <option value="mg">Malagasy</option>
                  <option value="ms">Malay - Bahasa Melayu</option>
                  <option value="ml">Malayalam - മലയാളം</option>
                  <option value="mt">Maltese - Malti</option>
                  <option value="mr">Marathi - मराठी</option>
                  <option value="mn">Mongolian - Монгол</option>
                  <option value="ne">Nepali - नेपाली</option>
                  <option value="no">Norwegian - Norsk</option>
                  <option value="fa">Persian - فارسی</option>
                  <option value="pl">Polish - Polski</option>
                  <option value="pt">Portuguese - Português</option>
                  <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
                  <option value="ro">Romanian - Română</option>
                  <option value="ru">Russian - Русский</option>
                  <option value="sr">Serbian - Српски</option>
                  <option value="si">Sinhala - සිංහල</option>
                  <option value="sk">Slovak - Slovenčina</option>
                  <option value="sl">Slovenian - Slovenščina</option>
                  <option value="so">Somali - Soomaali</option>
                  <option value="es">Spanish - Español</option>
                  <option value="sw">Swahili - Kiswahili</option>
                  <option value="sv">Swedish - Svenska</option>
                  <option value="tl">Tagalog - Filipino</option>
                  <option value="ta">Tamil - தமிழ்</option>
                  <option value="te">Telugu - తెలుగు</option>
                  <option value="th">Thai - ไทย</option>
                  <option value="tr">Turkish - Türkçe</option>
                  <option value="uk">Ukrainian - Українська</option>
                  <option value="ur">Urdu - اردو</option>
                  <option value="uz">Uzbek - O'zbek</option>
                  <option value="vi">Vietnamese - Tiếng Việt</option>
                  <option value="cy">Welsh - Cymraeg</option>
                  <option value="yi">Yiddish - ייִדיש</option>
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