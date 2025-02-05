import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white">
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
    </LanguageProvider>
  );
}

export default App;