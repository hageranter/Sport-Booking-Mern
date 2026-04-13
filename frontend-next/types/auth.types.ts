export type UserRole = 'User' | 'CourtOwner' | 'Admin';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePicture: string | null;
  role: UserRole;
  language: 'ar' | 'en';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface AuthApiResponse<T = AuthResponse> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  errors?: ApiErrorField[];
}
