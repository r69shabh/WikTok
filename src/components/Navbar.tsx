import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // If already on home, refresh by reloading the page
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          <button
            onClick={handleHomeClick}
            className={`p-3 rounded-full ${location.pathname === '/' ? 'text-white' : 'text-gray-500'}`}
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => navigate('/discover')}
            className={`p-3 rounded-full ${location.pathname === '/discover' ? 'text-white' : 'text-gray-500'}`}
          >
            <Search size={24} />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`p-3 rounded-full ${location.pathname === '/profile' ? 'text-white' : 'text-gray-500'}`}
          >
            <User size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;