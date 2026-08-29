import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DigitalEmployeeService } from '../../src/modules/organization-engine/digitalEmployeeService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { DigitalEmployeeRole, EmployeeEmploymentStatus } from '@codeforge/shared';

describe('Phase 19: Digital Employee System Unit Tests', () => {
  it('should provision an AI specialist with capabilities and seniority tier', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new DigitalEmployeeService(repo);

    const emp = await service.provisionDigitalEmployee({
      organizationId: 'org-test-1',
      name: 'Cyber-Architect-01',
      role: DigitalEmployeeRole.AI_ENGINEER,
      seniorityTier: 'Principal Autonomous Architect',
      primarySpecialization: 'Distributed Systems & Compiler Synthesis',
    });

    assert.ok(emp);
    assert.strictEqual(emp.name, 'Cyber-Architect-01');
    assert.strictEqual(emp.role, DigitalEmployeeRole.AI_ENGINEER);
    assert.strictEqual(emp.status, EmployeeEmploymentStatus.ACTIVE);
    assert.ok(emp.capabilities.length >= 2);
    assert.ok(emp.velocityScore >= 95.0);
  });

  it('should provision digital employees across all required specialist roles', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new DigitalEmployeeService(repo);

    const roles = [
      DigitalEmployeeRole.AI_ENGINEER,
      DigitalEmployeeRole.AI_RESEARCHER,
      DigitalEmployeeRole.AI_PRODUCT_MANAGER,
      DigitalEmployeeRole.AI_DESIGNER,
      DigitalEmployeeRole.AI_ANALYST,
      DigitalEmployeeRole.AI_EXECUTIVE,
    ];

    for (const r of roles) {
      const emp = await service.provisionDigitalEmployee({
        organizationId: 'org-test-1',
        name: `Agent-${r}`,
        role: r,
      });
      assert.strictEqual(emp.role, r);
      assert.ok(emp.capabilities.length > 0);
    }
  });

  it('should evaluate employee performance and generate skill upskill pathways', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new DigitalEmployeeService(repo);

    const emp = await service.provisionDigitalEmployee({
      organizationId: 'org-test-1',
      name: 'Agent-Analyst-Prime',
      role: DigitalEmployeeRole.AI_ANALYST,
    });

    const perf = await service.evaluateEmployeePerformance(emp.id);
    assert.ok(perf);
    assert.strictEqual(perf.employeeId, emp.id);
    assert.ok(perf.velocityScore >= 90);
    assert.ok(perf.accuracyScore >= 90);
    assert.strictEqual(perf.performanceRating, 'OPTIMAL');
    assert.ok(perf.recommendedSkillUpskill.length > 0);
  });
});
