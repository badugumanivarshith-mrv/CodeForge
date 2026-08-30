import { agentEcosystemRepository } from '../../repositories/AgentEcosystemRepository';
import { AgentRegistryService } from './agentRegistryService';
import { AgentCoordinationService } from './agentCoordinationService';
import { AgentMemoryService } from './agentMemoryService';
import { TaskDelegationService } from './taskDelegationService';

export const agentRegistryService = new AgentRegistryService(agentEcosystemRepository);
export const agentCoordinationService = new AgentCoordinationService(agentEcosystemRepository);
export const agentMemoryService = new AgentMemoryService(agentEcosystemRepository);
export const taskDelegationService = new TaskDelegationService(agentEcosystemRepository);

export * from './agentRegistryService';
export * from './agentCoordinationService';
export * from './agentMemoryService';
export * from './taskDelegationService';
