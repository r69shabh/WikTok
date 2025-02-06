import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { isAuthenticated, login } = useAuth();

  const handleWikipediaLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to login:', error);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-50';
      notification.textContent = 'Login failed. Please try again.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="relative w-full max-w-md p-6 mx-auto pt-20">
          <div className="text-center">
            <Bell className="w-12 h-12 mb-4 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">
              Sign in to see notifications
            </h2>
            <p className="text-gray-400 mb-6">
              Connect with your Wikipedia account to receive notifications about reactions and replies.
            </p>

            <button
              onClick={handleWikipediaLogin}
              className="w-full py-3 px-4 bg-[#2196F3] text-white rounded-lg font-medium hover:bg-[#1976D2] transition-colors flex items-center justify-center gap-2"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png"
                alt="Wikipedia Logo"
                className="w-6 h-6"
              />
              Continue with Wikipedia
            </button>

            <p className="mt-6 text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bell className="mx-auto mb-2" size={24} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${
                notification.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-sm">{notification.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}