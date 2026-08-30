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
  ThreatStatus,
  VulnerabilityStatus,
  IncidentStatus,
} from '@codeforge/shared';

export interface ICybersecurityRepository {
  createSecurityEvent(dto: CreateSecurityEventDto): Promise<SecurityEventDto>;
  listSecurityEvents(): Promise<SecurityEventDto[]>;

  createThreat(dto: CreateThreatDto): Promise<ThreatDto>;
  updateThreatStatus(id: string, status: ThreatStatus): Promise<ThreatDto>;
  getThreat(id: string): Promise<ThreatDto | null>;
  listThreats(): Promise<ThreatDto[]>;

  createVulnerability(dto: CreateVulnerabilityDto): Promise<VulnerabilityDto>;
  updateVulnerabilityStatus(id: string, status: VulnerabilityStatus): Promise<VulnerabilityDto>;
  getVulnerability(id: string): Promise<VulnerabilityDto | null>;
  listVulnerabilities(): Promise<VulnerabilityDto[]>;

  createIncident(dto: CreateIncidentDto, status: IncidentStatus): Promise<IncidentDto>;
  updateIncidentStatus(id: string, status: IncidentStatus, action?: string): Promise<IncidentDto>;
  getIncident(id: string): Promise<IncidentDto | null>;
  listIncidents(): Promise<IncidentDto[]>;

  getOverview(): Promise<SecurityOverviewDto>;
}
