import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import {
  KnowledgeFabricEntityDto,
  KnowledgeFabricEdgeDto,
  KnowledgeDiscoveryDto,
  KnowledgeGapDto,
  KnowledgeGraphDomain,
} from '@codeforge/shared';

export class KnowledgeFabricService {
  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  async createEntity(data: { domain: KnowledgeGraphDomain; name: string; entityType: string; description: string; properties?: Record<string, any> }): Promise<KnowledgeFabricEntityDto> {
    return this.agentCloudRepo.createKnowledgeEntity(data);
  }

  async linkEntities(data: { sourceEntityId: string; targetEntityId: string; relationType: string; weight?: number; metadata?: Record<string, any> }): Promise<KnowledgeFabricEdgeDto> {
    return this.agentCloudRepo.createKnowledgeEdge(data);
  }

  async getDomainGraph(domain: KnowledgeGraphDomain): Promise<{ entities: KnowledgeFabricEntityDto[]; edges: KnowledgeFabricEdgeDto[] }> {
    return this.agentCloudRepo.getKnowledgeGraphByDomain(domain);
  }

  async discoverConcepts(domain: KnowledgeGraphDomain, query: string): Promise<KnowledgeDiscoveryDto> {
    const graph = await this.agentCloudRepo.getKnowledgeGraphByDomain(domain);
    const matches = graph.entities.filter(e =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase())
    );

    const related = matches.slice(0, 5).map(e => e.name);
    return {
      domain,
      entities: graph.entities,
      edges: graph.edges,
      density: graph.entities.length > 0 ? graph.edges.length / graph.entities.length : 0,
      discoveredConcepts: related.length > 0 ? related : [query, `${query} Best Practices`, `${query} Architecture Patterns`],
      recommendedPaths: [
        { from: 'Foundation Concept', to: query, relationChain: ['requires', 'enhances'] },
      ],
    };
  }

  async detectKnowledgeGaps(domain: KnowledgeGraphDomain, missingSkillOrConcept: string): Promise<KnowledgeGapDto> {
    return {
      domain,
      missingSkillOrConcept,
      suggestedAction: `Complete the ${missingSkillOrConcept} accelerated mastery module and link verification project`,
      impactScore: 88,
    };
  }
}
