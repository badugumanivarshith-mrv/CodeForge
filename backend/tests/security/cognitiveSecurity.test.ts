import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryEvolutionService } from '../../src/modules/cognitive-core/memoryEvolutionService';
import { GoalManagementService } from '../../src/modules/cognitive-core/goalManagementService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { CognitiveMemoryType } from '@codeforge/shared';

describe('Phase 18: Cognitive Security, Isolation & Zero-Trust Verification Tests', () => {
  it('should enforce user and tenant memory isolation (User A cannot access User B memories)', async () => {
    const repo = new CognitiveCoreRepository();
    const memoryService = new MemoryEvolutionService(repo);

    await memoryService.storeMemory({
      userId: 'user-tenant-a',
      memoryType: CognitiveMemoryType.STRATEGIC,
      conceptKey: 'Proprietary Trade Secret Architecture',
      content: 'Confidential trading algorithm hyperparameters',
      contextSummary: 'Strictly isolated',
    });

    await memoryService.storeMemory({
      userId: 'user-tenant-b',
      memoryType: CognitiveMemoryType.STRATEGIC,
      conceptKey: 'Public Open Source Spec',
      content: 'Open protocol documentation',
      contextSummary: 'Public domain',
    });

    const tenantAMemories = await memoryService.getMemories('user-tenant-a');
    const tenantBMemories = await memoryService.getMemories('user-tenant-b');

    assert.strictEqual(tenantAMemories.length, 1);
    assert.strictEqual(tenantBMemories.length, 1);
    assert.strictEqual(tenantAMemories[0].conceptKey, 'Proprietary Trade Secret Architecture');
    assert.strictEqual(tenantBMemories[0].conceptKey, 'Public Open Source Spec');
  });

  it('should enforce goal ownership boundary checks', async () => {
    const repo = new CognitiveCoreRepository();
    const goalService = new GoalManagementService(repo);

    await goalService.createAndDecomposeGoal({
      userId: 'user-auth-1',
      title: 'Confidential Enterprise Goal',
      description: 'Zero-trust goal tracking',
    });

    const user1Goals = await goalService.listGoals('user-auth-1');
    const user2Goals = await goalService.listGoals('user-auth-2');

    assert.strictEqual(user1Goals.length, 1);
    assert.strictEqual(user2Goals.length, 0);
  });
});
