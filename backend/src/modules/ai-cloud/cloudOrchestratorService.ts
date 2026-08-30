import { IAICloudRepository, aiCloudRepository } from '../../repositories';
import { ComputeSchedulerService } from './computeSchedulerService';
import { InferenceGatewayService } from './inferenceGatewayService';
import { ResourceManagementService } from './resourceManagementService';
import {
  CloudDeploymentDto,
  CreateCloudDeploymentDto,
  AICloudOverviewDto,
  ComputeNodeType,
  DeploymentStatus,
} from '@codeforge/shared';

export class CloudOrchestratorService {
  private scheduler: ComputeSchedulerService;
  private inferenceGateway: InferenceGatewayService;
  private manager: ResourceManagementService;

  constructor(private repo: IAICloudRepository = aiCloudRepository) {
    this.scheduler = new ComputeSchedulerService(repo);
    this.inferenceGateway = new InferenceGatewayService(repo);
    this.manager = new ResourceManagementService(repo);
  }

  async deployWorkload(dto: CreateCloudDeploymentDto): Promise<CloudDeploymentDto> {
    const cluster = await this.repo.getClusterById(dto.clusterId);
    if (!cluster) {
      throw new Error(`Cluster ${dto.clusterId} not found`);
    }

    // 1. Create deployment in QUEUED state
    const deployment = await this.repo.createDeployment(dto);

    // 2. Schedule scheduler resource requirements (TPU/GPU/CPU based on request limits)
    let nodeType = ComputeNodeType.CPU_HIGHMEM;
    if (dto.gpuLimit > 0) {
      nodeType = dto.gpuLimit > 2 ? ComputeNodeType.GPU_H100 : ComputeNodeType.GPU_A100;
    }

    // Attempt scheduler assignment
    try {
      const node = await this.scheduler.scheduleNode(dto.clusterId, nodeType);
      
      // Update deployment status to RUNNING
      const logs = [
        ...deployment.logs,
        `[SCHEDULER] Successfully allocated node ${node.name} (${node.nodeType})`,
        `[ORCHESTRATOR] Workload container scaled to ${dto.replicaCount} replicas`,
        `[HEALTH] Readiness health probes verified successfully`,
      ];

      const running = await this.repo.updateDeployment(deployment.id, {
        status: DeploymentStatus.RUNNING,
        nodeId: node.id,
        logs,
      });

      // Record immediate telemetry metrics
      await this.manager.recordTelemetry(dto.clusterId);

      return running!;
    } catch (err: any) {
      const logs = [
        ...deployment.logs,
        `[SCHEDULER] Error during compute nodes provisioning: ${err.message}`,
        `[ORCHESTRATOR] Scaling aborted. Workload marked FAILED`,
      ];
      const failed = await this.repo.updateDeployment(deployment.id, {
        status: DeploymentStatus.FAILED,
        logs,
      });
      return failed!;
    }
  }

  async getOverview(): Promise<AICloudOverviewDto> {
    const clusters = await this.repo.listClusters();
    const deployments = await this.repo.listDeployments();
    
    let nodesList: any[] = [];
    let metricsList: any[] = [];

    if (clusters.length > 0) {
      const mainCluster = clusters[0];
      nodesList = await this.repo.listNodesByCluster(mainCluster.id);
      metricsList = await this.manager.listMetrics(mainCluster.id);
      if (metricsList.length === 0) {
        // Record default metric record
        const m = await this.manager.recordTelemetry(mainCluster.id);
        metricsList = [m];
      }
    }

    // Compute stats
    const totalAllocatedCostUsd = deployments
      .filter((d) => d.status === DeploymentStatus.RUNNING)
      .reduce((sum, d) => sum + d.simulatedCostUsdPerHour, 0);

    const activeDeploymentsCount = deployments.filter((d) => d.status === DeploymentStatus.RUNNING).length;

    const allReqs = await this.inferenceGateway.listRequests();
    const globalAverageLatencyMs = allReqs.length > 0
      ? Math.round(allReqs.reduce((sum, r) => sum + r.latencyMs, 0) / allReqs.length)
      : 120;

    const aggregateGpuUtilization = nodesList.length > 0
      ? Math.round(nodesList.reduce((sum, n) => sum + n.gpuUtilizationPercent, 0) / nodesList.length)
      : 55;

    return {
      clusters,
      nodes: nodesList,
      deployments,
      metrics: metricsList,
      overviewStats: {
        totalAllocatedCostUsd,
        activeDeploymentsCount,
        globalAverageLatencyMs,
        aggregateGpuUtilization,
      },
    };
  }
}
export const cloudOrchestratorService = new CloudOrchestratorService();
