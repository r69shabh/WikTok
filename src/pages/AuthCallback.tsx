import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Store the token and update auth context
      const user = {
        id: 'temp-id', // This will be replaced with actual user data
        username: 'temp-username',
        token
      };
      localStorage.setItem('wiktok_user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    } else if (error) {
      console.error('Authentication failed:', error);
      navigate('/?error=auth_failed');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default AuthCallback;