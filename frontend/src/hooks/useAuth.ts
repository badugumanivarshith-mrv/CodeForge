import { useAuthStore } from '../store/authStore';
import { UserRole } from '@codeforge/shared';

export const useAuth = () => {
  const {
    user,
    profile,
    preferences,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    loadCurrentUser,
    updateProfile,
    updatePreferences,
  } = useAuthStore();

  return {
    user,
    profile,
    preferences,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    loadCurrentUser,
    updateProfile,
    updatePreferences,
    isAdmin: user?.role === UserRole.ADMIN,
    isEducator: user?.role === UserRole.EDUCATOR,
  };
};
