import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import { EventStreamDto, PublishEventDto, GlobalEventType } from '@codeforge/shared';

type EventListener = (event: EventStreamDto) => Promise<void> | void;

export class EventBusService {
  private listeners: Map<GlobalEventType, Set<EventListener>> = new Map();

  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  subscribe(eventType: GlobalEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  async publish(userId: string | null, data: PublishEventDto): Promise<EventStreamDto> {
    const recorded = await this.agentCloudRepo.recordEventStream({
      userId,
      eventType: data.eventType,
      payload: data.payload,
      source: data.source || 'system',
    });

    // Notify in-memory listeners asynchronously
    const eventListeners = this.listeners.get(data.eventType);
    if (eventListeners && eventListeners.size > 0) {
      for (const listener of eventListeners) {
        try {
          await Promise.resolve(listener(recorded));
        } catch (err) {
          console.error(`[EventBus] Error in listener for event ${data.eventType}:`, err);
        }
      }
    }

    return recorded;
  }

  async getRecentEvents(userId?: string | null, limit = 50): Promise<EventStreamDto[]> {
    return this.agentCloudRepo.listEventStream(userId, limit);
  }
}
