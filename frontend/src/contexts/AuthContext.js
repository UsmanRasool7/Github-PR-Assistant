// src/contexts/AuthContext.js
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        authService.init();
        
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    authService.loginWithGitHub();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleOAuthCallback = async (code) => {
    try {
      console.log('AuthContext: Starting OAuth callback processing');
      setIsLoading(true);
      const data = await authService.handleOAuthCallback(code);
      
      if (data.user && data.access_token) {
        // Ensure the token is immediately available
        authService.setAuthData(data.access_token, data.user);
        
        // Small delay to ensure token is properly stored and accessible
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('AuthContext: OAuth callback completed successfully');
        console.log('AuthContext: Token is now available:', !!authService.getToken());
      } else {
        throw new Error('No user data or token received from OAuth callback');
      }
      
      return data;
    } catch (error) {
      console.error('AuthContext: OAuth callback error:', error);
      // Reset auth state on error
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    handleOAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
