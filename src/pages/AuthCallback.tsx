import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Import from centralized supabase client

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const session = searchParams.get('session');
        const error = searchParams.get('error');

        if (session) {
          await supabase.auth.setSession({
            access_token: session,
            refresh_token: ''
          });

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .single();

          if (userError) throw userError;

          const user = {
            id: userData.id,
            username: userData.username,
            token: session
          };

          localStorage.setItem('wiktok_user', JSON.stringify(user));
          setUser(user);
          navigate('/');
        } else if (error) {
          throw new Error(error);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/?error=auth_failed');
      }
    };

    handleAuth();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default AuthCallback;