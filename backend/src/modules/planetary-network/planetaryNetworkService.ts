import { randomUUID } from 'crypto';
import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import { PlanetaryClusterNodeDto, PlanetaryCollaborationMeshDto } from '@codeforge/shared';

export class PlanetaryNetworkService {
  private repo: IPlanetaryIntelligenceRepository;
  private clusters: Map<string, PlanetaryClusterNodeDto> = new Map();
  private meshes: Map<string, PlanetaryCollaborationMeshDto> = new Map();

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
    this.seedDefaultClusters();
  }

  private seedDefaultClusters() {
    const defaultClusters: PlanetaryClusterNodeDto[] = [
      {
        id: 'cluster-na-1',
        clusterName: 'North America Primary Mesh',
        region: 'us-east-1 / us-west-2',
        activeAgentsCount: 1420,
        workforceCount: 8500,
        knowledgeNodeCount: 42000,
        syncLatencyMs: 14.2,
        status: 'optimal',
        lastHeartbeat: new Date().toISOString(),
      },
      {
        id: 'cluster-eu-1',
        clusterName: 'European Union Distributed Node',
        region: 'eu-central-1 / eu-west-1',
        activeAgentsCount: 1180,
        workforceCount: 6400,
        knowledgeNodeCount: 38500,
        syncLatencyMs: 18.5,
        status: 'optimal',
        lastHeartbeat: new Date().toISOString(),
      },
      {
        id: 'cluster-apac-1',
        clusterName: 'Asia-Pacific Ultra-Low Latency Hub',
        region: 'ap-northeast-1 / ap-southeast-1',
        activeAgentsCount: 1650,
        workforceCount: 9200,
        knowledgeNodeCount: 49000,
        syncLatencyMs: 22.1,
        status: 'optimal',
        lastHeartbeat: new Date().toISOString(),
      },
    ];

    for (const c of defaultClusters) {
      this.clusters.set(c.id, c);
    }

    this.meshes.set('global-mesh-core', {
      meshId: 'global-mesh-core',
      primaryClusterId: 'cluster-na-1',
      federatedClusterIds: ['cluster-eu-1', 'cluster-apac-1'],
      totalBandwidthThroughputGbps: 450.0,
      activeSharedMemories: 145000,
      federatedConsensusScore: 99.8,
    });
  }

  async registerCluster(data: Partial<PlanetaryClusterNodeDto>): Promise<PlanetaryClusterNodeDto> {
    const node: PlanetaryClusterNodeDto = {
      id: data.id || `cluster-${Date.now()}`,
      clusterName: data.clusterName || 'Regional Planetary Cluster',
      region: data.region || 'global-anycast',
      activeAgentsCount: data.activeAgentsCount || 50,
      workforceCount: data.workforceCount || 200,
      knowledgeNodeCount: data.knowledgeNodeCount || 1000,
      syncLatencyMs: data.syncLatencyMs || 15.0,
      status: data.status || 'optimal',
      lastHeartbeat: new Date().toISOString(),
    };

    this.clusters.set(node.id, node);
    await this.repo.recordPlanetaryEvent(
      'federation_formed',
      `Registered new planetary cluster: ${node.clusterName}`,
      node.id,
      { region: node.region }
    );
    return node;
  }

  async listClusters(): Promise<PlanetaryClusterNodeDto[]> {
    return Array.from(this.clusters.values());
  }

  async getCollaborationMesh(): Promise<PlanetaryCollaborationMeshDto> {
    return this.meshes.get('global-mesh-core')!;
  }

  async routeDistributedKnowledge(sourceClusterId: string, targetClusterId: string, payloadSizeKb: number): Promise<{ success: boolean; latencyMs: number; proofHash: string }> {
    const src = this.clusters.get(sourceClusterId);
    const dest = this.clusters.get(targetClusterId);
    if (!src || !dest) {
      throw new Error('Invalid cluster routing endpoint specified');
    }

    const latency = (src.syncLatencyMs + dest.syncLatencyMs) / 2 + (payloadSizeKb / 1000) * 0.5;
    return {
      success: true,
      latencyMs: parseFloat(latency.toFixed(2)),
      proofHash: `0x${randomUUID().replace(/-/g, '')}`,
    };
  }
}
