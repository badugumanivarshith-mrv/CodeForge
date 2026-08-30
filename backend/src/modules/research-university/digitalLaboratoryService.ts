import {
  IResearchUniversityRepository,
  researchUniversityRepository,
} from '../../repositories';
import {
  LaboratoryDto,
  CreateLaboratoryDto,
  ExperimentDto,
  CreateExperimentDto,
  AcademicDepartment,
  LabStatus,
  ExperimentStatus,
} from '@codeforge/shared';

export class DigitalLaboratoryService {
  constructor(private repo: IResearchUniversityRepository = researchUniversityRepository) {}

  /**
   * Provisions a new digital research laboratory
   */
  async provisionLaboratory(dto: CreateLaboratoryDto): Promise<LaboratoryDto> {
    if (!dto.name || !dto.labType || !dto.department) {
      throw new Error('Laboratory name, labType, and department are required.');
    }

    return this.repo.createLaboratory({
      ...dto,
      status: dto.status || LabStatus.OPERATIONAL,
      computeCapacityTeraflops: dto.computeCapacityTeraflops || 50000.0,
      directorAgent: dto.directorAgent || `${dto.name} Autonomous Director Agent`,
    });
  }

  /**
   * Queues and autonomously executes an experimental simulation
   */
  async runExperiment(dto: CreateExperimentDto): Promise<ExperimentDto> {
    const lab = await this.repo.getLaboratoryById(dto.labId);
    if (!lab) {
      throw new Error(`Laboratory not found for ID: ${dto.labId}`);
    }

    // Simulate compute execution and deterministic reproducibility verification
    const executionDurationMs = Math.floor(Math.random() * 3500) + 1500;
    const reproducibilityScore = dto.reproducibilityScore ?? (94.0 + Math.random() * 5.8);

    const experiment = await this.repo.createExperiment({
      ...dto,
      status: ExperimentStatus.COMPLETED,
      reproducibilityScore: parseFloat(reproducibilityScore.toFixed(2)),
      resultsSummary: dto.resultsSummary || `Simulation converged with high confidence (${reproducibilityScore.toFixed(1)}% reproducibility index).`,
    });

    // Update active simulation counters on the lab
    await this.repo.updateLaboratory(dto.labId, {
      activeSimulationsCount: lab.activeSimulationsCount + 1,
      datasetsMountedCount: Math.max(lab.datasetsMountedCount, 12),
    });

    return experiment;
  }

  /**
   * Retrieves a laboratory by ID
   */
  async getLaboratory(labId: string): Promise<LaboratoryDto | null> {
    return this.repo.getLaboratoryById(labId);
  }

  /**
   * Lists laboratories optionally filtered by department
   */
  async listLaboratories(department?: AcademicDepartment): Promise<LaboratoryDto[]> {
    return this.repo.listLaboratories(department);
  }

  /**
   * Lists experiments executed in a laboratory
   */
  async listExperiments(labId?: string): Promise<ExperimentDto[]> {
    return this.repo.listExperiments(labId);
  }

  /**
   * Retrieves laboratory compute utilization telemetry
   */
  async getLaboratoryMetrics(labId: string): Promise<{
    labId: string;
    name: string;
    computeCapacityTeraflops: number;
    activeSimulationsCount: number;
    averageExperimentReproducibility: number;
    utilizationRatePercent: number;
  }> {
    const lab = await this.repo.getLaboratoryById(labId);
    if (!lab) throw new Error(`Laboratory not found for ID: ${labId}`);

    const experiments = await this.repo.listExperiments(labId);
    const avgRep = experiments.length > 0
      ? experiments.reduce((sum, e) => sum + e.reproducibilityScore, 0) / experiments.length
      : 97.5;

    const utilization = Math.min(98.5, 45.0 + (experiments.length * 6.5));

    return {
      labId: lab.id,
      name: lab.name,
      computeCapacityTeraflops: lab.computeCapacityTeraflops,
      activeSimulationsCount: lab.activeSimulationsCount,
      averageExperimentReproducibility: parseFloat(avgRep.toFixed(2)),
      utilizationRatePercent: parseFloat(utilization.toFixed(1)),
    };
  }
}

export const digitalLaboratoryService = new DigitalLaboratoryService();
