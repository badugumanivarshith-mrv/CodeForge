import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import { WhiteLabelConfigDto, UpdateWhiteLabelDto } from '@codeforge/shared';

export class WhiteLabelService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async getWhiteLabelConfig(orgIdOrSlug: string): Promise<WhiteLabelConfigDto | null> {
    const org = await this.enterpriseRepo.getOrganizationById(orgIdOrSlug);
    const targetOrg = org || (await this.enterpriseRepo.getOrganizationBySlug(orgIdOrSlug));
    if (!targetOrg) return null;

    const theme = targetOrg.themeConfig || {};

    return {
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
      primaryColor: theme.primaryColor || '#6366f1',
      secondaryColor: theme.secondaryColor || '#8b5cf6',
      logoUrl: targetOrg.logoUrl,
      faviconUrl: theme.faviconUrl || null,
      customDomain: targetOrg.domain,
      portalTitle: theme.portalTitle || `${targetOrg.name} Portal`,
    };
  }

  async updateWhiteLabelConfig(
    orgId: string,
    data: UpdateWhiteLabelDto,
  ): Promise<WhiteLabelConfigDto | null> {
    const existing = await this.enterpriseRepo.getOrganizationById(orgId);
    if (!existing) return null;

    const updatedTheme = {
      ...(existing.themeConfig || {}),
      ...(data.primaryColor && { primaryColor: data.primaryColor }),
      ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
      ...(data.faviconUrl !== undefined && { faviconUrl: data.faviconUrl }),
      ...(data.portalTitle && { portalTitle: data.portalTitle }),
    };

    const updatedOrg = await this.enterpriseRepo.updateOrganization(orgId, {
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.customDomain !== undefined && { domain: data.customDomain }),
      themeConfig: updatedTheme,
    });

    if (!updatedOrg) return null;
    return this.getWhiteLabelConfig(orgId);
  }

  async getBranding(orgIdOrSlug: string): Promise<WhiteLabelConfigDto | null> {
    return this.getWhiteLabelConfig(orgIdOrSlug);
  }

  async updateBranding(orgId: string, data: UpdateWhiteLabelDto): Promise<WhiteLabelConfigDto | null> {
    return this.updateWhiteLabelConfig(orgId, data);
  }
}

export const whiteLabelService = new WhiteLabelService();
