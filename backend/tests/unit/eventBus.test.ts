import { test, describe } from 'node:test';
import assert from 'node:assert';
import { EventBusService } from '../../src/modules/agent-cloud/eventBusService';
import { GlobalEventType } from '@codeforge/shared';

describe('Global Event Bus & Pub/Sub Stream Unit Tests', () => {
  const createMockRepo = () => {
    const events: any[] = [];
    return {
      events,
      async recordEventStream(data: any) {
        const item = {
          id: `ev_${Date.now()}_${Math.random()}`,
          eventType: data.eventType,
          source: data.source || 'system',
          userId: data.userId || null,
          payload: data.payload,
          timestamp: new Date().toISOString(),
        };
        events.unshift(item);
        return item;
      },
      async listEventStream(userId?: string | null, limit?: number) {
        let list = [...events];
        if (userId) list = list.filter(e => e.userId === userId);
        return list.slice(0, limit || 50);
      },
    };
  };

  test('1. should publish events and trigger registered event subscribers', async () => {
    const mockRepo = createMockRepo();
    const service = new EventBusService(mockRepo as any);

    let subscriberInvoked = false;
    let receivedPayload: any = null;

    service.subscribe(GlobalEventType.ASSESSMENT_COMPLETED, async ev => {
      subscriberInvoked = true;
      receivedPayload = ev.payload;
    });

    const event = await service.publish('user-100', {
      eventType: GlobalEventType.ASSESSMENT_COMPLETED,
      source: 'Assessment Engine Worker',
      payload: { assessmentId: 'asm_999', score: 98, status: 'passed' },
    });

    assert.ok(event.id);
    assert.strictEqual(event.eventType, GlobalEventType.ASSESSMENT_COMPLETED);
    assert.strictEqual(subscriberInvoked, true);
    assert.strictEqual(receivedPayload.score, 98);

    const history = await service.getRecentEvents(null, 10);
    assert.strictEqual(history.length, 1);
  });

  test('2. should handle unsubscribing from event stream cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new EventBusService(mockRepo as any);

    let callCount = 0;
    const unsubscribe = service.subscribe(GlobalEventType.JOB_APPLIED, () => {
      callCount++;
    });

    await service.publish('user-1', { eventType: GlobalEventType.JOB_APPLIED, payload: { job: 'Dev' } });
    assert.strictEqual(callCount, 1);

    unsubscribe();
    await service.publish('user-1', { eventType: GlobalEventType.JOB_APPLIED, payload: { job: 'Dev2' } });
    assert.strictEqual(callCount, 1);
  });

  test('3. should isolate and handle listener exceptions without terminating publisher', async () => {
    const mockRepo = createMockRepo();
    const service = new EventBusService(mockRepo as any);

    service.subscribe(GlobalEventType.USER_ACTION, () => {
      throw new Error('Listener crash simulated');
    });

    const event = await service.publish('user-1', { eventType: GlobalEventType.USER_ACTION, payload: { action: 'click' } });
    assert.ok(event.id);
    assert.strictEqual(event.eventType, GlobalEventType.USER_ACTION);
  });
});
