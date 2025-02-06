import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import logo from './logo.png';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ArticlePage from './pages/ArticlePage';
import { NotificationProvider } from './contexts/NotificationContext';

// Add import at the top
import Notifications from './pages/Notifications';

// Update the Routes in AppContent
function AppContent() {
  const location = useLocation();
  const showLogo = location.pathname === '/';

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // Clear saved scroll position and refresh the page
      sessionStorage.removeItem('homeScrollPosition');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {showLogo && (
        <img 
          src={logo} 
          alt="WikTok Logo" 
          className="fixed top-4 left-4 z-50 h-6 w-auto cursor-pointer" 
          onClick={handleLogoClick}
        />
      )}
      <div className="max-w-md mx-auto pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;