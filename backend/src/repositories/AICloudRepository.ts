import { randomUUID } from 'crypto';
import {
  CloudClusterDto,
  CreateCloudClusterDto,
  ComputeNodeDto,
  CreateComputeNodeDto,
  CloudDeploymentDto,
  CreateCloudDeploymentDto,
  InferenceRequestDto,
  CreateInferenceRequestDto,
  ResourceMetricsDto,
  CreateResourceMetricsDto,
  ClusterRegion,
  ClusterStatus,
  ComputeNodeType,
  ComputeNodeStatus,
  DeploymentStatus,
  WorkloadType,
} from '@codeforge/shared';
import { IAICloudRepository } from './interfaces/IAICloudRepository';

export class AICloudRepository implements IAICloudRepository {
  private clusters: Map<string, CloudClusterDto> = new Map();
  private nodes: Map<string, ComputeNodeDto> = new Map();
  private deployments: Map<string, CloudDeploymentDto> = new Map();
  private inferenceRequests: Map<string, InferenceRequestDto> = new Map();
  private metrics: Map<string, ResourceMetricsDto[]> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const clusterId1 = 'cluster-seed-1';
    const cluster1: CloudClusterDto = {
      id: clusterId1,
      name: 'Primary H100 Cluster - North America',
      region: ClusterRegion.US_EAST,
      status: ClusterStatus.HEALTHY,
      totalGpus: 64,
      availableGpus: 48,
      totalMemoryGb: 4096,
      availableMemoryGb: 3072,
      totalCpuCores: 512,
      availableCpuCores: 384,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clusters.set(clusterId1, cluster1);

    const nodeId1 = 'node-seed-1';
    const node1: ComputeNodeDto = {
      id: nodeId1,
      clusterId: clusterId1,
      name: 'gpu-node-h100-01',
      nodeType: ComputeNodeType.GPU_H100,
      status: ComputeNodeStatus.BUSY,
      gpuUtilizationPercent: 78.5,
      memoryUtilizationPercent: 62.1,
      cpuUtilizationPercent: 45.3,
      temperatureCelsius: 68.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const node2: ComputeNodeDto = {
      id: 'node-seed-2',
      clusterId: clusterId1,
      name: 'gpu-node-a100-02',
      nodeType: ComputeNodeType.GPU_A100,
      status: ComputeNodeStatus.IDLE,
      gpuUtilizationPercent: 0.0,
      memoryUtilizationPercent: 12.5,
      cpuUtilizationPercent: 5.0,
      temperatureCelsius: 42.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nodes.set(nodeId1, node1);
    this.nodes.set(node2.id, node2);

    const deplId1 = 'depl-seed-1';
    const deployment1: CloudDeploymentDto = {
      id: deplId1,
      clusterId: clusterId1,
      nodeId: nodeId1,
      workloadType: WorkloadType.INFERENCE,
      status: DeploymentStatus.RUNNING,
      replicaCount: 2,
      cpuLimit: 16,
      memoryLimitGb: 128,
      gpuLimit: 2,
      simulatedCostUsdPerHour: 4.80,
      logs: [
        '[SYSTEM] Initializing pod deployment...',
        '[GPU] CUDA driver linked successfully. GPUs allocated: 2x H100.',
        '[GATEWAY] Proxy route mapped under /api/v1/inference.',
        '[HEALTH] Readiness probe succeeded. Workload online.',
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deployments.set(deplId1, deployment1);

    const req1: InferenceRequestDto = {
      id: 'req-seed-1',
      deploymentId: deplId1,
      promptTokens: 1500,
      completionTokens: 250,
      latencyMs: 145.2,
      statusCode: 200,
      routedRegion: ClusterRegion.US_EAST,
      createdAt: new Date().toISOString(),
    };
    this.inferenceRequests.set(req1.id, req1);

    const metric1: ResourceMetricsDto = {
      id: 'metric-seed-1',
      clusterId: clusterId1,
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 35.8,
      memoryUsagePercent: 58.2,
      gpuUsagePercent: 68.4,
      networkInboundGbps: 2.4,
      networkOutboundGbps: 4.8,
      estimatedCostUsd: 115.50,
    };
    this.metrics.set(clusterId1, [metric1]);
  }

  // 1. Clusters
  async createCluster(dto: CreateCloudClusterDto): Promise<CloudClusterDto> {
    const id = randomUUID();
    const cluster: CloudClusterDto = {
      id,
      ...dto,
      status: ClusterStatus.HEALTHY,
      availableGpus: dto.totalGpus,
      availableMemoryGb: dto.totalMemoryGb,
      availableCpuCores: dto.totalCpuCores,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clusters.set(id, cluster);
    return cluster;
  }

  async getClusterById(id: string): Promise<CloudClusterDto | null> {
    return this.clusters.get(id) || null;
  }

  async listClusters(region?: ClusterRegion): Promise<CloudClusterDto[]> {
    const list = Array.from(this.clusters.values());
    if (region) {
      return list.filter((c) => c.region === region);
    }
    return list;
  }

  async updateCluster(id: string, updates: Partial<CloudClusterDto>): Promise<CloudClusterDto | null> {
    const existing = this.clusters.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.clusters.set(id, updated);
    return updated;
  }

  // 2. Nodes
  async createNode(dto: CreateComputeNodeDto): Promise<ComputeNodeDto> {
    const id = randomUUID();
    const node: ComputeNodeDto = {
      id,
      ...dto,
      status: ComputeNodeStatus.IDLE,
      gpuUtilizationPercent: 0.0,
      memoryUtilizationPercent: 0.0,
      cpuUtilizationPercent: 0.0,
      temperatureCelsius: 38.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nodes.set(id, node);
    return node;
  }

  async getNodeById(id: string): Promise<ComputeNodeDto | null> {
    return this.nodes.get(id) || null;
  }

  async listNodesByCluster(clusterId: string): Promise<ComputeNodeDto[]> {
    return Array.from(this.nodes.values()).filter((n) => n.clusterId === clusterId);
  }

  async updateNode(id: string, updates: Partial<ComputeNodeDto>): Promise<ComputeNodeDto | null> {
    const existing = this.nodes.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.nodes.set(id, updated);
    return updated;
  }

  // 3. Deployments
  async createDeployment(dto: CreateCloudDeploymentDto): Promise<CloudDeploymentDto> {
    const id = randomUUID();
    const deployment: CloudDeploymentDto = {
      id,
      ...dto,
      status: DeploymentStatus.QUEUED,
      simulatedCostUsdPerHour: dto.replicaCount * (dto.cpuLimit * 0.05 + dto.gpuLimit * 1.5),
      logs: ['[SYSTEM] Deployment request queued.'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deployments.set(id, deployment);
    return deployment;
  }

  async getDeploymentById(id: string): Promise<CloudDeploymentDto | null> {
    return this.deployments.get(id) || null;
  }

  async listDeployments(clusterId?: string): Promise<CloudDeploymentDto[]> {
    const list = Array.from(this.deployments.values());
    if (clusterId) {
      return list.filter((d) => d.clusterId === clusterId);
    }
    return list;
  }

  async updateDeployment(id: string, updates: Partial<CloudDeploymentDto>): Promise<CloudDeploymentDto | null> {
    const existing = this.deployments.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.deployments.set(id, updated);
    return updated;
  }

  // 4. Inference
  async createInferenceRequest(dto: CreateInferenceRequestDto): Promise<InferenceRequestDto> {
    const id = randomUUID();
    const req: InferenceRequestDto = {
      id,
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.inferenceRequests.set(id, req);
    return req;
  }

  async listInferenceRequests(deploymentId?: string): Promise<InferenceRequestDto[]> {
    const list = Array.from(this.inferenceRequests.values());
    if (deploymentId) {
      return list.filter((r) => r.deploymentId === deploymentId);
    }
    return list;
  }

  // 5. Metrics
  async createResourceMetric(dto: CreateResourceMetricsDto): Promise<ResourceMetricsDto> {
    const id = randomUUID();
    const metric: ResourceMetricsDto = {
      id,
      ...dto,
      timestamp: new Date().toISOString(),
    };
    const list = this.metrics.get(dto.clusterId) || [];
    list.push(metric);
    this.metrics.set(dto.clusterId, list);
    return metric;
  }

  async listResourceMetrics(clusterId: string): Promise<ResourceMetricsDto[]> {
    return this.metrics.get(clusterId) || [];
  }
}
export const aiCloudRepository = new AICloudRepository();
