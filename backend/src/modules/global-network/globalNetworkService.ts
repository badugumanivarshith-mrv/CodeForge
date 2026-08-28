import { IGlobalEcosystemRepository, globalEcosystemRepository } from '../../repositories';
import {
  GlobalNetworkNodeDto,
  GlobalNetworkEdgeDto,
  GlobalGraphDto,
  GlobalNetworkRecommendationDto,
  GlobalRankingDto,
  GlobalNodeType,
  GlobalEdgeType,
} from '@codeforge/shared';

export class GlobalNetworkService {
  constructor(private repo: IGlobalEcosystemRepository = globalEcosystemRepository) {}

  async registerNode(data: {
    entityId: string;
    nodeType: GlobalNodeType;
    label: string;
    score?: number;
    metadata?: Record<string, any>;
    tenantId?: string | null;
  }): Promise<GlobalNetworkNodeDto> {
    if (!data.entityId || !data.label || !data.nodeType) {
      throw new Error('Entity ID, node type, and label are required to register global network node.');
    }
    return this.repo.createNode(data);
  }

  async connectNodes(data: {
    sourceNodeId: string;
    targetNodeId: string;
    edgeType: GlobalEdgeType;
    weight?: number;
    metadata?: Record<string, any>;
  }): Promise<GlobalNetworkEdgeDto> {
    if (!data.sourceNodeId || !data.targetNodeId) {
      throw new Error('Source node and target node IDs are required.');
    }
    if (data.sourceNodeId === data.targetNodeId) {
      throw new Error('Cannot create self-referencing network edge.');
    }
    const sourceNode = await this.repo.getNodeById(data.sourceNodeId);
    const targetNode = await this.repo.getNodeById(data.targetNodeId);
    if (!sourceNode || !targetNode) {
      throw new Error('Source node or target node does not exist.');
    }
    return this.repo.createEdge(data);
  }

  async getGraphTopology(limit: number = 100): Promise<GlobalGraphDto> {
    return this.repo.getGlobalGraph(limit);
  }

  async getCrossNetworkRecommendations(nodeId: string): Promise<GlobalNetworkRecommendationDto[]> {
    const node = await this.repo.getNodeById(nodeId);
    if (!node) {
      throw new Error(`Global node with ID "${nodeId}" not found.`);
    }
    return this.repo.getRecommendations(nodeId);
  }

  async getGlobalRankings(nodeType?: GlobalNodeType): Promise<GlobalRankingDto[]> {
    const nodes = await this.repo.listNodes(nodeType);
    const sorted = [...nodes].sort((a, b) => b.score - a.score);
    const total = sorted.length || 1;

    return sorted.map((node, index) => ({
      rank: index + 1,
      entityId: node.entityId,
      label: node.label,
      nodeType: node.nodeType,
      ecosystemScore: node.score,
      percentile: Math.round(((total - index) / total) * 100 * 10) / 10,
    }));
  }
}

export const globalNetworkService = new GlobalNetworkService();
