import { ICybersecurityRepository } from './interfaces/ICybersecurityRepository';
import {
  SecurityEventDto,
  CreateSecurityEventDto,
  ThreatDto,
  CreateThreatDto,
  VulnerabilityDto,
  CreateVulnerabilityDto,
  IncidentDto,
  CreateIncidentDto,
  SecurityOverviewDto,
  ThreatSeverity,
  ThreatStatus,
  VulnerabilityStatus,
  IncidentStatus,
} from '@codeforge/shared';

export class CybersecurityRepository implements ICybersecurityRepository {
  private eventsList: SecurityEventDto[] = [];
  private threatsMap = new Map<string, ThreatDto>();
  private vulnerabilitiesMap = new Map<string, VulnerabilityDto>();
  private incidentsMap = new Map<string, IncidentDto>();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const event1: SecurityEventDto = {
      id: 'event-seed-1',
      eventType: 'SQL Injection Attempt',
      sourceIp: '198.51.100.42',
      severity: ThreatSeverity.HIGH,
      payload: { targetEndpoint: '/api/v1/auth/login', queryMatched: 'UNION SELECT' },
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    };

    const event2: SecurityEventDto = {
      id: 'event-seed-2',
      eventType: 'Brute Force Access Blocked',
      sourceIp: '203.0.113.110',
      severity: ThreatSeverity.MEDIUM,
      payload: { failedAttemptsCount: 15 },
      timestamp: new Date().toISOString(),
    };

    this.eventsList.push(event1, event2);

    const threat1: ThreatDto = {
      id: 'threat-seed-1',
      title: 'Credential Stuffing Botnet',
      description: 'Distributed attacks targeting endpoint portals using automated libraries.',
      severity: ThreatSeverity.HIGH,
      status: ThreatStatus.ACTIVE,
      affectedSystems: ['auth-service', 'user-gateway'],
      mitigationSteps: ['Enable Cloudflare rate-limits', 'Invalidate suspicious sessions'],
      detectedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    };

    this.threatsMap.set(threat1.id, threat1);

    const vuln1: VulnerabilityDto = {
      id: 'vuln-seed-1',
      cveId: 'CVE-2026-38290',
      packageName: 'express-jwt',
      severity: ThreatSeverity.CRITICAL,
      status: VulnerabilityStatus.OPEN,
      cvssScore: 9.8,
      description: 'Remote Code Execution vulnerability due to insecure verification options configuration.',
      remediationPlan: 'Upgrade package express-jwt to version >= 8.4.2 immediately.',
      detectedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    };

    this.vulnerabilitiesMap.set(vuln1.id, vuln1);

    const incident1: IncidentDto = {
      id: 'incident-seed-1',
      title: 'Suspicious Database Outbound Spikes',
      description: 'Unusual query telemetry exceeding threshold capacity patterns.',
      severity: ThreatSeverity.MEDIUM,
      status: IncidentStatus.CONTAINED,
      assignedTeam: 'SecOps-Alpha',
      containmentAction: 'Temporarily blocked outgoing cross-region replica calls.',
      createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    };

    this.incidentsMap.set(incident1.id, incident1);
  }

  public async createSecurityEvent(dto: CreateSecurityEventDto): Promise<SecurityEventDto> {
    const event: SecurityEventDto = {
      id: `event-${Date.now()}`,
      eventType: dto.eventType,
      sourceIp: dto.sourceIp,
      severity: dto.severity,
      payload: dto.payload,
      timestamp: new Date().toISOString(),
    };
    this.eventsList.push(event);
    return event;
  }

  public async listSecurityEvents(): Promise<SecurityEventDto[]> {
    return this.eventsList;
  }

  public async createThreat(dto: CreateThreatDto): Promise<ThreatDto> {
    const threat: ThreatDto = {
      id: `threat-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      status: dto.status,
      affectedSystems: dto.affectedSystems,
      mitigationSteps: dto.mitigationSteps,
      detectedAt: new Date().toISOString(),
    };
    this.threatsMap.set(threat.id, threat);
    return threat;
  }

  public async updateThreatStatus(id: string, status: ThreatStatus): Promise<ThreatDto> {
    const threat = this.threatsMap.get(id);
    if (!threat) throw new Error(`Threat with ID ${id} not found.`);
    threat.status = status;
    this.threatsMap.set(id, threat);
    return threat;
  }

  public async getThreat(id: string): Promise<ThreatDto | null> {
    return this.threatsMap.get(id) || null;
  }

  public async listThreats(): Promise<ThreatDto[]> {
    return Array.from(this.threatsMap.values());
  }

  public async createVulnerability(dto: CreateVulnerabilityDto): Promise<VulnerabilityDto> {
    const vuln: VulnerabilityDto = {
      id: `vuln-${Date.now()}`,
      cveId: dto.cveId,
      packageName: dto.packageName,
      severity: dto.severity,
      status: dto.status,
      cvssScore: dto.cvssScore,
      description: dto.description,
      remediationPlan: dto.remediationPlan,
      detectedAt: new Date().toISOString(),
    };
    this.vulnerabilitiesMap.set(vuln.id, vuln);
    return vuln;
  }

  public async updateVulnerabilityStatus(id: string, status: VulnerabilityStatus): Promise<VulnerabilityDto> {
    const vuln = this.vulnerabilitiesMap.get(id);
    if (!vuln) throw new Error(`Vulnerability with ID ${id} not found.`);
    vuln.status = status;
    this.vulnerabilitiesMap.set(id, vuln);
    return vuln;
  }

  public async getVulnerability(id: string): Promise<VulnerabilityDto | null> {
    return this.vulnerabilitiesMap.get(id) || null;
  }

  public async listVulnerabilities(): Promise<VulnerabilityDto[]> {
    return Array.from(this.vulnerabilitiesMap.values());
  }

  public async createIncident(dto: CreateIncidentDto, status: IncidentStatus): Promise<IncidentDto> {
    const incident: IncidentDto = {
      id: `incident-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      status,
      assignedTeam: dto.assignedTeam,
      createdAt: new Date().toISOString(),
    };
    this.incidentsMap.set(incident.id, incident);
    return incident;
  }

  public async updateIncidentStatus(id: string, status: IncidentStatus, action?: string): Promise<IncidentDto> {
    const incident = this.incidentsMap.get(id);
    if (!incident) throw new Error(`Incident with ID ${id} not found.`);
    incident.status = status;
    if (action) incident.containmentAction = action;
    this.incidentsMap.set(id, incident);
    return incident;
  }

  public async getIncident(id: string): Promise<IncidentDto | null> {
    return this.incidentsMap.get(id) || null;
  }

  public async listIncidents(): Promise<IncidentDto[]> {
    return Array.from(this.incidentsMap.values());
  }

  public async getOverview(): Promise<SecurityOverviewDto> {
    const recentEvents = this.eventsList.slice(-10);
    const activeThreats = Array.from(this.threatsMap.values()).filter(t => t.status === ThreatStatus.ACTIVE);
    const openVulnerabilities = Array.from(this.vulnerabilitiesMap.values()).filter(v => v.status === VulnerabilityStatus.OPEN);
    const recentIncidents = Array.from(this.incidentsMap.values());

    let score = 98.4; // Initial perfect score
    score -= activeThreats.length * 15;
    score -= openVulnerabilities.length * 8;
    score -= recentIncidents.filter(i => i.status === IncidentStatus.OPEN).length * 20;
    const finalScore = Math.max(10.0, Math.min(100.0, parseFloat(score.toFixed(1))));

    return {
      metrics: {
        aggregateRiskScore: finalScore,
        totalThreatsDetected: this.threatsMap.size,
        mitigatedThreatsCount: Array.from(this.threatsMap.values()).filter(t => t.status === ThreatStatus.MITIGATED).length,
        openVulnerabilitiesCount: openVulnerabilities.length,
        activeIncidentsCount: recentIncidents.filter(i => i.status !== IncidentStatus.CLOSED).length,
        calculatedAt: new Date().toISOString(),
      },
      recentEvents,
      activeThreats,
      openVulnerabilities,
      recentIncidents,
    };
  }
}

export const cybersecurityRepository = new CybersecurityRepository();
