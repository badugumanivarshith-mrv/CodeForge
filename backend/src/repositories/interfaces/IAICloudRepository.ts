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
} from '@codeforge/shared';

export interface IAICloudRepository {
  // Cloud Clusters
  createCluster(dto: CreateCloudClusterDto): Promise<CloudClusterDto>;
  getClusterById(id: string): Promise<CloudClusterDto | null>;
  listClusters(region?: ClusterRegion): Promise<CloudClusterDto[]>;
  updateCluster(id: string, updates: Partial<CloudClusterDto>): Promise<CloudClusterDto | null>;

  // Compute Nodes
  createNode(dto: CreateComputeNodeDto): Promise<ComputeNodeDto>;
  getNodeById(id: string): Promise<ComputeNodeDto | null>;
  listNodesByCluster(clusterId: string): Promise<ComputeNodeDto[]>;
  updateNode(id: string, updates: Partial<ComputeNodeDto>): Promise<ComputeNodeDto | null>;

  // Cloud Deployments
  createDeployment(dto: CreateCloudDeploymentDto): Promise<CloudDeploymentDto>;
  getDeploymentById(id: string): Promise<CloudDeploymentDto | null>;
  listDeployments(clusterId?: string): Promise<CloudDeploymentDto[]>;
  updateDeployment(id: string, updates: Partial<CloudDeploymentDto>): Promise<CloudDeploymentDto | null>;

  // Inference Requests
  createInferenceRequest(dto: CreateInferenceRequestDto): Promise<InferenceRequestDto>;
  listInferenceRequests(deploymentId?: string): Promise<InferenceRequestDto[]>;

  // Resource Metrics
  createResourceMetric(dto: CreateResourceMetricsDto): Promise<ResourceMetricsDto>;
  listResourceMetrics(clusterId: string): Promise<ResourceMetricsDto[]>;
}
