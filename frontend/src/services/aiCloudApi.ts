import {
  CloudClusterDto,
  CloudDeploymentDto,
  CreateCloudDeploymentDto,
  InferenceRequestDto,
  ResourceMetricsDto,
  AICloudOverviewDto,
  ClusterRegion,
  ClusterStatus,
  ComputeNodeType,
  ComputeNodeStatus,
  DeploymentStatus,
  WorkloadType,
} from '@codeforge/shared';

const API_BASE = '/api/v1/ai-cloud';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const aiCloudApi = {
  // 1. Overview & Metrics
  async getOverview(): Promise<AICloudOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/overview`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('API error, falling back to mock data', e);
    }

    return {
      clusters: [
        {
          id: 'cluster-seed-1',
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
        },
      ],
      nodes: [
        {
          id: 'node-seed-1',
          clusterId: 'cluster-seed-1',
          name: 'gpu-node-h100-01',
          nodeType: ComputeNodeType.GPU_H100,
          status: ComputeNodeStatus.BUSY,
          gpuUtilizationPercent: 78.5,
          memoryUtilizationPercent: 62.1,
          cpuUtilizationPercent: 45.3,
          temperatureCelsius: 68.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'node-seed-2',
          clusterId: 'cluster-seed-1',
          name: 'gpu-node-a100-02',
          nodeType: ComputeNodeType.GPU_A100,
          status: ComputeNodeStatus.IDLE,
          gpuUtilizationPercent: 0.0,
          memoryUtilizationPercent: 12.5,
          cpuUtilizationPercent: 5.0,
          temperatureCelsius: 42.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      deployments: [
        {
          id: 'depl-seed-1',
          clusterId: 'cluster-seed-1',
          nodeId: 'node-seed-1',
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
        },
      ],
      metrics: [
        {
          id: 'metric-seed-1',
          clusterId: 'cluster-seed-1',
          timestamp: new Date().toISOString(),
          cpuUsagePercent: 35.8,
          memoryUsagePercent: 58.2,
          gpuUsagePercent: 68.4,
          networkInboundGbps: 2.4,
          networkOutboundGbps: 4.8,
          estimatedCostUsd: 115.50,
        },
      ],
      overviewStats: {
        totalAllocatedCostUsd: 4.80,
        activeDeploymentsCount: 1,
        globalAverageLatencyMs: 145.2,
        aggregateGpuUtilization: 39.2,
      },
    };
  },

  async getMetrics(clusterId: string): Promise<ResourceMetricsDto[]> {
    const res = await fetch(`${API_BASE}/metrics?clusterId=${clusterId}`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 2. Clusters & Deployments
  async listClusters(region?: ClusterRegion): Promise<CloudClusterDto[]> {
    const url = region ? `${API_BASE}/clusters?region=${region}` : `${API_BASE}/clusters`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async deployWorkload(dto: CreateCloudDeploymentDto): Promise<CloudDeploymentDto> {
    const res = await fetch(`${API_BASE}/deploy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async routeInference(deploymentId: string, prompt: string): Promise<InferenceRequestDto> {
    const res = await fetch(`${API_BASE}/inference`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ deploymentId, prompt }),
    });
    const json = await res.json();
    return json.data;
  },
};
