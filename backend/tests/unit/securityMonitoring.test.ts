import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SecurityMonitoringService } from '../../src/modules/cybersecurity/securityMonitoringService';
import { CybersecurityRepository } from '../../src/repositories/CybersecurityRepository';
import { ThreatSeverity } from '@codeforge/shared';

describe('Phase 26: Security Monitoring Service Unit Tests', () => {
  const repo = new CybersecurityRepository();
  const monitoringService = new SecurityMonitoringService(repo);

  test('should log a new security event successfully', async () => {
    const event = await monitoringService.logEvent({
      eventType: 'Port Scan Detected',
      sourceIp: '198.51.100.80',
      severity: ThreatSeverity.MEDIUM,
      payload: { scannedPorts: [80, 443, 8080] },
    });

    assert.ok(event.id);
    assert.strictEqual(event.eventType, 'Port Scan Detected');
    assert.strictEqual(event.sourceIp, '198.51.100.80');
    assert.strictEqual(event.severity, ThreatSeverity.MEDIUM);
  });

  test('should return list of all logged security events', async () => {
    const events = await monitoringService.listEvents();
    assert.ok(events.length >= 2); // includes seeded events
  });
});
