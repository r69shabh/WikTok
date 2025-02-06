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

function AppContent() {
  const location = useLocation();
  const showLogo = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {showLogo && <img src={logo} alt="WikiTok Logo" className="fixed top-4 left-4 z-50 h-6 w-auto" />}
      <div className="max-w-md mx-auto pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;