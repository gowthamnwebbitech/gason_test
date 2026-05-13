import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessToken, setAccessToken, setRefreshToken, clearAllTokens } from '@/utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app startup
  useEffect(() => {
    const initAuth = async () => {
      const token = await getAccessToken();
      if (token) setIsAuthenticated(true);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await clearAllTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);