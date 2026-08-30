import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DataPipelineService } from '../../src/modules/data-intelligence/dataPipelineService';
import { DataIntelligenceRepository } from '../../src/repositories/DataIntelligenceRepository';
import { DataSourceType } from '@codeforge/shared';

describe('Phase 27: Data Pipeline Service Unit Tests', () => {
  const repo = new DataIntelligenceRepository();
  const pipelineService = new DataPipelineService(repo);

  test('should import data sources successfully', async () => {
    const source = await pipelineService.importData({
      name: 'Event Stream Analytics Logs',
      sourceType: DataSourceType.API_STREAM,
      connectionDetails: { url: 'https://stream.internal/v1/events' },
      rowCount: 8500,
      fileSizeKb: 1520,
    });

    assert.ok(source.id);
    assert.strictEqual(source.name, 'Event Stream Analytics Logs');
    assert.strictEqual(source.sourceType, DataSourceType.API_STREAM);
    assert.strictEqual(source.rowCount, 8500);
  });

  test('should return list of all registered data sources', async () => {
    const sources = await pipelineService.listSources();
    assert.ok(sources.length >= 2); // includes seeded sources
  });
});
