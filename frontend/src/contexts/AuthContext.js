import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  // Load user on mount if token exists
  useEffect(() => {
    if (accessToken) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user profile
  const loadUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Load user error:', error);
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        await handleRefreshToken();
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (currentRefreshToken) {
        await authService.logout(currentRefreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  // Refresh access token
  const handleRefreshToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (!currentRefreshToken) { logout(); return; }

      const response = await authService.refreshToken(currentRefreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setAccessToken(accessToken);
      setRefreshToken(newRefreshToken);

      await loadUser();
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken: handleRefreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isCourtOwner: user?.role === 'CourtOwner',
    isUser: user?.role === 'User'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
