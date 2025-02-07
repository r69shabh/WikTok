import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

function Navbar() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed md:top-0 md:bottom-0 md:left-0 md:w-[240px] md:h-screen bottom-0 left-0 right-0 bg-white dark:bg-black md:border-r border-t md:border-t-0 border-gray-200 dark:border-gray-800 z-10">
      <div className="md:h-full max-w-md md:max-w-none mx-auto flex md:flex-col justify-around md:justify-start md:pt-20">
        <Link to="/" className={`flex md:flex-row flex-col items-center p-2 md:gap-3 ${
          location.pathname === '/' ? 'text-blue-500' : ''
        }`}>
          <Home />
          <span className="text-xs md:text-sm">Home</span>
        </Link>

        <Link to="/discover" className={`flex md:flex-row flex-col items-center p-2 md:gap-3 ${
          location.pathname === '/discover' ? 'text-blue-500' : ''
        }`}>
          <Search />
          <span className="text-xs md:text-sm">Discover</span>
        </Link>

        <Link to="/notifications" className={`flex md:flex-row flex-col items-center p-2 md:gap-3 relative ${
          location.pathname === '/notifications' ? 'text-blue-500' : ''
        }`}>
          <div className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs md:text-sm">Notifications</span>
        </Link>

        <Link to="/profile" className={`flex md:flex-row flex-col items-center p-2 md:gap-3 ${
          location.pathname === '/profile' ? 'text-blue-500' : ''
        }`}>
          <User />
          <span className="text-xs md:text-sm">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;