import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  ResearchFederationDto,
  ResearchCollaborationDto,
} from '@codeforge/shared';

export class ResearchCivilizationService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
    this.seedDefaultFederations();
  }

  private async seedDefaultFederations() {
    const federations = await this.repo.listResearchFederations();
    if (federations.length === 0) {
      await this.repo.createResearchFederation({
        federationName: 'Planetary Superintelligence Alliance',
        leadInstitutionId: 'inst-oxford-mit',
        memberInstitutionIds: ['inst-stanford', 'inst-cambridge', 'inst-eth-zurich', 'inst-tokyo'],
        focusArea: 'Autonomous Speculative Reasoning & Multi-Agent Consensus Verification',
        activeCollaborationsCount: 8,
        sharedDatasetsCount: 45,
        status: 'active',
      });

      await this.repo.createResearchFederation({
        federationName: 'Quantum Computational Mesh Consortium',
        leadInstitutionId: 'inst-cern',
        memberInstitutionIds: ['inst-caltech', 'inst-singapore-nus', 'inst-max-planck'],
        focusArea: 'Fault-Tolerant Distributed Quantum Circuits & Lattice Cryptography',
        activeCollaborationsCount: 5,
        sharedDatasetsCount: 32,
        status: 'active',
      });
    }
  }

  async createFederation(data: Partial<ResearchFederationDto>): Promise<ResearchFederationDto> {
    const fed = await this.repo.createResearchFederation(data);
    await this.repo.recordPlanetaryEvent(
      'federation_formed',
      `Established academic research federation: ${fed.federationName}`,
      fed.id,
      { focusArea: fed.focusArea }
    );
    return fed;
  }

  async launchCollaboration(data: {
    federationId: string;
    title: string;
    principalInvestigator: string;
    milestones?: { title: string; completed: boolean }[];
    impactScore?: number;
    validationProof?: string;
  }): Promise<ResearchCollaborationDto> {
    const fed = await this.repo.getResearchFederation(data.federationId);
    if (!fed) {
      throw new Error(`Research federation not found: ${data.federationId}`);
    }

    const collab = await this.repo.createResearchCollaboration({
      federationId: data.federationId,
      title: data.title,
      principalInvestigator: data.principalInvestigator,
      milestones: data.milestones || [
        { title: 'Algorithmic Hypothesis Formulation', completed: true },
        { title: 'Multi-Agent Simulation Proof', completed: true },
        { title: 'Peer-to-Peer Consensus Validation', completed: false },
      ],
      impactScore: data.impactScore ?? 95.5,
      validationProof: data.validationProof || 'sha256:4a8c9b2f1e0d3c5a7b9e8f6d4c2b0a1f',
    });

    return collab;
  }

  async listFederations(): Promise<ResearchFederationDto[]> {
    return this.repo.listResearchFederations();
  }

  async listCollaborations(federationId: string): Promise<ResearchCollaborationDto[]> {
    return this.repo.listCollaborationsByFederation(federationId);
  }
}
