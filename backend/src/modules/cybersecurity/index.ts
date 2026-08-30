import { cybersecurityRepository } from '../../repositories/CybersecurityRepository';
import { SecurityMonitoringService } from './securityMonitoringService';
import { ThreatDetectionService } from './threatDetectionService';
import { VulnerabilityManagementService } from './vulnerabilityManagementService';
import { IncidentResponseService } from './incidentResponseService';

export const securityMonitoringService = new SecurityMonitoringService(cybersecurityRepository);
export const threatDetectionService = new ThreatDetectionService(cybersecurityRepository);
export const vulnerabilityManagementService = new VulnerabilityManagementService(cybersecurityRepository);
export const incidentResponseService = new IncidentResponseService(cybersecurityRepository);

export * from './securityMonitoringService';
export * from './threatDetectionService';
export * from './vulnerabilityManagementService';
export * from './incidentResponseService';
