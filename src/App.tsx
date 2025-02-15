import React, { Suspense, lazy } from 'react';
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
import { ReaderSettingsProvider } from './contexts/ReaderSettingsContext';

// Add import at the top
import Notifications from './pages/Notifications';

// Update the Routes in AppContent
function AppContent() {
  const location = useLocation();
  const showLogo = location.pathname === '/';

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      sessionStorage.removeItem('homeScrollPosition');
      sessionStorage.removeItem('homeArticles');
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
      <div className="w-full max-w-[420px] mx-auto pb-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Suspense>
      </div>
      <Navbar />
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ReaderSettingsProvider>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </ReaderSettingsProvider>
  );
}

export default App;

//test