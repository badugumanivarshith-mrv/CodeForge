import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DocumentUnderstandingService } from '../../src/modules/multimodal/documentUnderstandingService';
import { MultimodalRepository } from '../../src/repositories/MultimodalRepository';
import { AssetType } from '@codeforge/shared';

describe('Phase 25: Document Understanding Service Unit Tests', () => {
  const repo = new MultimodalRepository();
  const documentService = new DocumentUnderstandingService(repo);

  test('should parse document structures and extract content', async () => {
    const asset = await repo.createMediaAsset({
      name: 'annual_report.pdf',
      storageUrl: 'https://storage/annual_report.pdf',
      assetType: AssetType.DOCUMENT,
      fileSizeCharacters: 12000,
    });

    const result = await documentService.analyzeDocument(asset.id);
    assert.strictEqual(result.assetId, asset.id);
    assert.ok(result.detectedTags.includes('financials'));
    assert.strictEqual(result.confidenceScore, 0.98);
  });

  test('should reject non-document assets for document understanding', async () => {
    const asset = await repo.createMediaAsset({
      name: 'icon.png',
      storageUrl: 'https://storage/icon.png',
      assetType: AssetType.IMAGE,
      fileSizeCharacters: 350,
    });

    await assert.rejects(async () => {
      await documentService.analyzeDocument(asset.id);
    }, /is not a document/);
  });
});
