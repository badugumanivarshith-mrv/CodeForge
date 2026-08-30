import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  AcademicKnowledgeNodeDto,
  CreateAcademicKnowledgeNodeDto,
  AcademicDepartment,
  KnowledgeNodeType,
} from '@codeforge/shared';

export class AcademicKnowledgeGraphService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Indexes a new knowledge node into the academic knowledge graph
   */
  async indexNode(dto: CreateAcademicKnowledgeNodeDto): Promise<AcademicKnowledgeNodeDto> {
    if (!dto.canonicalName || !dto.definition || !dto.domain) {
      throw new Error('canonicalName, definition, and domain are required.');
    }

    const evolutionLineage = dto.evolutionLineage && dto.evolutionLineage.length > 0
      ? dto.evolutionLineage
      : [dto.canonicalName];

    return this.repo.createKnowledgeNode({
      ...dto,
      evolutionLineage,
      confidenceScore: dto.confidenceScore ?? 96.5,
    });
  }

  /**
   * Retrieves a knowledge node by ID
   */
  async getNode(id: string): Promise<AcademicKnowledgeNodeDto | null> {
    return this.repo.getKnowledgeNodeById(id);
  }

  /**
   * Lists all indexed knowledge nodes, optionally filtered by academic domain
   */
  async listNodes(domain?: AcademicDepartment): Promise<AcademicKnowledgeNodeDto[]> {
    return this.repo.listKnowledgeNodes(domain);
  }

  /**
   * Synthesizes cross-disciplinary connections and lineages between nodes
   */
  async discoverCrossDisciplinaryLineages(domain?: AcademicDepartment): Promise<{
    nodesCount: number;
    connectionsCount: number;
    highestConfidenceTheorems: AcademicKnowledgeNodeDto[];
    crossDisciplinaryDensity: number;
    conceptClusters: Record<string, string[]>;
  }> {
    const nodes = await this.repo.listKnowledgeNodes(domain);
    const highestConfidenceTheorems = [...nodes].sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 5);

    const connectionsCount = nodes.reduce((sum, n) => sum + n.outgoingConnections.length, 0);
    const crossDisciplinaryDensity = nodes.length > 0
      ? parseFloat((connectionsCount / (nodes.length * 2.5)).toFixed(2))
      : 0.85;

    const conceptClusters: Record<string, string[]> = {};
    for (const node of nodes) {
      const dom = node.domain;
      if (!conceptClusters[dom]) conceptClusters[dom] = [];
      conceptClusters[dom].push(node.canonicalName);
    }

    return {
      nodesCount: nodes.length,
      connectionsCount,
      highestConfidenceTheorems,
      crossDisciplinaryDensity: Math.min(1.0, crossDisciplinaryDensity),
      conceptClusters,
    };
  }
}

export const academicKnowledgeGraphService = new AcademicKnowledgeGraphService();
