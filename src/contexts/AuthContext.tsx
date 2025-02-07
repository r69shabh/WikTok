import React, { createContext, useContext, useState, useEffect } from 'react';

interface WikiUser {
  id: string;
  username: string;
  token?: string;
}

interface AuthContextType {
  user: WikiUser | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WikiUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('wiktok_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async () => {
    try {
      // Wikipedia OAuth configuration
      const clientId = import.meta.env.VITE_WIKIPEDIA_CLIENT_ID;
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
      const responseType = encodeURIComponent('code');
      const scope = encodeURIComponent('basic');
      
      // Store state in localStorage to prevent CSRF attacks
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('oauth_state', state);
      
      // Construct the authorization URL with all required parameters
      const authUrl = `https://meta.wikimedia.org/w/rest.php/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      
      // Redirect to Wikipedia's authorization page
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Propagate error to be handled by UI
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wiktok_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        showAuthModal,
        setShowAuthModal,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};