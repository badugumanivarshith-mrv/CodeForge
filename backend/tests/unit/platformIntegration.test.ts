import { test, describe } from 'node:test';
import assert from 'node:assert';
import { PlatformIntegrationService } from '../../src/modules/platform-integration/platformIntegrationService';
import { PlatformIntegrationRepository } from '../../src/repositories/PlatformIntegrationRepository';
import { PlatformEventSeverity } from '@codeforge/shared';

describe('Phase 28: Platform Integration Service Unit Tests', () => {
  const repo = new PlatformIntegrationRepository();
  const service = new PlatformIntegrationService(repo);

  test('should log a platform event successfully', async () => {
    const event = await service.logEvent({
      sourceModule: 'Cybersecurity',
      eventName: 'Intrusion Blocked',
      severity: PlatformEventSeverity.CRITICAL,
      payload: { systemId: 'sys-1' },
    });

    assert.ok(event.id);
    assert.strictEqual(event.sourceModule, 'Cybersecurity');
    assert.strictEqual(event.eventName, 'Intrusion Blocked');
    assert.strictEqual(event.severity, PlatformEventSeverity.CRITICAL);
  });

  test('should retrieve platform health diagnostics', async () => {
    const health = await service.getHealth();
    assert.strictEqual(health.status, 'healthy');
    assert.ok(health.uptimeSeconds > 0);
    assert.strictEqual(health.moduleHealth['AI Cloud'], 'healthy');
  });

  test('should query global search results correctly', async () => {
    const results = await service.search('Agent');
    assert.ok(Array.isArray(results));
  });
});
