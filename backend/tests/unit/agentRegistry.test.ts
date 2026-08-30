import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AgentRegistryService } from '../../src/modules/agent-ecosystem/agentRegistryService';
import { AgentEcosystemRepository } from '../../src/repositories/AgentEcosystemRepository';
import { EcosystemAgentType } from '@codeforge/shared';

describe('Phase 29: Agent Registry Service Unit Tests', () => {
  const repo = new AgentEcosystemRepository();
  const service = new AgentRegistryService(repo);

  test('should register an autonomous agent successfully', async () => {
    const agent = await service.registerAgent('test-user-id', {
      agentName: 'Cognitive Validator Core',
      agentType: EcosystemAgentType.COGNITIVE_COPROCESSOR,
      capabilities: ['Invariant Assessment', 'AST Proof Synthesis'],
    });

    assert.ok(agent.id);
    assert.strictEqual(agent.agentName, 'Cognitive Validator Core');
    assert.strictEqual(agent.agentType, EcosystemAgentType.COGNITIVE_COPROCESSOR);
  });

  test('should retrieve agent metrics and overview dashboard telemetry', async () => {
    const metrics = await service.getMetrics('test-user-id');
    assert.ok(metrics.activeAgentsCount > 0);
    assert.ok(metrics.averageSuccessRate > 0);

    const overview = await service.getOverview('test-user-id');
    assert.ok(overview.agentsList.length > 0);
  });
});
