'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchUser,
  clearError,
} from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      return { success: true as const, user: result.payload.user };
    }
    return {
      success: false as const,
      message: result.payload || 'Login failed',
    };
  };

  const register = async (userData: RegisterData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      return { success: true as const, user: result.payload.user };
    }
    const payload = result.payload as { message: string; errors?: { field: string; message: string }[] };
    return {
      success: false as const,
      message: payload?.message || 'Registration failed',
      errors: payload?.errors,
    };
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const loadUser = () => dispatch(fetchUser());
  const clearAuthError = () => dispatch(clearError());

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError: clearAuthError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isCourtOwner: user?.role === 'CourtOwner',
    isUser: user?.role === 'User',
  };
}
