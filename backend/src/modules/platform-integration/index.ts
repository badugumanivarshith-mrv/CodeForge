import { platformIntegrationRepository } from '../../repositories/PlatformIntegrationRepository';
import { PlatformIntegrationService } from './platformIntegrationService';
import { UnifiedContextService } from './unifiedContextService';
import { OrchestrationService } from './orchestrationService';
import { CrossModuleWorkflowService } from './crossModuleWorkflowService';

export const platformIntegrationService = new PlatformIntegrationService(platformIntegrationRepository);
export const unifiedContextService = new UnifiedContextService(platformIntegrationRepository);
export const orchestrationService = new OrchestrationService(platformIntegrationRepository);
export const crossModuleWorkflowService = new CrossModuleWorkflowService(platformIntegrationRepository);

export * from './platformIntegrationService';
export * from './unifiedContextService';
export * from './orchestrationService';
export * from './crossModuleWorkflowService';
