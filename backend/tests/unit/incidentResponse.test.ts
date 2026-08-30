import { test, describe } from 'node:test';
import assert from 'node:assert';
import { IncidentResponseService } from '../../src/modules/cybersecurity/incidentResponseService';
import { CybersecurityRepository } from '../../src/repositories/CybersecurityRepository';
import { ThreatSeverity, IncidentStatus } from '@codeforge/shared';

describe('Phase 26: Incident Response Service Unit Tests', () => {
  const repo = new CybersecurityRepository();
  const incidentService = new IncidentResponseService(repo);

  test('should declare a new incident successfully in open status', async () => {
    const incident = await incidentService.declareIncident({
      title: 'Database Data Leakage Alert',
      description: 'Customer table records dumped to unauthorized external storage.',
      severity: ThreatSeverity.CRITICAL,
      assignedTeam: 'Incident-Response-Beta',
    });

    assert.ok(incident.id);
    assert.strictEqual(incident.status, IncidentStatus.OPEN);
    assert.strictEqual(incident.assignedTeam, 'Incident-Response-Beta');
  });

  test('should transition incident to contained with action details', async () => {
    const contained = await incidentService.applyContainment('incident-seed-1', 'Closed outbound database port 3306');
    assert.strictEqual(contained.status, IncidentStatus.CONTAINED);
    assert.strictEqual(contained.containmentAction, 'Closed outbound database port 3306');
  });

  test('should resolve incident status', async () => {
    const resolved = await incidentService.resolveIncident('incident-seed-1');
    assert.strictEqual(resolved.status, IncidentStatus.RESOLVED);
  });
});
