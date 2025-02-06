import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const session = searchParams.get('session');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (!session) {
          throw new Error('No session token provided');
        }

        // First verify the session is valid
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          // Set the session if it's not already set
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: session,
            refresh_token: ''
          });
          if (setSessionError) throw setSessionError;
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username')
          .single();

        if (userError) throw userError;
        if (!userData) throw new Error('User data not found');

        const user = {
          id: userData.id,
          username: userData.username,
          token: session
        };

        localStorage.setItem('wiktok_user', JSON.stringify(user));
        setUser(user);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        navigate('/?error=auth_failed', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">Authentication failed: {error}</div>
        <button 
          onClick={() => navigate('/', { replace: true })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default AuthCallback;