import { UserRepository } from '../repositories';
import { NotFoundError, BadRequestError } from '../core/errors';
import { UserProfileDto, UserPreferencesDto } from '@codeforge/shared';
import { PublicUserProfileDto } from '../repositories/interfaces/IUserRepository';

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  public async getMyProfile(userId: string): Promise<UserProfileDto> {
    const profile = await this.userRepo.getProfile(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  public async updateMyProfile(
    userId: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileDto> {
    // Validate timezone if provided
    if (data.timezone && data.timezone.length > 50) {
      throw new BadRequestError('Timezone format is invalid');
    }

    // Validate bio length
    if (data.bio && data.bio.length > 500) {
      throw new BadRequestError('Bio cannot exceed 500 characters');
    }

    // Validate full name length
    if (data.fullName && data.fullName.length > 100) {
      throw new BadRequestError('Display name cannot exceed 100 characters');
    }

    return await this.userRepo.updateProfile(userId, data);
  }

  public async getPublicProfile(username: string): Promise<PublicUserProfileDto> {
    const profile = await this.userRepo.getPublicProfileByUsername(username);
    if (!profile) {
      throw new NotFoundError(`User @${username} not found`);
    }
    return profile;
  }

  public async getMyPreferences(userId: string): Promise<UserPreferencesDto> {
    const preferences = await this.userRepo.getPreferences(userId);
    if (!preferences) {
      throw new NotFoundError('User preferences not found');
    }
    return preferences;
  }

  public async updateMyPreferences(
    userId: string,
    data: Partial<UserPreferencesDto>,
  ): Promise<UserPreferencesDto> {
    if (data.editorFontSize !== undefined) {
      if (data.editorFontSize < 10 || data.editorFontSize > 32) {
        throw new BadRequestError('Editor font size must be between 10 and 32');
      }
    }

    if (data.editorKeybindings && !['standard', 'vim', 'emacs'].includes(data.editorKeybindings)) {
      throw new BadRequestError('Editor keybinding must be standard, vim, or emacs');
    }

    if (data.theme && !['dark', 'light'].includes(data.theme)) {
      throw new BadRequestError('Theme must be dark or light');
    }

    if (data.aiHintLevel !== undefined && ![1, 2, 3].includes(data.aiHintLevel)) {
      throw new BadRequestError('AI hint level must be 1, 2, or 3');
    }

    return await this.userRepo.updatePreferences(userId, data);
  }
}
