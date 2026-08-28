import {
  CareerTwinDto,
  CreateCareerTwinDto,
  UpdateCareerTwinDto,
  CareerSnapshotDto,
  CareerEventDto,
  CreateCareerEventDto,
  CareerMilestoneDto,
  CareerOsGoalDto,
  CreateCareerOsGoalDto,
  UpdateCareerOsGoalDto,
  CareerCoachingReportDto,
  PersonalBrandProfileDto,
  NetworkConnectionDto,
  CareerPredictionDto,
} from '@codeforge/shared';

export interface ICareerOsRepository {
  // Digital Twin
  getTwinByUserId(userId: string): Promise<CareerTwinDto | null>;
  createTwin(userId: string, data: CreateCareerTwinDto): Promise<CareerTwinDto>;
  updateTwin(userId: string, data: UpdateCareerTwinDto): Promise<CareerTwinDto>;
  saveSnapshot(twinId: string, userId: string, healthScore: number, metrics: Record<string, number>): Promise<CareerSnapshotDto>;
  getSnapshots(userId: string, limit?: number): Promise<CareerSnapshotDto[]>;

  // Events & Timeline
  createEvent(twinId: string, userId: string, data: CreateCareerEventDto): Promise<CareerEventDto>;
  listEvents(userId: string): Promise<CareerEventDto[]>;
  createMilestone(twinId: string, userId: string, title: string, description: string, category?: string, targetDate?: string): Promise<CareerMilestoneDto>;
  listMilestones(userId: string): Promise<CareerMilestoneDto[]>;
  achieveMilestone(milestoneId: string, userId: string): Promise<CareerMilestoneDto | null>;

  // Goals
  createGoal(twinId: string, userId: string, data: CreateCareerOsGoalDto): Promise<CareerOsGoalDto>;
  listGoals(userId: string): Promise<CareerOsGoalDto[]>;
  updateGoal(goalId: string, userId: string, data: UpdateCareerOsGoalDto): Promise<CareerOsGoalDto | null>;
  deleteGoal(goalId: string, userId: string): Promise<boolean>;

  // Coaching Reports
  saveCoachingReport(twinId: string, userId: string, data: Omit<CareerCoachingReportDto, 'id' | 'twinId' | 'userId' | 'generatedAt'>): Promise<CareerCoachingReportDto>;
  getLatestCoachingReport(userId: string): Promise<CareerCoachingReportDto | null>;
  listCoachingReports(userId: string): Promise<CareerCoachingReportDto[]>;

  // Personal Brand
  getPersonalBrandProfile(userId: string): Promise<PersonalBrandProfileDto | null>;
  upsertPersonalBrandProfile(userId: string, profile: Partial<PersonalBrandProfileDto>): Promise<PersonalBrandProfileDto>;

  // Network Connections
  createNetworkConnection(userId: string, data: Omit<NetworkConnectionDto, 'id' | 'userId' | 'createdAt'>): Promise<NetworkConnectionDto>;
  listNetworkConnections(userId: string): Promise<NetworkConnectionDto[]>;
  deleteNetworkConnection(connectionId: string, userId: string): Promise<boolean>;

  // Predictions
  savePredictions(twinId: string, userId: string, predictions: CareerPredictionDto[]): Promise<CareerPredictionDto[]>;
  getLatestPredictions(userId: string): Promise<CareerPredictionDto[]>;
}
