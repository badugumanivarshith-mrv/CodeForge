import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SoftwareFactoryRepository } from '../../src/repositories/SoftwareFactoryRepository';
import { CodeGenerationService } from '../../src/modules/software-factory/codeGenerationService';
import { ArtifactType } from '@codeforge/shared';

describe('Phase 23: Code Generation & Artifacts Unit Tests', () => {
  it('should generate source code and configuration files matching frameworks', async () => {
    const repo = new SoftwareFactoryRepository();
    const service = new CodeGenerationService(repo);

    // Source Code
    const art1 = await service.generateArtifact(
      'proj-seed-1',
      'task-seed-2',
      'src/controllers/resource.controller.ts'
    );
    assert.ok(art1);
    assert.strictEqual(art1.artifactType, ArtifactType.SOURCE_CODE);
    assert.ok(art1.fileContent.includes('class ResourceController'));

    // Config File
    const art2 = await service.generateArtifact(
      'proj-seed-1',
      'task-seed-2',
      'package.json'
    );
    assert.ok(art2);
    assert.strictEqual(art2.artifactType, ArtifactType.CONFIGURATION);
    assert.ok(art2.fileContent.includes('dependencies'));
  });
});
