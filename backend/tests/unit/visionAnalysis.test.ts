import { test, describe } from 'node:test';
import assert from 'node:assert';
import { VisionAnalysisService } from '../../src/modules/multimodal/visionAnalysisService';
import { MultimodalRepository } from '../../src/repositories/MultimodalRepository';
import { AssetType } from '@codeforge/shared';

describe('Phase 25: Vision Analysis Service Unit Tests', () => {
  const repo = new MultimodalRepository();
  const visionService = new VisionAnalysisService(repo);

  test('should detect image tags and perform ocr analysis', async () => {
    const asset = await repo.createMediaAsset({
      name: 'input_diagram.png',
      storageUrl: 'https://storage/input_diagram.png',
      assetType: AssetType.IMAGE,
      fileSizeCharacters: 120,
    });

    const result = await visionService.analyzeImage(asset.id);
    assert.strictEqual(result.assetId, asset.id);
    assert.ok(result.detectedTags.includes('architecture'));
    assert.strictEqual(result.confidenceScore, 0.97);
  });

  test('should reject non-image assets for vision analysis', async () => {
    const asset = await repo.createMediaAsset({
      name: 'ledger.pdf',
      storageUrl: 'https://storage/ledger.pdf',
      assetType: AssetType.DOCUMENT,
      fileSizeCharacters: 500,
    });

    await assert.rejects(async () => {
      await visionService.analyzeImage(asset.id);
    }, /is not an image/);
  });
});
