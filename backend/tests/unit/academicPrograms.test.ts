import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { AcademicProgramsService } from '../../src/modules/research-university/academicProgramsService';
import { AcademicDepartment, ResearchProgramStatus } from '@codeforge/shared';

describe('Phase 22: Academic Programs & Projects Unit Tests', () => {
  it('should propose a new research program with auto-assigned faculty agent and milestones', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new AcademicProgramsService(repo);

    const program = await service.proposeProgram({
      name: 'Planetary Autonomous Bio-Molecular Discovery',
      description: 'Generative diffusion operators for denovo catalyst design and molecular folding.',
      department: AcademicDepartment.ENGINEERING,
      allocatedBudgetUsd: 1500000,
    });

    assert.ok(program);
    assert.ok(program.id);
    assert.strictEqual(program.name, 'Planetary Autonomous Bio-Molecular Discovery');
    assert.strictEqual(program.department, AcademicDepartment.ENGINEERING);
    assert.strictEqual(program.status, ResearchProgramStatus.PROPOSED);
    assert.ok(program.leadFacultyAgent.length > 0);
    assert.ok(program.targetMilestones.length >= 4);
    assert.strictEqual(program.allocatedBudgetUsd, 1500000);
  });

  it('should activate a program and advance its lifecycle to peer review', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new AcademicProgramsService(repo);

    const program = await service.proposeProgram({
      name: 'Autonomous Quantum Invariance',
      description: 'Proving topological invariance under Hamiltonian perturbations.',
      department: AcademicDepartment.MATHEMATICS,
    });

    const activated = await service.activateProgram(program.id);
    assert.strictEqual(activated.status, ResearchProgramStatus.ACTIVE);

    const inReview = await service.submitProgramForPeerReview(program.id);
    assert.strictEqual(inReview.status, ResearchProgramStatus.PEER_REVIEW);
  });

  it('should create and list sub-projects within a research program', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new AcademicProgramsService(repo);

    const program = await service.proposeProgram({
      name: 'Supercomputing Graph Neural Architecture',
      description: 'Multi-terabyte graph embedding with sublinear latency.',
      department: AcademicDepartment.COMPUTER_SCIENCE,
    });

    const project = await service.createProject({
      programId: program.id,
      title: 'Topological Sub-Graph Partitioning Optimization',
      abstract: 'Ablation of hypergraph clustering algorithms across 100k nodes.',
      department: AcademicDepartment.COMPUTER_SCIENCE,
    });

    assert.ok(project);
    assert.strictEqual(project.programId, program.id);
    assert.strictEqual(project.title, 'Topological Sub-Graph Partitioning Optimization');

    const projects = await service.listProjectsByProgram(program.id);
    assert.strictEqual(projects.length, 1);
    assert.strictEqual(projects[0].id, project.id);
  });
});
