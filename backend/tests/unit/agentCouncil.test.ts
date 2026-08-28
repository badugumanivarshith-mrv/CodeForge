import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AgentCouncilService } from '../../src/modules/cognitive-core/agentCouncilService';
import { CollectiveReasoningService } from '../../src/modules/cognitive-core/collectiveReasoningService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { AgentCouncilType, ConsensusStatus } from '@codeforge/shared';

describe('Phase 18: Multi-Agent Collaborative Councils Unit Tests', () => {
  it('should initialize and list all 5 default specialized agent councils', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new AgentCouncilService(repo);

    const councils = await service.listCouncils();
    assert.strictEqual(councils.length, 5);

    const eng = councils.find((c) => c.councilType === AgentCouncilType.ENGINEERING_COUNCIL);
    const exec = councils.find((c) => c.councilType === AgentCouncilType.EXECUTIVE_COUNCIL);
    assert.ok(eng);
    assert.ok(exec);
  });

  it('should orchestrate multi-agent debate, detect contradictions, and ratify consensus', async () => {
    const repo = new CognitiveCoreRepository();
    const councilService = new AgentCouncilService(repo);
    const reasoningService = new CollectiveReasoningService(repo);

    const councils = await councilService.listCouncils();
    const council = councils[0];

    const debate = await reasoningService.initiateDebate({
      councilId: council.id,
      topic: 'Lattice-Based Post-Quantum Key Rotation Policy',
      perspectives: [
        {
          agentId: 'agent-sec-1',
          role: 'Security Lead',
          argument: 'Rotate keys every 60 seconds using Kyber-1024 encapsulation.',
          confidence: 0.98,
        },
        {
          agentId: 'agent-perf-1',
          role: 'Performance Engineer',
          argument: 'Rotate keys every 300 seconds to conserve compute bandwidth.',
          confidence: 0.91,
        },
      ],
    });

    assert.ok(debate);
    assert.strictEqual(debate.status, ConsensusStatus.DELIBERATING);
    assert.ok(debate.contradictionsDetected.length > 0);

    // Cast votes
    await reasoningService.castVote({
      debateId: debate.id,
      agentId: 'agent-sec-1',
      voteOption: 'aye',
      rationale: 'Prioritize zero-trust security bounds.',
    });
    await reasoningService.castVote({
      debateId: debate.id,
      agentId: 'agent-chair-1',
      voteOption: 'aye',
      rationale: 'Concur with compromise rotation interval of 120 seconds.',
    });

    const resolved = await reasoningService.resolveConsensus(debate.id);
    assert.ok(resolved);
    assert.strictEqual(resolved.status, ConsensusStatus.CONVERGED);
    assert.ok(resolved.consensusScore! >= 60.0);
    assert.ok(resolved.convergedSynthesis);
  });
});
