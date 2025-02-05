import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
              <div className="max-w-md mx-auto pb-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
              <Navbar />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;