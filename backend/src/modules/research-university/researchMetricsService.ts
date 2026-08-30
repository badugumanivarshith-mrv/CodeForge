import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  ResearchMetricsDto,
  AcademicCommandCenterOverviewDto,
} from '@codeforge/shared';

export class ResearchMetricsService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Calculates real-time university impact metrics
   */
  async getMetrics(universityId: string = 'univ-codeforge-global'): Promise<ResearchMetricsDto> {
    return this.repo.getResearchMetrics(universityId);
  }

  /**
   * Aggregates the top-level Academic Command Center Overview
   */
  async getAcademicCommandCenterOverview(): Promise<AcademicCommandCenterOverviewDto> {
    const metrics = await this.repo.getResearchMetrics();
    const programs = await this.repo.listPrograms();
    const discoveries = await this.repo.listDiscoveries();
    const publications = await this.repo.listPublications();
    const labs = await this.repo.listLaboratories();
    const grants = await this.repo.listGrants();
    const nodes = await this.repo.listKnowledgeNodes();

    return {
      universityName: 'CodeForge Autonomous Research University & Academy of Sciences',
      motto: 'Veritas per Superintelligentiam • Discovery Through Autonomous Reason',
      totalResearchProgramsCount: programs.length,
      activeDigitalLabsCount: labs.length,
      peerReviewedPapersCount: publications.length,
      totalCitationsCount: metrics.totalCitationsCount,
      cumulativeGrantFundingUsd: metrics.totalGrantsSecuredUsd,
      globalKnowledgeNodesCount: nodes.length,
      averageReproducibilityIndex: metrics.averageReproducibilityRate,
      topPrograms: programs.slice(0, 5),
      recentDiscoveries: discoveries.slice(0, 5),
      recentPublications: publications.slice(0, 5),
      activeLabs: labs.slice(0, 5),
      openGrants: grants.slice(0, 5),
    };
  }
}

export const researchMetricsService = new ResearchMetricsService();
