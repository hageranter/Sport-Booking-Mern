import { api } from '@/lib/axios';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  register: (userData: RegisterData) =>
    api.post<{ data: AuthResponse }>('/auth/register', userData),

  login: (credentials: LoginCredentials) =>
    api.post<{ data: AuthResponse }>('/auth/login', credentials),

  getMe: () => api.get<{ data: { user: User } }>('/auth/me'),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (payload: { token: string; password: string }) =>
    api.post('/auth/reset-password', payload),

  refreshToken: (refreshToken: string) =>
    api.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      refreshToken,
    }),
};
