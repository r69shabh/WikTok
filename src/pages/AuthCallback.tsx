import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const session = searchParams.get('session');
    const error = searchParams.get('error');

    if (session) {
      // Set the session in Supabase
      supabase.auth.setSession({
        access_token: session,
        refresh_token: ''
      });

      // Get user data from Supabase
      supabase
        .from('users')
        .select('*')
        .single()
        .then(({ data: userData, error: userError }) => {
          if (userError) {
            console.error('Failed to fetch user data:', userError);
            navigate('/?error=user_fetch_failed');
            return;
          }

          const user = {
            id: userData.id,
            username: userData.username,
            token: session
          };

          localStorage.setItem('wiktok_user', JSON.stringify(user));
          setUser(user);
          navigate('/');
        });
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