import { UserDto, UserProfileDto, UserPreferencesDto } from '@codeforge/shared';

export interface UserWithPassword extends UserDto {
  passwordHash: string;
}

export interface PublicUserProfileDto {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  githubUsername: string | null;
  totalXp: number;
  currentLevel: number;
  streak: number;
  learningGoals: string[];
  joinedAt: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
  findByUsername(username: string): Promise<UserDto | null>;
  findFullById(id: string): Promise<UserWithPassword | null>;
  findFullByEmail(email: string): Promise<UserWithPassword | null>;
  create(data: {
    email: string;
    username: string;
    passwordHash: string;
    fullName?: string;
  }): Promise<{ user: UserDto; profile: UserProfileDto; preferences: UserPreferencesDto }>;
  updateLastLogin(userId: string): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  verifyEmail(userId: string): Promise<void>;
  getProfile(userId: string): Promise<UserProfileDto | null>;
  updateProfile(userId: string, data: Partial<UserProfileDto>): Promise<UserProfileDto>;
  getPublicProfileByUsername(username: string): Promise<PublicUserProfileDto | null>;
  getPreferences(userId: string): Promise<UserPreferencesDto | null>;
  updatePreferences(userId: string, data: Partial<UserPreferencesDto>): Promise<UserPreferencesDto>;
}
