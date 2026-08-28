import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import {
  NetworkIntelligenceDto,
  NetworkConnectionDto,
  NetworkRecommendationDto,
  NetworkRelationType,
} from '@codeforge/shared';

export class NetworkIntelligenceService {
  constructor(private repo: ICareerOsRepository = careerOsRepository) {}

  /**
   * Calculates network strength score (0 - 100) based on connection volume, diversity, and reciprocity
   */
  calculateNetworkStrength(connections: NetworkConnectionDto[]): number {
    if (!connections || connections.length === 0) return 20;

    let score = 25; // baseline
    score += Math.min(35, connections.length * 5); // volume up to 7+ connections

    // Diversity bonus: having different relation types
    const types = new Set(connections.map(c => c.relationType));
    score += Math.min(25, types.size * 5);

    // Average relationship strength score
    const avgStrength = connections.reduce((acc, c) => acc + (c.strengthScore || 70), 0) / connections.length;
    score += (avgStrength * 0.15);

    return Math.max(10, Math.min(100, Math.round(score)));
  }

  /**
   * Retrieves full network intelligence analysis for a user
   */
  async getNetworkIntelligence(userId: string): Promise<NetworkIntelligenceDto> {
    const connections = await this.repo.listNetworkConnections(userId);
    const networkStrengthScore = this.calculateNetworkStrength(connections);

    const distributionByType: Record<string, number> = {
      mentor: 0,
      recruiter: 0,
      hiring_manager: 0,
      alumni: 0,
      peer_engineer: 0,
      collaborator: 0,
    };

    connections.forEach(c => {
      distributionByType[c.relationType] = (distributionByType[c.relationType] || 0) + 1;
    });

    const mentorRecommendations: NetworkRecommendationDto[] = [
      {
        name: 'Dr. Aris Thorne',
        role: 'Principal Systems Architect',
        company: 'Stripe Infrastructure',
        relationType: NetworkRelationType.MENTOR,
        matchReason: 'Top mentor match for Distributed Raft & Storage Internals',
        actionUrl: '/mentors-portal',
      },
      {
        name: 'Elena Rostova',
        role: 'Staff ML Infrastructure Engineer',
        company: 'OpenAI Core',
        relationType: NetworkRelationType.MENTOR,
        matchReason: 'Matched based on high performance in AI Arena & Vector Indexing',
        actionUrl: '/mentors-portal',
      },
    ];

    const recruiterRecommendations: NetworkRecommendationDto[] = [
      {
        name: 'Marcus Vance',
        role: 'Senior Technical Talent Lead',
        company: 'Vercel Platform',
        relationType: NetworkRelationType.RECRUITER,
        matchReason: 'Actively recruiting L5 Frontend & Cloud Engineers with high contest Elo',
        actionUrl: '/recruiter-portal',
      },
      {
        name: 'Samantha Wu',
        role: 'Lead Infrastructure Recruiter',
        company: 'Datadog Platforms',
        relationType: NetworkRelationType.RECRUITER,
        matchReason: 'Seeking Distributed Systems engineers with verifiable CodeForge certifications',
        actionUrl: '/recruiter-portal',
      },
    ];

    const industryEvents = [
      { eventName: 'Systems Distributed Hackathon 2026', date: '2026-10-15', relevanceScore: 95 },
      { eventName: 'Global Cloud-Native Summit', date: '2026-11-20', relevanceScore: 88 },
      { eventName: 'AI Agents & WASI DevCon', date: '2026-12-05', relevanceScore: 92 },
    ];

    const recommendedCommunities = [
      { communityName: 'CodeForge High-Performance Systems SIG', focus: 'Rust, Concurrency, Caching', memberCount: 1420 },
      { communityName: 'Alumni Tech Leadership Circle', focus: 'Staff Promotion & Engineering Management', memberCount: 890 },
      { communityName: 'Open Source Maintainers Guild', focus: 'Upstream RFCs & Code Reviews', memberCount: 2350 },
    ];

    return {
      networkStrengthScore,
      totalConnections: connections.length,
      distributionByType,
      mentorRecommendations,
      recruiterRecommendations,
      industryEvents,
      recommendedCommunities,
    };
  }

  async addConnection(userId: string, data: Omit<NetworkConnectionDto, 'id' | 'userId' | 'createdAt'>): Promise<NetworkConnectionDto> {
    return this.repo.createNetworkConnection(userId, data);
  }

  async listConnections(userId: string): Promise<NetworkConnectionDto[]> {
    return this.repo.listNetworkConnections(userId);
  }

  async deleteConnection(connectionId: string, userId: string): Promise<boolean> {
    return this.repo.deleteNetworkConnection(connectionId, userId);
  }
}

export const networkIntelligenceService = new NetworkIntelligenceService();
