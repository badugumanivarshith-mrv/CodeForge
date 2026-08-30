import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MultimodalEngineService } from '../../src/modules/multimodal/multimodalEngineService';
import { MultimodalRepository } from '../../src/repositories/MultimodalRepository';
import { AssetType, ReasoningComplexity } from '@codeforge/shared';

describe('Phase 25: Multimodal Engine Service Unit Tests', () => {
  const repo = new MultimodalRepository();
  const engineService = new MultimodalEngineService(repo);

  test('should register and analyze an image asset successfully', async () => {
    const outcome = await engineService.registerAndAnalyzeAsset({
      name: 'diagram.png',
      storageUrl: 'https://storage/diagram.png',
      assetType: AssetType.IMAGE,
      fileSizeCharacters: 500,
    });

    assert.ok(outcome.asset.id);
    assert.strictEqual(outcome.asset.name, 'diagram.png');
    assert.strictEqual(outcome.result.assetId, outcome.asset.id);
    assert.ok(outcome.result.detectedTags.includes('diagram'));
    assert.strictEqual(outcome.result.confidenceScore, 0.97);
  });

  test('should perform cognitive cross-media reasoning and populate knowledge base', async () => {
    const session = await engineService.performReasoning({
      sessionName: 'Cross-media Validation',
      complexity: ReasoningComplexity.CROSS_MEDIA,
      promptQuery: 'Check layout overlap with ledger balance sheets.',
    });

    assert.ok(session.id);
    assert.strictEqual(session.complexity, ReasoningComplexity.CROSS_MEDIA);
    assert.ok(session.reasoningSteps.length > 0);
    assert.ok(session.cognitiveOutput.includes(' Standby replicas'));

    const overview = await engineService.getOverview();
    const knowledge = overview.knowledgeBase.find(k => k.conceptName === 'Derived: Cross-media Validation');
    assert.ok(knowledge);
  });
});
