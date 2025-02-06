import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

function Navbar() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto flex justify-around">
        <Link to="/" className={`flex flex-col items-center p-2 ${
          location.pathname === '/' ? 'text-blue-500' : ''
        }`}>
          <Home />
          <span className="text-xs">Home</span>
        </Link>

        <Link to="/discover" className={`flex flex-col items-center p-2 ${
          location.pathname === '/discover' ? 'text-blue-500' : ''
        }`}>
          <Search />
          <span className="text-xs">Discover</span>
        </Link>

        <Link to="/notifications" className={`flex flex-col items-center p-2 relative ${
          location.pathname === '/notifications' ? 'text-blue-500' : ''
        }`}>
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="text-xs">Notifications</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center p-2 ${
          location.pathname === '/profile' ? 'text-blue-500' : ''
        }`}>
          <User />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;