import { IGlobalEcosystemRepository, globalEcosystemRepository } from '../../repositories';
import {
  ResearchPublicationDto,
  ResearchCitationDto,
  ResearchTrendDto,
  PublicationStatus,
  EcosystemEventCategory,
} from '@codeforge/shared';

export class ResearchNetworkService {
  constructor(private repo: IGlobalEcosystemRepository = globalEcosystemRepository) {}

  async publishPaper(authorUserId: string, data: Partial<ResearchPublicationDto>): Promise<ResearchPublicationDto> {
    if (!data.title) {
      throw new Error('Paper title is required for publication.');
    }
    const cleanData = {
      ...data,
      abstract: data.abstract || 'Research methodology, empirical evaluations, and theoretical proofs.',
      domain: data.domain || 'Multi-Agent Systems',
      peerReviewScore: data.peerReviewScore ?? 92.0,
    };
    const pub = await this.repo.createPublication(authorUserId, cleanData);

    await this.repo.recordEvent(
      EcosystemEventCategory.RESEARCH_PUBLISHED,
      `Research Published: ${pub.title}`,
      `Author published new findings in ${pub.domain} with peer review score of ${pub.peerReviewScore}.`,
      { publicationId: pub.id, title: pub.title }
    );

    return pub;
  }

  async getPaper(id: string): Promise<ResearchPublicationDto | null> {
    return this.repo.getPublicationById(id);
  }

  async listPapers(domain?: string, status?: PublicationStatus): Promise<ResearchPublicationDto[]> {
    return this.repo.listPublications(domain, status);
  }

  async citePaper(sourceId: string, targetId: string, contextSnippet: string = '', weight: number = 1.0): Promise<ResearchCitationDto> {
    return this.repo.createCitation(sourceId, targetId, contextSnippet, weight);
  }

  async getCitationNetwork(publicationId: string): Promise<ResearchCitationDto[]> {
    return this.repo.listCitations(publicationId);
  }

  async getEmergingResearchTrends(): Promise<ResearchTrendDto[]> {
    return [
      {
        domain: 'Distributed Multi-Agent Consensus',
        breakthroughTopics: ['Decentralized Memory Synthesis', 'Asynchronous DAG Quorums', 'Zero-Trust Agent Audits'],
        publicationGrowthPercent: 54.2,
        citationVelocity: 4.8,
        topCitingLabs: ['CodeForge AI Research Labs', 'MIT Distributed Systems Group', 'Stanford AI Lab'],
      },
      {
        domain: 'Self-Evolving Knowledge Graphs',
        breakthroughTopics: ['Autonomous Entity Disambiguation', 'Cross-Modal Topological Embeddings'],
        publicationGrowthPercent: 38.6,
        citationVelocity: 3.6,
        topCitingLabs: ['Oxford Machine Learning', 'Berkeley Artificial Intelligence Research'],
      },
      {
        domain: 'Generative Code Synthesis Formal Verification',
        breakthroughTopics: ['SMT-Solver Integration', 'Static AST Equivalence Verification'],
        publicationGrowthPercent: 46.1,
        citationVelocity: 4.1,
        topCitingLabs: ['ETH Zurich Systems Group', 'CMU Principles of Programming'],
      },
    ];
  }
}

export const researchNetworkService = new ResearchNetworkService();
