import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login } = useAuth();

  const handleWikipediaLogin = async () => {
    try {
      await login();
      onClose();
    } catch (error) {
      console.error('Failed to login:', error);
      // Show error message to user
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-50';
      notification.textContent = 'Login failed. Please try again.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Sign in to WikTok
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect with your Wikipedia account to like, bookmark, and comment on articles.
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

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;