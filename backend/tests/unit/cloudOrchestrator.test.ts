import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AICloudRepository } from '../../src/repositories/AICloudRepository';
import { CloudOrchestratorService } from '../../src/modules/ai-cloud/cloudOrchestratorService';
import { WorkloadType, DeploymentStatus } from '@codeforge/shared';

describe('Phase 24: Cloud Orchestrator Service Unit Tests', () => {
  it('should deploy a new workload container, schedule nodes, and log progress', async () => {
    const repo = new AICloudRepository();
    const service = new CloudOrchestratorService(repo);

    const deployment = await service.deployWorkload({
      clusterId: 'cluster-seed-1',
      workloadType: WorkloadType.TRAINING,
      replicaCount: 4,
      cpuLimit: 32,
      memoryLimitGb: 256,
      gpuLimit: 4,
    });

    assert.ok(deployment);
    assert.strictEqual(deployment.status, DeploymentStatus.RUNNING);
    assert.ok(deployment.nodeId);
    assert.ok(deployment.logs.some((l) => l.includes('Successfully allocated node')));

    const overview = await service.getOverview();
    assert.ok(overview.deployments.length >= 1);
    assert.ok(overview.overviewStats.activeDeploymentsCount >= 1);
  });
});
