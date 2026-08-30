import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SoftwareFactoryRepository } from '../../src/repositories/SoftwareFactoryRepository';
import { ArchitectureDesignService } from '../../src/modules/software-factory/architectureDesignService';

describe('Phase 23: Architecture Design & Blueprints Unit Tests', () => {
  it('should formulate architecture layout diagram and verify components config', async () => {
    const repo = new SoftwareFactoryRepository();
    const service = new ArchitectureDesignService(repo);

    const bp = await service.designBlueprint('proj-seed-1');
    assert.ok(bp);
    assert.ok(bp.diagramMermaid.includes('API Gateway'));
    assert.ok(bp.apiGateways.length >= 1);
    assert.ok(bp.databaseSchemas['users']);
  });
});
