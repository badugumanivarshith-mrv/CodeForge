import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SoftwareFactoryRepository } from '../../src/repositories/SoftwareFactoryRepository';
import { SoftwareFactoryService } from '../../src/modules/software-factory/softwareFactoryService';
import { SoftwareProjectType, SoftwareProjectStatus, BlueprintComplexity } from '@codeforge/shared';

describe('Phase 23: Autonomous Software Factory Core Unit Tests', () => {
  it('should provision a new software project and initialize backlog tasks & blueprint', async () => {
    const repo = new SoftwareFactoryRepository();
    const service = new SoftwareFactoryService(repo);

    const project = await service.provisionProject({
      name: 'Agentic DB Broker',
      description: 'Autonomous connection pooling and query rewriting engine.',
      projectType: SoftwareProjectType.MICROSERVICE,
      complexity: BlueprintComplexity.COMPLEX,
      targetPlatform: 'GCP / Cloud Run',
      frameworks: ['Express', 'TypeScript'],
      dependencies: ['pg', 'zod'],
    });

    assert.ok(project);
    assert.ok(project.id);
    assert.strictEqual(project.name, 'Agentic DB Broker');
    assert.strictEqual(project.status, SoftwareProjectStatus.PLANNING);

    const bp = await repo.getBlueprintByProject(project.id);
    assert.ok(bp);
    assert.strictEqual(bp.projectId, project.id);
    assert.ok(bp.diagramMermaid.includes('GCP / Cloud Run'));

    const tasks = await repo.listTasksByProject(project.id);
    assert.ok(tasks.length >= 3);
  });

  it('should run a simulated build cycle and complete all tasks successfully', async () => {
    const repo = new SoftwareFactoryRepository();
    const service = new SoftwareFactoryService(repo);

    const project = await service.provisionProject({
      name: 'Agentic Broker V2',
      description: 'V2 broker',
      projectType: SoftwareProjectType.MICROSERVICE,
      complexity: BlueprintComplexity.SIMPLE,
      targetPlatform: 'Cloud Run',
      frameworks: ['Express'],
      dependencies: [],
    });

    const finished = await service.runBuildCycle(project.id);
    assert.strictEqual(finished.status, SoftwareProjectStatus.DEPLOYED);
    assert.strictEqual(finished.buildStatus, 'SUCCESS');
    assert.ok(finished.deploymentUrl);
    assert.ok(finished.repositoryUrl);

    const tasks = await repo.listTasksByProject(project.id);
    assert.ok(tasks.every((t) => t.status === 'completed'));
  });
});
