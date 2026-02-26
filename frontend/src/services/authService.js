import api from './api';

/**
 * Auth service – all /api/auth endpoints.
 * Same function signatures are used by the React Native app.
 */

export const authService = {
  /**
   * Register a new user
   * @param {{ email, password, fullName, phoneNumber, role }} userData
   */
  register: (userData) => api.post('/auth/register', userData),

  /**
   * Login with email & password
   * @param {{ email, password }} credentials
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Get the currently authenticated user
   */
  getMe: () => api.get('/auth/me'),

  /**
   * Logout – invalidates the refresh token server-side
   * @param {string} refreshToken
   */
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),

  /**
   * Request a password-reset email
   * @param {string} email
   */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  /**
   * Reset password using the token from the email
   * @param {{ token, password }} payload
   */
  resetPassword: (payload) => api.post('/auth/reset-password', payload),

  /**
   * Refresh the access token
   * @param {string} refreshToken
   */
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken })
};
