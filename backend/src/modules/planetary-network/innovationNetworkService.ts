import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  InnovationRecordDto,
  InnovationRankingDto,
  InnovationDomain,
} from '@codeforge/shared';

export class InnovationNetworkService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
  }

  async recordInnovation(data: {
    title: string;
    domain: InnovationDomain;
    inventorOrganizationId: string;
    patentStatus?: 'filed' | 'approved' | 'commercialized' | 'open_source';
    commercialReadinessScore?: number;
    adoptionForecastPercent?: number;
    technologyMaturityLevel?: number;
  }): Promise<InnovationRecordDto> {
    const record = await this.repo.createInnovationRecord({
      title: data.title,
      domain: data.domain,
      inventorOrganizationId: data.inventorOrganizationId,
      patentStatus: data.patentStatus || 'filed',
      commercialReadinessScore: data.commercialReadinessScore ?? 82.0,
      adoptionForecastPercent: data.adoptionForecastPercent ?? 70.0,
      technologyMaturityLevel: data.technologyMaturityLevel || 8,
    });

    await this.repo.recordPlanetaryEvent(
      'innovation_patented',
      `Registered breakthrough innovation: ${record.title}`,
      record.id,
      { domain: record.domain, maturityLevel: record.technologyMaturityLevel }
    );

    return record;
  }

  async rankInnovationsByDomain(domain: InnovationDomain): Promise<InnovationRankingDto> {
    const innovations = await this.repo.listInnovationRecords(domain);
    const sorted = [...innovations].sort((a, b) => b.commercialReadinessScore - a.commercialReadinessScore);

    const ranking = await this.repo.recordInnovationRanking({
      domain,
      topInnovations: sorted.slice(0, 5),
      velocityScore: sorted.length > 0 ? 91.5 : 75.0,
      leadingRegion: 'Global Collaborative Mesh',
    });

    return ranking;
  }

  async listInnovations(domain?: InnovationDomain): Promise<InnovationRecordDto[]> {
    return this.repo.listInnovationRecords(domain);
  }

  async getInnovation(id: string): Promise<InnovationRecordDto | null> {
    return this.repo.getInnovationRecord(id);
  }
}
