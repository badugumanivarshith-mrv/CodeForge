import { create } from 'zustand';
import {
  UserDto,
  UserProfileDto,
  UserPreferencesDto,
  LoginDto,
  RegisterDto,
} from '@codeforge/shared';
import { authApi } from '../services/authApi';
import { userApi } from '../services/userApi';

interface AuthState {
  user: UserDto | null;
  profile: UserProfileDto | null;
  preferences: UserPreferencesDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (
    user: UserDto,
    profile: UserProfileDto,
    preferences: UserPreferencesDto,
    accessToken: string,
  ) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileDto>) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferencesDto>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  preferences: null,
  accessToken: localStorage.getItem('cf_access_token'),
  isAuthenticated: !!localStorage.getItem('cf_access_token'),
  isLoading: false,
  error: null,

  setAuth: (
    user: UserDto,
    profile: UserProfileDto,
    preferences: UserPreferencesDto,
    accessToken: string,
  ) => {
    localStorage.setItem('cf_access_token', accessToken);
    set({
      user,
      profile,
      preferences,
      accessToken,
      isAuthenticated: true,
      error: null,
    });
  },

  clearAuth: () => {
    localStorage.removeItem('cf_access_token');
    set({
      user: null,
      profile: null,
      preferences: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setError: (error: string | null) => set({ error }),

  login: async (data: LoginDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(data);
      get().setAuth(
        response.user,
        response.profile,
        response.preferences,
        response.accessToken,
      );
    } catch (err: any) {
      const message = err.message || 'Login failed. Please check your credentials.';
      set({ error: message, isAuthenticated: false });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data: RegisterDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      get().setAuth(
        response.user,
        response.profile,
        response.preferences,
        response.accessToken,
      );
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please try again.';
      set({ error: message, isAuthenticated: false });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Clean up locally even if network fails
    } finally {
      get().clearAuth();
    }
  },

  logoutAll: async () => {
    try {
      await authApi.logoutAll();
    } finally {
      get().clearAuth();
    }
  },

  loadCurrentUser: async () => {
    const token = localStorage.getItem('cf_access_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await authApi.getMe();
      set({
        user: response.user,
        profile: response.profile,
        preferences: response.preferences,
        isAuthenticated: true,
      });
    } catch {
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<UserProfileDto>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await userApi.updateMyProfile(data);
      set({ profile: updatedProfile });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePreferences: async (data: Partial<UserPreferencesDto>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPrefs = await userApi.updateMyPreferences(data);
      set({ preferences: updatedPrefs });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update preferences' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
