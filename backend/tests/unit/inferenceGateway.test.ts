import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AICloudRepository } from '../../src/repositories/AICloudRepository';
import { InferenceGatewayService } from '../../src/modules/ai-cloud/inferenceGatewayService';

describe('Phase 24: Inference Gateway Service Unit Tests', () => {
  it('should route user prompt to mapped region and calculate token counts', async () => {
    const repo = new AICloudRepository();
    const service = new InferenceGatewayService(repo);

    const request = await service.routeInference('depl-seed-1', 'Translate the planetary ledger parameters to English.');
    assert.ok(request);
    assert.ok(request.promptTokens > 0);
    assert.ok(request.completionTokens > 0);
    assert.ok(request.latencyMs > 0);
    assert.strictEqual(request.statusCode, 200);
  });
});
