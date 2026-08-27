import { eq, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { users, userProfiles, userPreferences, streaks } from '../database/schema';
import {
  IUserRepository,
  UserWithPassword,
  PublicUserProfileDto,
} from './interfaces/IUserRepository';
import { UserDto, UserProfileDto, UserPreferencesDto, UserRole, UserStatus, LanguageId } from '@codeforge/shared';

export class UserRepository implements IUserRepository {
  public async findById(id: string): Promise<UserDto | null> {
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
        isVerified: users.isVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!row) return null;
    return {
      ...row,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      lastLoginAt: row.lastLoginAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
        isVerified: users.isVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!row) return null;
    return {
      ...row,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      lastLoginAt: row.lastLoginAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async findByUsername(username: string): Promise<UserDto | null> {
    const normalizedUsername = username.toLowerCase().trim();
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
        isVerified: users.isVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.username, normalizedUsername))
      .limit(1);

    if (!row) return null;
    return {
      ...row,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      lastLoginAt: row.lastLoginAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async findFullById(id: string): Promise<UserWithPassword | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      passwordHash: row.passwordHash,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      isVerified: row.isVerified,
      lastLoginAt: row.lastLoginAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async findFullByEmail(email: string): Promise<UserWithPassword | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const [row] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      passwordHash: row.passwordHash,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      isVerified: row.isVerified,
      lastLoginAt: row.lastLoginAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  public async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    fullName?: string;
  }): Promise<{ user: UserDto; profile: UserProfileDto; preferences: UserPreferencesDto }> {
    const normalizedEmail = data.email.toLowerCase().trim();
    const normalizedUsername = data.username.toLowerCase().trim();

    return await db.transaction(async tx => {
      // 1. Insert User
      const [newUser] = await tx
        .insert(users)
        .values({
          email: normalizedEmail,
          username: normalizedUsername,
          passwordHash: data.passwordHash,
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
          isVerified: false,
        })
        .returning();

      // 2. Insert User Profile
      const [newProfile] = await tx
        .insert(userProfiles)
        .values({
          userId: newUser.id,
          fullName: data.fullName || data.username,
          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${newUser.username}`,
          bio: 'Aspiring Software Engineer on CodeForge',
          timezone: 'UTC',
          totalXp: 0,
          currentLevel: 1,
          learningGoals: [],
        })
        .returning();

      // 3. Insert User Preferences
      const [newPrefs] = await tx
        .insert(userPreferences)
        .values({
          userId: newUser.id,
          theme: 'dark',
          editorFontSize: 14,
          editorKeybindings: 'standard',
          emailNotifications: true,
          aiHintLevel: 1,
        })
        .returning();

      // 4. Initialize User Streak
      await tx.insert(streaks).values({
        userId: newUser.id,
        currentStreak: 0,
        longestStreak: 0,
        freezeTokensAvailable: 1,
      });

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role as UserRole,
          status: newUser.status as UserStatus,
          isVerified: newUser.isVerified,
          lastLoginAt: null,
          createdAt: newUser.createdAt.toISOString(),
          updatedAt: newUser.updatedAt.toISOString(),
        },
        profile: {
          userId: newProfile.userId,
          fullName: newProfile.fullName,
          avatarUrl: newProfile.avatarUrl,
          bio: newProfile.bio,
          githubUsername: newProfile.githubUsername,
          preferredLanguageId: newProfile.preferredLanguageId as LanguageId | null,
          timezone: newProfile.timezone,
          totalXp: newProfile.totalXp,
          currentLevel: newProfile.currentLevel,
          learningGoals: (newProfile.learningGoals as string[]) || [],
        },
        preferences: {
          userId: newPrefs.userId,
          theme: newPrefs.theme as 'dark' | 'light',
          editorFontSize: newPrefs.editorFontSize,
          editorKeybindings: newPrefs.editorKeybindings as 'standard' | 'vim' | 'emacs',
          emailNotifications: newPrefs.emailNotifications,
          aiHintLevel: newPrefs.aiHintLevel as 1 | 2 | 3,
        },
      };
    });
  }

  public async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  public async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  public async verifyEmail(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  public async getProfile(userId: string): Promise<UserProfileDto | null> {
    const [row] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    if (!row) return null;
    return {
      userId: row.userId,
      fullName: row.fullName,
      avatarUrl: row.avatarUrl,
      bio: row.bio,
      githubUsername: row.githubUsername,
      preferredLanguageId: row.preferredLanguageId as LanguageId | null,
      timezone: row.timezone,
      totalXp: row.totalXp,
      currentLevel: row.currentLevel,
      learningGoals: (row.learningGoals as string[]) || [],
    };
  }

  public async updateProfile(userId: string, data: Partial<UserProfileDto>): Promise<UserProfileDto> {
    const [updated] = await db
      .update(userProfiles)
      .set({
        fullName: data.fullName !== undefined ? data.fullName : undefined,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        githubUsername: data.githubUsername !== undefined ? data.githubUsername : undefined,
        preferredLanguageId: data.preferredLanguageId !== undefined ? data.preferredLanguageId : undefined,
        timezone: data.timezone !== undefined ? data.timezone : undefined,
        learningGoals: data.learningGoals !== undefined ? data.learningGoals : undefined,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return {
      userId: updated.userId,
      fullName: updated.fullName,
      avatarUrl: updated.avatarUrl,
      bio: updated.bio,
      githubUsername: updated.githubUsername,
      preferredLanguageId: updated.preferredLanguageId as LanguageId | null,
      timezone: updated.timezone,
      totalXp: updated.totalXp,
      currentLevel: updated.currentLevel,
      learningGoals: (updated.learningGoals as string[]) || [],
    };
  }

  public async getPublicProfileByUsername(username: string): Promise<PublicUserProfileDto | null> {
    const normalizedUsername = username.toLowerCase().trim();
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, normalizedUsername))
      .limit(1);

    if (!user) return null;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const [streak] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, user.id))
      .limit(1);

    return {
      username: user.username,
      fullName: profile?.fullName || null,
      avatarUrl: profile?.avatarUrl || null,
      bio: profile?.bio || null,
      githubUsername: profile?.githubUsername || null,
      totalXp: profile?.totalXp || 0,
      currentLevel: profile?.currentLevel || 1,
      streak: streak?.currentStreak || 0,
      learningGoals: (profile?.learningGoals as string[]) || [],
      joinedAt: user.createdAt.toISOString(),
    };
  }

  public async getPreferences(userId: string): Promise<UserPreferencesDto | null> {
    const [row] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    if (!row) return null;
    return {
      userId: row.userId,
      theme: row.theme as 'dark' | 'light',
      editorFontSize: row.editorFontSize,
      editorKeybindings: row.editorKeybindings as 'standard' | 'vim' | 'emacs',
      emailNotifications: row.emailNotifications,
      aiHintLevel: row.aiHintLevel as 1 | 2 | 3,
    };
  }

  public async updatePreferences(
    userId: string,
    data: Partial<UserPreferencesDto>,
  ): Promise<UserPreferencesDto> {
    const [updated] = await db
      .update(userPreferences)
      .set({
        theme: data.theme !== undefined ? data.theme : undefined,
        editorFontSize: data.editorFontSize !== undefined ? data.editorFontSize : undefined,
        editorKeybindings: data.editorKeybindings !== undefined ? data.editorKeybindings : undefined,
        emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : undefined,
        aiHintLevel: data.aiHintLevel !== undefined ? data.aiHintLevel : undefined,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning();

    return {
      userId: updated.userId,
      theme: updated.theme as 'dark' | 'light',
      editorFontSize: updated.editorFontSize,
      editorKeybindings: updated.editorKeybindings as 'standard' | 'vim' | 'emacs',
      emailNotifications: updated.emailNotifications,
      aiHintLevel: updated.aiHintLevel as 1 | 2 | 3,
    };
  }
}
