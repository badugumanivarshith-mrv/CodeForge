import { IAICloudRepository } from '../../repositories/interfaces/IAICloudRepository';
import { ComputeNodeDto, ComputeNodeType, ComputeNodeStatus } from '@codeforge/shared';

export class ComputeSchedulerService {
  constructor(private repo: IAICloudRepository) {}

  async scheduleNode(clusterId: string, nodeType: ComputeNodeType): Promise<ComputeNodeDto> {
    const nodes = await this.repo.listNodesByCluster(clusterId);
    
    // 1. Look for an idle node of the requested type
    const availableNode = nodes.find((n) => n.nodeType === nodeType && n.status === ComputeNodeStatus.IDLE);
    
    if (availableNode) {
      const updated = await this.repo.updateNode(availableNode.id, {
        status: ComputeNodeStatus.BUSY,
        gpuUtilizationPercent: nodeType !== ComputeNodeType.CPU_HIGHMEM ? 45.0 : 0.0,
        cpuUtilizationPercent: 30.0,
        memoryUtilizationPercent: 25.0,
      });
      return updated!;
    }

    // 2. If none, provision a new virtual node
    const count = nodes.filter((n) => n.nodeType === nodeType).length;
    const newNode = await this.repo.createNode({
      clusterId,
      name: `${nodeType.replace('_', '-')}-node-0${count + 1}`,
      nodeType,
    });

    const scheduled = await this.repo.updateNode(newNode.id, {
      status: ComputeNodeStatus.BUSY,
      gpuUtilizationPercent: nodeType !== ComputeNodeType.CPU_HIGHMEM ? 60.0 : 0.0,
      cpuUtilizationPercent: 40.0,
      memoryUtilizationPercent: 35.0,
    });

    return scheduled!;
  }

  async releaseNode(nodeId: string): Promise<void> {
    await this.repo.updateNode(nodeId, {
      status: ComputeNodeStatus.IDLE,
      gpuUtilizationPercent: 0.0,
      cpuUtilizationPercent: 0.0,
      memoryUtilizationPercent: 0.0,
    });
  }
}
