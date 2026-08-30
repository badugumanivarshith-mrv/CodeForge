import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { DigitalLaboratoryService } from '../../src/modules/research-university/digitalLaboratoryService';
import { AcademicDepartment, LabType, LabStatus, ExperimentStatus } from '@codeforge/shared';

describe('Phase 22: Digital Research Laboratories Unit Tests', () => {
  it('should provision a high-capacity virtual laboratory cluster', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new DigitalLaboratoryService(repo);

    const lab = await service.provisionLaboratory({
      name: 'Topological Quantum Lattice Simulation Facility',
      labType: LabType.FUTURE_TECHNOLOGIES_LAB,
      department: AcademicDepartment.MATHEMATICS,
      computeCapacityTeraflops: 75000.0,
    });

    assert.ok(lab);
    assert.ok(lab.id);
    assert.strictEqual(lab.status, LabStatus.OPERATIONAL);
    assert.strictEqual(lab.computeCapacityTeraflops, 75000.0);
    assert.ok(lab.directorAgent.includes('Topological Quantum Lattice'));
  });

  it('should execute simulation experiment and verify reproducibility metrics', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new DigitalLaboratoryService(repo);

    const exp = await service.runExperiment({
      labId: 'lab-ai-core',
      hypothesisId: 'hyp-neuro-symbolic-01',
      title: 'Hamiltonian Neuro-Symbolic State Space Trajectory Sweep',
      parameters: { learningRate: 0.0001, batchSize: 2048, precision: 'fp16' },
      datasetRef: 'formal-math-bench-v2',
      reproducibilityScore: 98.4,
    });

    assert.ok(exp);
    assert.strictEqual(exp.labId, 'lab-ai-core');
    assert.strictEqual(exp.status, ExperimentStatus.COMPLETED);
    assert.strictEqual(exp.reproducibilityScore, 98.4);
    assert.ok(exp.executionDurationMs > 0);
    assert.ok(exp.logs && exp.logs.length >= 3);

    const metrics = await service.getLaboratoryMetrics('lab-ai-core');
    assert.ok(metrics);
    assert.strictEqual(metrics.labId, 'lab-ai-core');
    assert.ok(metrics.activeSimulationsCount >= 1);
    assert.ok(metrics.averageExperimentReproducibility >= 90.0);
  });
});
