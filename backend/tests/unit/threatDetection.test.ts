import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ThreatDetectionService } from '../../src/modules/cybersecurity/threatDetectionService';
import { CybersecurityRepository } from '../../src/repositories/CybersecurityRepository';
import { ThreatStatus } from '@codeforge/shared';

describe('Phase 26: Threat Detection Service Unit Tests', () => {
  const repo = new CybersecurityRepository();
  const threatService = new ThreatDetectionService(repo);

  test('should detect and register threat when failed logs exceed threshold', async () => {
    const logs = ['failed', 'failed', 'failed', 'failed', 'failed', 'failed'];
    const threat = await threatService.detectAnomaly(logs);
    assert.ok(threat);
    assert.strictEqual(threat.status, ThreatStatus.ACTIVE);
    assert.ok(threat.title.includes('Excessive Traffic Burst'));
  });

  test('should not register threat if failed logs do not exceed threshold', async () => {
    const logs = ['failed', 'failed'];
    const threat = await threatService.detectAnomaly(logs);
    assert.strictEqual(threat, null);
  });

  test('should update threat status to mitigated', async () => {
    const mitigated = await threatService.mitigateThreat('threat-seed-1');
    assert.strictEqual(mitigated.status, ThreatStatus.MITIGATED);
  });
});
