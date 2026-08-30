import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AgentCoordinationService } from '../../src/modules/agent-ecosystem/agentCoordinationService';
import { AgentEcosystemRepository } from '../../src/repositories/AgentEcosystemRepository';

describe('Phase 29: Agent Coordination Service Unit Tests', () => {
  const repo = new AgentEcosystemRepository();
  const service = new AgentCoordinationService(repo);

  test('should log multi-agent interactions and coordinate swarm directives', async () => {
    const list = await service.coordinateSwarm(
      'agent-seed-2',
      ['agent-seed-1'],
      'Execute continuous speculative invariant validation loop'
    );

    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].sourceAgentId, 'agent-seed-2');
    assert.strictEqual(list[0].targetAgentId, 'agent-seed-1');
    assert.strictEqual(list[0].messageType, 'SWARM_DIRECTIVE');

    const history = await service.listInteractions('agent-seed-1');
    assert.ok(history.length > 0);
  });
});
