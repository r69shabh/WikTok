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
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const provider = localStorage.getItem('oauth_provider');
        const storedState = localStorage.getItem('oauth_state');

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('State mismatch. Possible CSRF attack');
        }

        // Call Supabase Edge Function for authentication
        const response = await fetch('https://huwebsrgeoxdrvhciqjp.supabase.co/functions/v1/auth-handler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ code, provider }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to authenticate');
        }

        const data = await response.json();
        
        // Set up Supabase session
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) throw sessionError;

        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          provider: provider as 'google' | 'apple',
          token: data.access_token
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
  }, [navigate, searchParams, setUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Authenticating...</div>;
};

export default AuthCallback;