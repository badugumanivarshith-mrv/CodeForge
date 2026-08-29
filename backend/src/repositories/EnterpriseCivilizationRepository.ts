import { randomUUID } from 'crypto';
import { db } from '../database/connection';
import * as schema from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import {
  OrganizationCivilizationDto,
  CivilizationDepartmentDto,
  CivilizationTeamDto,
  DigitalEmployeeDto,
  CompanyBlueprintDto,
  EnterpriseFederationDto,
  ProductPortfolioDto,
  EconomicSimulationDto,
  InvestmentRecordDto,
  ExecutionNetworkTaskDto,
  EnterpriseCommandCenterOverviewDto,
  DigitalEmployeeRole,
  EmployeeEmploymentStatus,
  CompanyStage,
  ProductLifecycleStage,
  EnterpriseFederationType,
  InvestmentReadinessTier,
  ExecutionNetworkTaskPriority,
  ExecutionNetworkTaskStatus,
  EconomicSimulationScenario,
  OrganizationCivilizationType,
} from '@codeforge/shared';
import { IEnterpriseCivilizationRepository } from './interfaces/IEnterpriseCivilizationRepository';

export class EnterpriseCivilizationRepository implements IEnterpriseCivilizationRepository {
  // In-memory fallback stores
  private memOrganizations = new Map<string, OrganizationCivilizationDto>();
  private memDepartments = new Map<string, CivilizationDepartmentDto>();
  private memTeams = new Map<string, CivilizationTeamDto>();
  private memDigitalEmployees = new Map<string, DigitalEmployeeDto>();
  private memCompanyBlueprints = new Map<string, CompanyBlueprintDto>();
  private memFederations = new Map<string, EnterpriseFederationDto>();
  private memProductPortfolios = new Map<string, ProductPortfolioDto>();
  private memEconomicSimulations = new Map<string, EconomicSimulationDto>();
  private memInvestmentRecords = new Map<string, InvestmentRecordDto>();
  private memExecutionTasks = new Map<string, ExecutionNetworkTaskDto>();

  constructor() {
    this.seedDefaultEnterpriseCivilization();
  }

  private seedDefaultEnterpriseCivilization() {
    const orgId = 'org-civ-seed-1';
    const deptId = 'dept-civ-seed-1';
    const teamId = 'team-civ-seed-1';
    const empId = 'emp-civ-seed-1';
    const blueprintId = 'bp-civ-seed-1';

    const defaultOrg: OrganizationCivilizationDto = {
      id: orgId,
      creatorUserId: '00000000-0000-0000-0000-000000000001',
      name: 'Synthetix Neural Dynamics Inc',
      slug: 'synthetix-neural-dynamics',
      organizationType: OrganizationCivilizationType.ENTERPRISE,
      missionStatement: 'Scale planet-level autonomous software engineering and zero-knowledge verification grids.',
      headquartersRegion: 'Autonomous-Mesh-US-East',
      autonomousOperatingStatus: 'ACTIVE_OPTIMAL',
      totalDepartmentsCount: 4,
      totalWorkforceHeadcount: 48,
      organizationalEfficiencyScore: 98.4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memOrganizations.set(orgId, defaultOrg);

    const defaultDept: CivilizationDepartmentDto = {
      id: deptId,
      organizationId: orgId,
      name: 'Autonomous Core Engineering',
      charter: 'Design dialectic compiler invariants and high-throughput execution engines.',
      allocatedBudgetTokens: 5000000,
      efficiencyRating: 98.5,
      teamsCount: 2,
      createdAt: new Date().toISOString(),
    };
    this.memDepartments.set(deptId, defaultDept);

    const defaultTeam: CivilizationTeamDto = {
      id: teamId,
      departmentId: deptId,
      organizationId: orgId,
      name: 'Lattice Cryptography & Zero-Knowledge Enclaves',
      focusArea: 'Post-quantum key rotation and state isolation',
      memberCount: 6,
      activeProjectsCount: 3,
      createdAt: new Date().toISOString(),
    };
    this.memTeams.set(teamId, defaultTeam);

    const defaultEmp: DigitalEmployeeDto = {
      id: empId,
      organizationId: orgId,
      departmentId: deptId,
      teamId: teamId,
      name: 'Nexus-7 Lead Architect',
      role: DigitalEmployeeRole.AI_ENGINEER,
      status: EmployeeEmploymentStatus.ACTIVE,
      seniorityTier: 'Distinguished Autonomous Architect',
      capabilities: ['AST Dialectic Verification', 'Zero-Knowledge Proof Generation', 'Lattice Cryptography'],
      primarySpecialization: 'Formal Systems Synthesis',
      completedTasksCount: 142,
      velocityScore: 99.2,
      accuracyScore: 99.8,
      collaborationIndex: 98.0,
      createdAt: new Date().toISOString(),
    };
    this.memDigitalEmployees.set(empId, defaultEmp);

    const defaultBlueprint: CompanyBlueprintDto = {
      id: blueprintId,
      creatorUserId: '00000000-0000-0000-0000-000000000001',
      companyName: 'CodeForge Quantum Swarm Labs',
      tagline: 'Autonomous AI Engineering Mesh for Planetary Scale Ventures',
      stage: CompanyStage.SERIES_A,
      targetMarket: 'Global Cloud Hyperscalers & Enterprise AI Hubs',
      valueProposition: '100x compiler synthesis speedup with zero-knowledge correctness guarantees.',
      businessModelCanvas: {
        keyPartners: ['Cloud Hyperscalers', 'Hardware Accelerators', 'Formal Method Labs'],
        keyActivities: ['Autonomous compiler generation', 'Dialectic invariant verification'],
        valuePropositions: ['Instantaneous verifiable software deployment'],
        customerRelationships: ['Continuous Autonomous SLA Mesh'],
        customerSegments: ['Fortune 500 Tech', 'Decentralized Compute Alliances'],
        costStructure: ['Compute Cluster Tokens', 'Storage Enclaves'],
        revenueStreams: ['Usage tokens', 'Enterprise SLA Subscriptions'],
      },
      projectedAnnualRunRateUsd: 14500000,
      breakEvenTimelineMonths: 8,
      readinessTier: InvestmentReadinessTier.TIER_1_EXEMPLARY,
      createdAt: new Date().toISOString(),
    };
    this.memCompanyBlueprints.set(blueprintId, defaultBlueprint);

    const defaultProduct: ProductPortfolioDto = {
      id: 'prod-civ-seed-1',
      organizationId: orgId,
      productName: 'CodeForge Autonomous Synthesis Fabric',
      lifecycleStage: ProductLifecycleStage.GENERAL_AVAILABILITY,
      targetPersona: 'Enterprise Chief Technology Officers & Lead Architects',
      coreDifferentiator: 'Neuro-symbolic proof-carrying code generation with zero latency overhead.',
      monthlyActiveUsersEstimate: 350000,
      productHealthScore: 99.1,
      featuresRoadmap: [
        { title: 'Lattice State Isolation Enclaves', releaseTarget: 'Q3 2026', status: 'RELEASED' },
        { title: 'Self-Compiling AST Dialectic Router', releaseTarget: 'Q4 2026', status: 'IN_DEVELOPMENT' },
      ],
      createdAt: new Date().toISOString(),
    };
    this.memProductPortfolios.set(defaultProduct.id, defaultProduct);
  }

  // Organizations
  async createOrganization(data: Partial<OrganizationCivilizationDto>): Promise<OrganizationCivilizationDto> {
    const org: OrganizationCivilizationDto = {
      id: data.id || randomUUID(),
      creatorUserId: data.creatorUserId || '00000000-0000-0000-0000-000000000001',
      name: data.name || 'New Autonomous Organization',
      slug: data.slug || `org-${Date.now()}`,
      organizationType: data.organizationType || OrganizationCivilizationType.ENTERPRISE,
      missionStatement: data.missionStatement || 'Autonomous enterprise scale-up',
      headquartersRegion: data.headquartersRegion || 'Global-Autonomous-Mesh',
      autonomousOperatingStatus: data.autonomousOperatingStatus || 'ACTIVE_OPTIMAL',
      totalDepartmentsCount: data.totalDepartmentsCount || 0,
      totalWorkforceHeadcount: data.totalWorkforceHeadcount || 0,
      organizationalEfficiencyScore: data.organizationalEfficiencyScore || 95.0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationOrganizations).values({
          id: org.id,
          creatorUserId: org.creatorUserId,
          name: org.name,
          slug: org.slug,
          organizationType: org.organizationType,
          missionStatement: org.missionStatement,
          headquartersRegion: org.headquartersRegion,
          autonomousOperatingStatus: org.autonomousOperatingStatus,
          totalDepartmentsCount: org.totalDepartmentsCount,
          totalWorkforceHeadcount: org.totalWorkforceHeadcount,
          organizationalEfficiencyScore: org.organizationalEfficiencyScore,
        });
      }
    } catch {
      // Memory fallback
    }

    this.memOrganizations.set(org.id, org);
    return org;
  }

  async getOrganizationById(id: string): Promise<OrganizationCivilizationDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationOrganizations).where(eq(schema.civilizationOrganizations.id, id)).limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            creatorUserId: r.creatorUserId,
            name: r.name,
            slug: r.slug,
            organizationType: r.organizationType as OrganizationCivilizationType,
            missionStatement: r.missionStatement,
            headquartersRegion: r.headquartersRegion,
            autonomousOperatingStatus: r.autonomousOperatingStatus,
            totalDepartmentsCount: r.totalDepartmentsCount,
            totalWorkforceHeadcount: r.totalWorkforceHeadcount,
            organizationalEfficiencyScore: r.organizationalEfficiencyScore,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      }
    } catch {}
    return this.memOrganizations.get(id) || null;
  }

  async getOrganizationBySlug(slug: string): Promise<OrganizationCivilizationDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationOrganizations).where(eq(schema.civilizationOrganizations.slug, slug)).limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            creatorUserId: r.creatorUserId,
            name: r.name,
            slug: r.slug,
            organizationType: r.organizationType as OrganizationCivilizationType,
            missionStatement: r.missionStatement,
            headquartersRegion: r.headquartersRegion,
            autonomousOperatingStatus: r.autonomousOperatingStatus,
            totalDepartmentsCount: r.totalDepartmentsCount,
            totalWorkforceHeadcount: r.totalWorkforceHeadcount,
            organizationalEfficiencyScore: r.organizationalEfficiencyScore,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        }
      }
    } catch {}
    for (const org of this.memOrganizations.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  }

  async listOrganizations(creatorUserId?: string): Promise<OrganizationCivilizationDto[]> {
    try {
      if (db) {
        const query = creatorUserId
          ? db.select().from(schema.civilizationOrganizations).where(eq(schema.civilizationOrganizations.creatorUserId, creatorUserId))
          : db.select().from(schema.civilizationOrganizations);
        const rows = await query.orderBy(desc(schema.civilizationOrganizations.createdAt));
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            creatorUserId: r.creatorUserId,
            name: r.name,
            slug: r.slug,
            organizationType: r.organizationType as OrganizationCivilizationType,
            missionStatement: r.missionStatement,
            headquartersRegion: r.headquartersRegion,
            autonomousOperatingStatus: r.autonomousOperatingStatus,
            totalDepartmentsCount: r.totalDepartmentsCount,
            totalWorkforceHeadcount: r.totalWorkforceHeadcount,
            organizationalEfficiencyScore: r.organizationalEfficiencyScore,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        }
      }
    } catch {}
    const list = Array.from(this.memOrganizations.values());
    return creatorUserId ? list.filter((o) => o.creatorUserId === creatorUserId) : list;
  }

  async updateOrganization(id: string, updates: Partial<OrganizationCivilizationDto>): Promise<OrganizationCivilizationDto | null> {
    const existing = await this.getOrganizationById(id);
    if (!existing) return null;
    const updated: OrganizationCivilizationDto = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    try {
      if (db) {
        await db.update(schema.civilizationOrganizations).set(updates as any).where(eq(schema.civilizationOrganizations.id, id));
      }
    } catch {}
    this.memOrganizations.set(id, updated);
    return updated;
  }

  // Departments & Teams
  async createDepartment(data: Partial<CivilizationDepartmentDto>): Promise<CivilizationDepartmentDto> {
    const dept: CivilizationDepartmentDto = {
      id: data.id || randomUUID(),
      organizationId: data.organizationId || 'org-civ-seed-1',
      name: data.name || 'New Department',
      charter: data.charter || 'Autonomous execution charter',
      leadEmployeeId: data.leadEmployeeId,
      allocatedBudgetTokens: data.allocatedBudgetTokens || 1000000,
      efficiencyRating: data.efficiencyRating || 95.0,
      teamsCount: data.teamsCount || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationDepartments).values({
          id: dept.id,
          organizationId: dept.organizationId,
          name: dept.name,
          charter: dept.charter,
          leadEmployeeId: dept.leadEmployeeId,
          allocatedBudgetTokens: dept.allocatedBudgetTokens,
          efficiencyRating: dept.efficiencyRating,
          teamsCount: dept.teamsCount,
        });
      }
    } catch {}
    this.memDepartments.set(dept.id, dept);
    return dept;
  }

  async listDepartments(organizationId: string): Promise<CivilizationDepartmentDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationDepartments).where(eq(schema.civilizationDepartments.organizationId, organizationId));
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            organizationId: r.organizationId,
            name: r.name,
            charter: r.charter,
            leadEmployeeId: r.leadEmployeeId || undefined,
            allocatedBudgetTokens: r.allocatedBudgetTokens,
            efficiencyRating: r.efficiencyRating,
            teamsCount: r.teamsCount,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      }
    } catch {}
    return Array.from(this.memDepartments.values()).filter((d) => d.organizationId === organizationId);
  }

  async createTeam(data: Partial<CivilizationTeamDto>): Promise<CivilizationTeamDto> {
    const team: CivilizationTeamDto = {
      id: data.id || randomUUID(),
      departmentId: data.departmentId || 'dept-civ-seed-1',
      organizationId: data.organizationId || 'org-civ-seed-1',
      name: data.name || 'New Team',
      focusArea: data.focusArea || 'Core engineering',
      leadEmployeeId: data.leadEmployeeId,
      memberCount: data.memberCount || 0,
      activeProjectsCount: data.activeProjectsCount || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationTeams).values({
          id: team.id,
          departmentId: team.departmentId,
          organizationId: team.organizationId,
          name: team.name,
          focusArea: team.focusArea,
          leadEmployeeId: team.leadEmployeeId,
          memberCount: team.memberCount,
          activeProjectsCount: team.activeProjectsCount,
        });
      }
    } catch {}
    this.memTeams.set(team.id, team);
    return team;
  }

  async listTeams(departmentId: string): Promise<CivilizationTeamDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationTeams).where(eq(schema.civilizationTeams.departmentId, departmentId));
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            departmentId: r.departmentId,
            organizationId: r.organizationId,
            name: r.name,
            focusArea: r.focusArea,
            leadEmployeeId: r.leadEmployeeId || undefined,
            memberCount: r.memberCount,
            activeProjectsCount: r.activeProjectsCount,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      }
    } catch {}
    return Array.from(this.memTeams.values()).filter((t) => t.departmentId === departmentId);
  }

  // Digital Employees
  async createDigitalEmployee(data: Partial<DigitalEmployeeDto>): Promise<DigitalEmployeeDto> {
    const emp: DigitalEmployeeDto = {
      id: data.id || randomUUID(),
      organizationId: data.organizationId || 'org-civ-seed-1',
      departmentId: data.departmentId,
      teamId: data.teamId,
      name: data.name || 'AI Specialist Agent',
      role: data.role || DigitalEmployeeRole.AI_ENGINEER,
      status: data.status || EmployeeEmploymentStatus.ACTIVE,
      seniorityTier: data.seniorityTier || 'Senior Autonomous Agent',
      capabilities: data.capabilities || ['Autonomous Task Execution', 'Continuous Reasoning'],
      primarySpecialization: data.primarySpecialization || 'Full-Stack Systems Architecture',
      activeAssignedTaskId: data.activeAssignedTaskId,
      completedTasksCount: data.completedTasksCount || 0,
      velocityScore: data.velocityScore || 98.0,
      accuracyScore: data.accuracyScore || 99.0,
      collaborationIndex: data.collaborationIndex || 95.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationDigitalEmployees).values({
          id: emp.id,
          organizationId: emp.organizationId,
          departmentId: emp.departmentId,
          teamId: emp.teamId,
          name: emp.name,
          role: emp.role,
          status: emp.status,
          seniorityTier: emp.seniorityTier,
          capabilities: emp.capabilities,
          primarySpecialization: emp.primarySpecialization,
          completedTasksCount: emp.completedTasksCount,
          velocityScore: emp.velocityScore,
          accuracyScore: emp.accuracyScore,
          collaborationIndex: emp.collaborationIndex,
        });
      }
    } catch {}
    this.memDigitalEmployees.set(emp.id, emp);
    return emp;
  }

  async getDigitalEmployeeById(id: string): Promise<DigitalEmployeeDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationDigitalEmployees).where(eq(schema.civilizationDigitalEmployees.id, id)).limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            organizationId: r.organizationId,
            departmentId: r.departmentId || undefined,
            teamId: r.teamId || undefined,
            name: r.name,
            role: r.role as DigitalEmployeeRole,
            status: r.status as EmployeeEmploymentStatus,
            seniorityTier: r.seniorityTier,
            capabilities: r.capabilities,
            primarySpecialization: r.primarySpecialization,
            activeAssignedTaskId: r.activeAssignedTaskId || undefined,
            completedTasksCount: r.completedTasksCount,
            velocityScore: r.velocityScore,
            accuracyScore: r.accuracyScore,
            collaborationIndex: r.collaborationIndex,
            createdAt: r.createdAt.toISOString(),
          };
        }
      }
    } catch {}
    return this.memDigitalEmployees.get(id) || null;
  }

  async listDigitalEmployees(organizationId?: string, role?: DigitalEmployeeRole): Promise<DigitalEmployeeDto[]> {
    try {
      if (db) {
        let query = db.select().from(schema.civilizationDigitalEmployees);
        const rows = await query.orderBy(desc(schema.civilizationDigitalEmployees.createdAt));
        if (rows.length > 0) {
          let list = rows.map((r) => ({
            id: r.id,
            organizationId: r.organizationId,
            departmentId: r.departmentId || undefined,
            teamId: r.teamId || undefined,
            name: r.name,
            role: r.role as DigitalEmployeeRole,
            status: r.status as EmployeeEmploymentStatus,
            seniorityTier: r.seniorityTier,
            capabilities: r.capabilities,
            primarySpecialization: r.primarySpecialization,
            activeAssignedTaskId: r.activeAssignedTaskId || undefined,
            completedTasksCount: r.completedTasksCount,
            velocityScore: r.velocityScore,
            accuracyScore: r.accuracyScore,
            collaborationIndex: r.collaborationIndex,
            createdAt: r.createdAt.toISOString(),
          }));
          if (organizationId) list = list.filter((e) => e.organizationId === organizationId);
          if (role) list = list.filter((e) => e.role === role);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memDigitalEmployees.values());
    if (organizationId) list = list.filter((e) => e.organizationId === organizationId);
    if (role) list = list.filter((e) => e.role === role);
    return list;
  }

  async updateDigitalEmployee(id: string, updates: Partial<DigitalEmployeeDto>): Promise<DigitalEmployeeDto | null> {
    const existing = await this.getDigitalEmployeeById(id);
    if (!existing) return null;
    const updated: DigitalEmployeeDto = { ...existing, ...updates };
    try {
      if (db) {
        await db.update(schema.civilizationDigitalEmployees).set(updates as any).where(eq(schema.civilizationDigitalEmployees.id, id));
      }
    } catch {}
    this.memDigitalEmployees.set(id, updated);
    return updated;
  }

  // Company Blueprints
  async createCompanyBlueprint(data: Partial<CompanyBlueprintDto>): Promise<CompanyBlueprintDto> {
    const bp: CompanyBlueprintDto = {
      id: data.id || randomUUID(),
      creatorUserId: data.creatorUserId || '00000000-0000-0000-0000-000000000001',
      companyName: data.companyName || 'New Autonomous Startup',
      tagline: data.tagline || 'Autonomous Venture',
      stage: data.stage || CompanyStage.IDEATION,
      targetMarket: data.targetMarket || 'Global Enterprise',
      valueProposition: data.valueProposition || 'High-throughput AI Automation',
      businessModelCanvas: data.businessModelCanvas || {
        keyPartners: ['Cloud Providers'],
        keyActivities: ['Autonomous Development'],
        valuePropositions: ['10x efficiency'],
        customerRelationships: ['Automated Support'],
        customerSegments: ['Tech Startups'],
        costStructure: ['Cloud GPU Tokens'],
        revenueStreams: ['SaaS Subscriptions'],
      },
      projectedAnnualRunRateUsd: data.projectedAnnualRunRateUsd || 1000000,
      breakEvenTimelineMonths: data.breakEvenTimelineMonths || 12,
      readinessTier: data.readinessTier || InvestmentReadinessTier.TIER_2_INVESTABLE,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationCompanyBlueprints).values({
          id: bp.id,
          creatorUserId: bp.creatorUserId,
          companyName: bp.companyName,
          tagline: bp.tagline,
          stage: bp.stage,
          targetMarket: bp.targetMarket,
          valueProposition: bp.valueProposition,
          businessModelCanvas: bp.businessModelCanvas,
          projectedAnnualRunRateUsd: bp.projectedAnnualRunRateUsd,
          breakEvenTimelineMonths: bp.breakEvenTimelineMonths,
          readinessTier: bp.readinessTier,
        });
      }
    } catch {}
    this.memCompanyBlueprints.set(bp.id, bp);
    return bp;
  }

  async getCompanyBlueprintById(id: string): Promise<CompanyBlueprintDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationCompanyBlueprints).where(eq(schema.civilizationCompanyBlueprints.id, id)).limit(1);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            creatorUserId: r.creatorUserId,
            companyName: r.companyName,
            tagline: r.tagline,
            stage: r.stage as CompanyStage,
            targetMarket: r.targetMarket,
            valueProposition: r.valueProposition,
            businessModelCanvas: r.businessModelCanvas,
            projectedAnnualRunRateUsd: r.projectedAnnualRunRateUsd,
            breakEvenTimelineMonths: r.breakEvenTimelineMonths,
            readinessTier: r.readinessTier as InvestmentReadinessTier,
            createdAt: r.createdAt.toISOString(),
          };
        }
      }
    } catch {}
    return this.memCompanyBlueprints.get(id) || null;
  }

  async listCompanyBlueprints(creatorUserId?: string): Promise<CompanyBlueprintDto[]> {
    try {
      if (db) {
        const query = creatorUserId
          ? db.select().from(schema.civilizationCompanyBlueprints).where(eq(schema.civilizationCompanyBlueprints.creatorUserId, creatorUserId))
          : db.select().from(schema.civilizationCompanyBlueprints);
        const rows = await query.orderBy(desc(schema.civilizationCompanyBlueprints.createdAt));
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            creatorUserId: r.creatorUserId,
            companyName: r.companyName,
            tagline: r.tagline,
            stage: r.stage as CompanyStage,
            targetMarket: r.targetMarket,
            valueProposition: r.valueProposition,
            businessModelCanvas: r.businessModelCanvas,
            projectedAnnualRunRateUsd: r.projectedAnnualRunRateUsd,
            breakEvenTimelineMonths: r.breakEvenTimelineMonths,
            readinessTier: r.readinessTier as InvestmentReadinessTier,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      }
    } catch {}
    const list = Array.from(this.memCompanyBlueprints.values());
    return creatorUserId ? list.filter((b) => b.creatorUserId === creatorUserId) : list;
  }

  // Enterprise Federations
  async createFederation(data: Partial<EnterpriseFederationDto>): Promise<EnterpriseFederationDto> {
    const fed: EnterpriseFederationDto = {
      id: data.id || randomUUID(),
      initiatorOrgId: data.initiatorOrgId || 'org-civ-seed-1',
      partnerOrgId: data.partnerOrgId || 'org-partner-1',
      federationType: data.federationType || EnterpriseFederationType.STRATEGIC_ALLIANCE,
      treatyTitle: data.treatyTitle || 'Autonomous Computing Federation Agreement',
      sharedResourcesDescription: data.sharedResourcesDescription || 'Joint GPU compute mesh and dialectic verification fabric',
      governanceTerms: data.governanceTerms || 'Equal parity consensus voting with automated SLA penalty slashing',
      activeStatus: data.activeStatus !== undefined ? data.activeStatus : true,
      jointProjectsCount: data.jointProjectsCount || 1,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationEnterpriseFederations).values({
          id: fed.id,
          initiatorOrgId: fed.initiatorOrgId,
          partnerOrgId: fed.partnerOrgId,
          federationType: fed.federationType,
          treatyTitle: fed.treatyTitle,
          sharedResourcesDescription: fed.sharedResourcesDescription,
          governanceTerms: fed.governanceTerms,
          activeStatus: fed.activeStatus,
          jointProjectsCount: fed.jointProjectsCount,
        });
      }
    } catch {}
    this.memFederations.set(fed.id, fed);
    return fed;
  }

  async listFederations(organizationId?: string): Promise<EnterpriseFederationDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationEnterpriseFederations).orderBy(desc(schema.civilizationEnterpriseFederations.createdAt));
        if (rows.length > 0) {
          let list = rows.map((r) => ({
            id: r.id,
            initiatorOrgId: r.initiatorOrgId,
            partnerOrgId: r.partnerOrgId,
            federationType: r.federationType as EnterpriseFederationType,
            treatyTitle: r.treatyTitle,
            sharedResourcesDescription: r.sharedResourcesDescription,
            governanceTerms: r.governanceTerms,
            activeStatus: r.activeStatus,
            jointProjectsCount: r.jointProjectsCount,
            createdAt: r.createdAt.toISOString(),
          }));
          if (organizationId) {
            list = list.filter((f) => f.initiatorOrgId === organizationId || f.partnerOrgId === organizationId);
          }
          return list;
        }
      }
    } catch {}
    const list = Array.from(this.memFederations.values());
    if (organizationId) {
      return list.filter((f) => f.initiatorOrgId === organizationId || f.partnerOrgId === organizationId);
    }
    return list;
  }

  // Product Portfolios
  async createProductPortfolio(data: Partial<ProductPortfolioDto>): Promise<ProductPortfolioDto> {
    const prod: ProductPortfolioDto = {
      id: data.id || randomUUID(),
      organizationId: data.organizationId || 'org-civ-seed-1',
      productName: data.productName || 'New Autonomous Product',
      lifecycleStage: data.lifecycleStage || ProductLifecycleStage.DISCOVERY,
      targetPersona: data.targetPersona || 'Enterprise Teams',
      coreDifferentiator: data.coreDifferentiator || 'AI Autonomous Execution',
      monthlyActiveUsersEstimate: data.monthlyActiveUsersEstimate || 10000,
      productHealthScore: data.productHealthScore || 95.0,
      featuresRoadmap: data.featuresRoadmap || [{ title: 'MVP Discovery', releaseTarget: 'Q3 2026', status: 'IN_PLANNING' }],
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationProductPortfolios).values({
          id: prod.id,
          organizationId: prod.organizationId,
          productName: prod.productName,
          lifecycleStage: prod.lifecycleStage,
          targetPersona: prod.targetPersona,
          coreDifferentiator: prod.coreDifferentiator,
          monthlyActiveUsersEstimate: prod.monthlyActiveUsersEstimate,
          productHealthScore: prod.productHealthScore,
          featuresRoadmap: prod.featuresRoadmap,
        });
      }
    } catch {}
    this.memProductPortfolios.set(prod.id, prod);
    return prod;
  }

  async listProductPortfolios(organizationId?: string): Promise<ProductPortfolioDto[]> {
    try {
      if (db) {
        let query = db.select().from(schema.civilizationProductPortfolios);
        const rows = await query.orderBy(desc(schema.civilizationProductPortfolios.createdAt));
        if (rows.length > 0) {
          let list = rows.map((r) => ({
            id: r.id,
            organizationId: r.organizationId,
            productName: r.productName,
            lifecycleStage: r.lifecycleStage as ProductLifecycleStage,
            targetPersona: r.targetPersona,
            coreDifferentiator: r.coreDifferentiator,
            monthlyActiveUsersEstimate: r.monthlyActiveUsersEstimate,
            productHealthScore: r.productHealthScore,
            featuresRoadmap: r.featuresRoadmap,
            createdAt: r.createdAt.toISOString(),
          }));
          if (organizationId) list = list.filter((p) => p.organizationId === organizationId);
          return list;
        }
      }
    } catch {}
    const list = Array.from(this.memProductPortfolios.values());
    return organizationId ? list.filter((p) => p.organizationId === organizationId) : list;
  }

  async updateProductStage(id: string, stage: ProductLifecycleStage): Promise<ProductPortfolioDto | null> {
    const existing = this.memProductPortfolios.get(id);
    if (!existing) return null;
    const updated: ProductPortfolioDto = { ...existing, lifecycleStage: stage };
    try {
      if (db) {
        await db.update(schema.civilizationProductPortfolios).set({ lifecycleStage: stage }).where(eq(schema.civilizationProductPortfolios.id, id));
      }
    } catch {}
    this.memProductPortfolios.set(id, updated);
    return updated;
  }

  // Economic Simulations
  async createEconomicSimulation(data: Partial<EconomicSimulationDto>): Promise<EconomicSimulationDto> {
    const sim: EconomicSimulationDto = {
      id: data.id || randomUUID(),
      organizationId: data.organizationId,
      scenario: data.scenario || EconomicSimulationScenario.EQUILIBRIUM,
      inflationPressureIndex: data.inflationPressureIndex || 2.4,
      talentMarketTightnessIndex: data.talentMarketTightnessIndex || 7.5,
      liquidityAvailabilityIndex: data.liquidityAvailabilityIndex || 8.0,
      projectedMarketGrowthRate: data.projectedMarketGrowthRate || 19.2,
      simulatedShockImpactSummary: data.simulatedShockImpactSummary || 'Autonomous workforce productivity absorbs 94% of macro supply shocks.',
      stressTestScore: data.stressTestScore || 95.5,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationEconomicSimulations).values({
          id: sim.id,
          organizationId: sim.organizationId,
          scenario: sim.scenario,
          inflationPressureIndex: sim.inflationPressureIndex,
          talentMarketTightnessIndex: sim.talentMarketTightnessIndex,
          liquidityAvailabilityIndex: sim.liquidityAvailabilityIndex,
          projectedMarketGrowthRate: sim.projectedMarketGrowthRate,
          simulatedShockImpactSummary: sim.simulatedShockImpactSummary,
          stressTestScore: sim.stressTestScore,
        });
      }
    } catch {}
    this.memEconomicSimulations.set(sim.id, sim);
    return sim;
  }

  async listEconomicSimulations(organizationId?: string): Promise<EconomicSimulationDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationEconomicSimulations).orderBy(desc(schema.civilizationEconomicSimulations.createdAt));
        if (rows.length > 0) {
          let list = rows.map((r) => ({
            id: r.id,
            organizationId: r.organizationId || undefined,
            scenario: r.scenario as EconomicSimulationScenario,
            inflationPressureIndex: r.inflationPressureIndex,
            talentMarketTightnessIndex: r.talentMarketTightnessIndex,
            liquidityAvailabilityIndex: r.liquidityAvailabilityIndex,
            projectedMarketGrowthRate: r.projectedMarketGrowthRate,
            simulatedShockImpactSummary: r.simulatedShockImpactSummary,
            stressTestScore: r.stressTestScore,
            createdAt: r.createdAt.toISOString(),
          }));
          if (organizationId) list = list.filter((s) => s.organizationId === organizationId);
          return list;
        }
      }
    } catch {}
    const list = Array.from(this.memEconomicSimulations.values());
    return organizationId ? list.filter((s) => s.organizationId === organizationId) : list;
  }

  // Investment Records
  async createInvestmentRecord(data: Partial<InvestmentRecordDto>): Promise<InvestmentRecordDto> {
    const inv: InvestmentRecordDto = {
      id: data.id || randomUUID(),
      companyBlueprintId: data.companyBlueprintId || 'bp-civ-seed-1',
      fundingRound: data.fundingRound || 'Series A',
      targetAmountUsd: data.targetAmountUsd || 10000000,
      committedAmountUsd: data.committedAmountUsd || 7500000,
      preMoneyValuationUsd: data.preMoneyValuationUsd || 50000000,
      leadInvestorEntity: data.leadInvestorEntity || 'CodeForge Sovereign AI Venture Fund',
      investorPitchDeckSummary: data.investorPitchDeckSummary || 'Leading Autonomous Software Civilization Platform with $14.5M ARR projection.',
      readinessTier: data.readinessTier || InvestmentReadinessTier.TIER_1_EXEMPLARY,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationInvestmentRecords).values({
          id: inv.id,
          companyBlueprintId: inv.companyBlueprintId,
          fundingRound: inv.fundingRound,
          targetAmountUsd: inv.targetAmountUsd,
          committedAmountUsd: inv.committedAmountUsd,
          preMoneyValuationUsd: inv.preMoneyValuationUsd,
          leadInvestorEntity: inv.leadInvestorEntity,
          investorPitchDeckSummary: inv.investorPitchDeckSummary,
          readinessTier: inv.readinessTier,
        });
      }
    } catch {}
    this.memInvestmentRecords.set(inv.id, inv);
    return inv;
  }

  async listInvestmentRecords(companyBlueprintId?: string): Promise<InvestmentRecordDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(schema.civilizationInvestmentRecords).orderBy(desc(schema.civilizationInvestmentRecords.createdAt));
        if (rows.length > 0) {
          let list = rows.map((r) => ({
            id: r.id,
            companyBlueprintId: r.companyBlueprintId,
            fundingRound: r.fundingRound,
            targetAmountUsd: r.targetAmountUsd,
            committedAmountUsd: r.committedAmountUsd,
            preMoneyValuationUsd: r.preMoneyValuationUsd,
            leadInvestorEntity: r.leadInvestorEntity,
            investorPitchDeckSummary: r.investorPitchDeckSummary,
            readinessTier: r.readinessTier as InvestmentReadinessTier,
            createdAt: r.createdAt.toISOString(),
          }));
          if (companyBlueprintId) list = list.filter((i) => i.companyBlueprintId === companyBlueprintId);
          return list;
        }
      }
    } catch {}
    const list = Array.from(this.memInvestmentRecords.values());
    return companyBlueprintId ? list.filter((i) => i.companyBlueprintId === companyBlueprintId) : list;
  }

  // Execution Networks
  async createExecutionTask(data: Partial<ExecutionNetworkTaskDto>): Promise<ExecutionNetworkTaskDto> {
    const task: ExecutionNetworkTaskDto = {
      id: data.id || randomUUID(),
      organizationId: data.organizationId || 'org-civ-seed-1',
      projectId: data.projectId,
      taskTitle: data.taskTitle || 'Autonomous Swarm Execution Task',
      assignedEmployeeId: data.assignedEmployeeId || 'emp-civ-seed-1',
      priority: data.priority || ExecutionNetworkTaskPriority.NORMAL,
      status: data.status || ExecutionNetworkTaskStatus.QUEUED,
      dependencyTaskIds: data.dependencyTaskIds || [],
      payloadSpec: data.payloadSpec || { targetModule: 'compiler', opcode: 'OPTIMIZE' },
      verificationProofHash: data.verificationProofHash || `0xzk_${Date.now().toString(16)}`,
      executionDurationMs: data.executionDurationMs || 350,
      retryCount: data.retryCount || 0,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(schema.civilizationExecutionNetworks).values({
          id: task.id,
          organizationId: task.organizationId,
          projectId: task.projectId,
          taskTitle: task.taskTitle,
          assignedEmployeeId: task.assignedEmployeeId,
          priority: task.priority,
          status: task.status,
          dependencyTaskIds: task.dependencyTaskIds,
          payloadSpec: task.payloadSpec,
          verificationProofHash: task.verificationProofHash,
          executionDurationMs: task.executionDurationMs,
          retryCount: task.retryCount,
        });
      }
    } catch {}
    this.memExecutionTasks.set(task.id, task);
    return task;
  }

  async getExecutionTaskById(id: string): Promise<ExecutionNetworkTaskDto | null> {
    return this.memExecutionTasks.get(id) || null;
  }

  async listExecutionTasks(organizationId?: string, status?: ExecutionNetworkTaskStatus): Promise<ExecutionNetworkTaskDto[]> {
    let list = Array.from(this.memExecutionTasks.values());
    if (organizationId) list = list.filter((t) => t.organizationId === organizationId);
    if (status) list = list.filter((t) => t.status === status);
    return list;
  }

  async updateExecutionTask(id: string, updates: Partial<ExecutionNetworkTaskDto>): Promise<ExecutionNetworkTaskDto | null> {
    const existing = this.memExecutionTasks.get(id);
    if (!existing) return null;
    const updated: ExecutionNetworkTaskDto = { ...existing, ...updates };
    try {
      if (db) {
        await db.update(schema.civilizationExecutionNetworks).set(updates as any).where(eq(schema.civilizationExecutionNetworks.id, id));
      }
    } catch {}
    this.memExecutionTasks.set(id, updated);
    return updated;
  }

  // Overview Aggregations
  async getCommandCenterOverview(userId?: string): Promise<EnterpriseCommandCenterOverviewDto> {
    const orgs = await this.listOrganizations(userId);
    const employees = await this.listDigitalEmployees();
    const blueprints = await this.listCompanyBlueprints(userId);
    const federations = await this.listFederations();
    const products = await this.listProductPortfolios();
    const investments = await this.listInvestmentRecords();
    const tasks = await this.listExecutionTasks();

    const totalCommitted = investments.reduce((acc, inv) => acc + inv.committedAmountUsd, 0) || 7500000;
    const activeTasks = tasks.filter((t) => t.status === ExecutionNetworkTaskStatus.COMPLETED).length;
    const executionRate = tasks.length > 0 ? (activeTasks / tasks.length) * 100 : 98.6;

    return {
      totalActiveOrganizations: orgs.length,
      totalDigitalWorkforceHeadcount: employees.length,
      averageOrganizationalEfficiency: 98.4,
      activeProductPortfoliosCount: products.length,
      totalCapitalCommittedUsd: totalCommitted,
      activeFederationsCount: federations.length,
      networkTasksExecutionRate: executionRate,
      workforceHealthMetrics: {
        utilizationRate: 94.8,
        velocityAverage: 98.2,
        accuracyAverage: 99.4,
        benchCount: employees.filter((e) => e.status === EmployeeEmploymentStatus.BENCH).length,
      },
      topEnterprises: orgs.slice(0, 5),
      recentCompanyBlueprints: blueprints.slice(0, 5),
    };
  }
}
