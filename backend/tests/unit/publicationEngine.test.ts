import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { PublicationEngineService } from '../../src/modules/research-university/publicationEngineService';
import { AcademicDepartment, PublicationType, PublicationStatus } from '@codeforge/shared';

describe('Phase 22: Publication Engine & Citation Network Unit Tests', () => {
  it('should draft a complete academic paper in Markdown with auto-allocated DOI', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new PublicationEngineService(repo);

    const paper = await service.draftPublication({
      programId: 'prog-quantum-ai',
      title: 'Hamiltonian Geometric Invariants in Autonomous Multi-Agent Reasoning',
      abstract: 'We formalize continuous manifold constraints for zero-hallucination agentic theorem proving.',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      publicationType: PublicationType.RESEARCH_PAPER,
    });

    assert.ok(paper);
    assert.ok(paper.id);
    assert.ok(paper.doi && paper.doi.startsWith('10.1038/'));
    assert.strictEqual(paper.status, PublicationStatus.DRAFT);
    assert.ok(paper.fullMarkdownContent.includes('# Hamiltonian Geometric Invariants'));
    assert.ok(paper.fullMarkdownContent.includes('## Abstract'));
    assert.ok(paper.fullMarkdownContent.includes('## 2. Mathematical Formulation'));
    assert.ok(paper.authors.length >= 2);
  });

  it('should publish accepted paper and track citation cross-references', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new PublicationEngineService(repo);

    const paper1 = await service.draftPublication({
      programId: 'prog-quantum-ai',
      title: 'Foundational Principles of Neural-Symbolic Synthesis',
      abstract: 'Foundational principles linking discrete logic and continuous latent spaces.',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
    });

    const paper2 = await service.draftPublication({
      programId: 'prog-quantum-ai',
      title: 'Scaling Laws for Autonomous Scientific Provers',
      abstract: 'Empirical scaling laws for multi-agent reasoning clusters.',
      department: AcademicDepartment.COMPUTER_SCIENCE,
    });

    const published = await service.publishPaper(paper1.id);
    assert.strictEqual(published.status, PublicationStatus.PUBLISHED);
    assert.ok(published.publishedAt);

    const citation = await service.citePublication({
      sourcePublicationId: paper2.id,
      targetPublicationId: paper1.id,
      citationContext: 'Extending the neural-symbolic synthesis framework established by paper1.',
      semanticSimilarity: 0.94,
    });

    assert.ok(citation);
    assert.strictEqual(citation.sourcePublicationId, paper2.id);
    assert.strictEqual(citation.targetPublicationId, paper1.id);

    const updatedTarget = await service.getPublication(paper1.id);
    assert.strictEqual(updatedTarget?.citationCount, 1);
  });
});
