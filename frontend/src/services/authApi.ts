import { apiClient } from './apiClient';
import {
  AuthResponseDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  UserDto,
  UserProfileDto,
  UserPreferencesDto,
  ApiResponse,
} from '@codeforge/shared';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const res = await apiClient.post<ApiResponse<AuthResponseDto>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const res = await apiClient.post<ApiResponse<AuthResponseDto>>('/auth/login', data);
    return res.data.data;
  },

  refresh: async (refreshToken?: string): Promise<{ accessToken: string }> => {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout-all');
  },

  getMe: async (): Promise<{
    user: UserDto;
    profile: UserProfileDto;
    preferences: UserPreferencesDto;
  }> => {
    const res = await apiClient.get<
      ApiResponse<{ user: UserDto; profile: UserProfileDto; preferences: UserPreferencesDto }>
    >('/auth/me');
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await apiClient.post('/auth/change-password', data);
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  verifyEmail: async (data: VerifyEmailDto): Promise<void> => {
    await apiClient.post('/auth/verify-email', data);
  },

  resendVerification: async (): Promise<void> => {
    await apiClient.post('/auth/resend-verification');
  },
};
