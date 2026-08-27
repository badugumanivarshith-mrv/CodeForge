import {
  PortfolioProjectDto,
  PortfolioSettingsDto,
  CreatePortfolioProjectDto,
  UpdatePortfolioProjectDto,
  UpdatePortfolioSettingsDto,
} from '@codeforge/shared';

export interface IPortfolioRepository {
  getSettingsByUserId(userId: string): Promise<PortfolioSettingsDto | null>;
  getSettingsBySlug(slug: string): Promise<PortfolioSettingsDto | null>;
  upsertSettings(userId: string, data: UpdatePortfolioSettingsDto): Promise<PortfolioSettingsDto>;
  getProjectsByUserId(userId: string): Promise<PortfolioProjectDto[]>;
  getProjectById(id: string): Promise<PortfolioProjectDto | null>;
  createProject(userId: string, data: CreatePortfolioProjectDto): Promise<PortfolioProjectDto>;
  updateProject(id: string, userId: string, data: UpdatePortfolioProjectDto): Promise<PortfolioProjectDto | null>;
  deleteProject(id: string, userId: string): Promise<boolean>;
}
