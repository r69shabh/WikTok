import React, { useState } from 'react';
import { Settings, Grid, Bookmark, Heart, Sun, Moon, Globe2, Info, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const { language, setLanguage } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // In a real app, you would persist this preference
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleLogout = () => {
    // In a real app, implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">@username</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Dark Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-12 h-6 rounded-full bg-gray-700 relative"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Globe2 size={20} />
                  <span>Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-800 rounded-md px-2 py-1 text-sm max-h-40 w-40 text-ellipsis"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <option value="af">Afrikaans</option>
                  <option value="sq">Shqip (Albanian)</option>
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="hy">Հայերեն (Armenian)</option>
                  <option value="as">অসমীয়া (Assamese)</option>
                  <option value="az">Azərbaycanca (Azerbaijani)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="ba">Башҡортса (Bashkir)</option>
                  <option value="eu">Euskara (Basque)</option>
                  <option value="be">Беларуская (Belarusian)</option>
                  <option value="bh">भोजपुरी (Bhojpuri)</option>
                  <option value="bs">Bosanski (Bosnian)</option>
                  <option value="br">Brezhoneg (Breton)</option>
                  <option value="bg">Български (Bulgarian)</option>
                  <option value="my">မြန်မာဘာသာ (Burmese)</option>
                  <option value="ca">Català (Catalan)</option>
                  <option value="ceb">Cebuano</option>
                  <option value="ny">Chichewa</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="co">Corsu (Corsican)</option>
                  <option value="hr">Hrvatski (Croatian)</option>
                  <option value="cs">Čeština (Czech)</option>
                  <option value="da">Dansk (Danish)</option>
                  <option value="dv">ދިވެހި (Divehi)</option>
                  <option value="nl">Nederlands (Dutch)</option>
                  <option value="en">English</option>
                  <option value="eo">Esperanto</option>
                  <option value="et">Eesti (Estonian)</option>
                  <option value="fi">Suomi (Finnish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="fy">Frysk (Frisian)</option>
                  <option value="gl">Galego (Galician)</option>
                  <option value="ka">ქართული (Georgian)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="el">Ελληνικά (Greek)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="ht">Kreyòl ayisyen (Haitian Creole)</option>
                  <option value="ha">Hausa</option>
                  <option value="haw">ʻŌlelo Hawaiʻi (Hawaiian)</option>
                  <option value="he">עברית (Hebrew)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="hmn">Hmong</option>
                  <option value="hu">Magyar (Hungarian)</option>
                  <option value="is">Íslenska (Icelandic)</option>
                  <option value="ig">Igbo</option>
                  <option value="id">Bahasa Indonesia (Indonesian)</option>
                  <option value="ga">Gaeilge (Irish)</option>
                  <option value="it">Italiano (Italian)</option>
                  <option value="ja">日本語 (Japanese)</option>
                  <option value="jv">Basa Jawa (Javanese)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="kk">Қазақша (Kazakh)</option>
                  <option value="km">ខ្មែរ (Khmer)</option>
                  <option value="rw">Kinyarwanda</option>
                  <option value="ko">한국어 (Korean)</option>
                  <option value="ku">Kurdî (Kurdish)</option>
                  <option value="ky">Кыргызча (Kyrgyz)</option>
                  <option value="lo">ລາວ (Lao)</option>
                  <option value="la">Latina (Latin)</option>
                  <option value="lv">Latviešu (Latvian)</option>
                  <option value="lt">Lietuvių (Lithuanian)</option>
                  <option value="lb">Lëtzebuergesch (Luxembourgish)</option>
                  <option value="mk">Македонски (Macedonian)</option>
                  <option value="mg">Malagasy</option>
                  <option value="ms">Bahasa Melayu (Malay)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="mt">Malti (Maltese)</option>
                  <option value="mi">Māori</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="mn">Монгол (Mongolian)</option>
                  <option value="ne">नेपाली (Nepali)</option>
                  <option value="no">Norsk (Norwegian)</option>
                  <option value="or">ଓଡ଼ିଆ (Odia)</option>
                  <option value="ps">پښتو (Pashto)</option>
                  <option value="fa">فارسی (Persian)</option>
                  <option value="pl">Polski (Polish)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="ro">Română (Romanian)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="sm">Gagana Samoa (Samoan)</option>
                  <option value="gd">Gàidhlig (Scots Gaelic)</option>
                  <option value="sr">Српски / Srpski (Serbian)</option>
                  <option value="st">Sesotho</option>
                  <option value="sn">ChiShona (Shona)</option>
                  <option value="sd">سنڌي (Sindhi)</option>
                  <option value="si">සිංහල (Sinhala)</option>
                  <option value="sk">Slovenčina (Slovak)</option>
                  <option value="sl">Slovenščina (Slovenian)</option>
                  <option value="so">Soomaali (Somali)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="su">Basa Sunda (Sundanese)</option>
                  <option value="sw">Kiswahili (Swahili)</option>
                  <option value="sv">Svenska (Swedish)</option>
                  <option value="tg">Тоҷикӣ (Tajik)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="tt">Татарча (Tatar)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="th">ไทย (Thai)</option>
                  <option value="tr">Türkçe (Turkish)</option>
                  <option value="tk">Türkmen (Turkmen)</option>
                  <option value="uk">Українська (Ukrainian)</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="ug">ئۇيغۇرچە (Uyghur)</option>
                  <option value="uz">O'zbek (Uzbek)</option>
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="cy">Cymraeg (Welsh)</option>
                  <option value="xh">isiXhosa (Xhosa)</option>
                  <option value="yi">ייִדיש (Yiddish)</option>
                  <option value="yo">Yorùbá</option>
                  <option value="zu">isiZulu (Zulu)</option>
                </select>
              </div>

              {/* About Section */}
              <div className="py-2 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={20} />
                  <span>About</span>
                </div>
                <p className="text-sm text-gray-400 ml-7">
                  WikTok v1.0.0
                  <br />
                  A TikTok-style interface for exploring Wikipedia articles.
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors w-full py-2"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 mx-auto mb-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">124</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="font-bold">8.5K</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">23K</div>
                <div className="text-xs text-gray-400">Likes</div>
              </div>
            </div>
            <button className="bg-[#FE2C55] text-white px-8 py-2 rounded-md font-medium">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex justify-around border-b border-gray-800">
          <button className="flex-1 py-3 border-b-2 border-white">
            <Grid size={20} className="mx-auto" />
          </button>
          <button className="flex-1 py-3 text-gray-500">
            <Bookmark size={20} className="mx-auto" />
          </button>
          <button className="flex-1 py-3 text-gray-500">
            <Heart size={20} className="mx-auto" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-800 relative"
            >
              <img
                src={`https://images.unsplash.com/photo-${1580000000000 + i}?w=300&q=80`}
                alt={`Post ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;