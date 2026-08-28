import {
  AdminCopilotInsightsDto,
  StudentRiskAlertDto,
  ExecutiveRecommendationDto,
  RiskLevel,
  RecommendationCategory,
} from '@codeforge/shared';

export interface StudentRiskInput {
  studentId: string;
  studentName: string;
  rollNumber: string;
  universityName: string;
  departmentName: string;
  cgpa: number;
  backlogCount: number;
  platformActivityScore: number; // 0 - 100
}

export class AdminCopilotService {
  /**
   * Pure risk classification model
   */
  classifyStudentRisk(input: StudentRiskInput): StudentRiskAlertDto {
    const riskFactors: string[] = [];
    let riskLevel: RiskLevel = RiskLevel.LOW;
    let recommendedAction = 'Maintain current academic and coding progress.';

    if (input.cgpa < 5.5 || input.backlogCount >= 3) {
      riskLevel = RiskLevel.CRITICAL;
      if (input.cgpa < 5.5) riskFactors.push(`Critically low CGPA (${input.cgpa.toFixed(2)}) below graduation threshold`);
      if (input.backlogCount >= 3) riskFactors.push(`Multiple active backlogs (${input.backlogCount} pending courses)`);
      if (input.platformActivityScore < 30) riskFactors.push('Severe decline in platform coding activity (<30%)');
      recommendedAction = 'Immediate faculty mentor intervention, mandatory remedial problem set, and Dean academic counseling.';
    } else if (input.cgpa < 7.0 || input.backlogCount >= 1 || input.platformActivityScore < 45) {
      riskLevel = RiskLevel.HIGH;
      if (input.cgpa < 7.0) riskFactors.push(`CGPA (${input.cgpa.toFixed(2)}) is below Tier-1 placement cutoffs (7.0)`);
      if (input.backlogCount >= 1) riskFactors.push(`Has ${input.backlogCount} active course backlog`);
      if (input.platformActivityScore < 45) riskFactors.push('Sub-optimal coding practice frequency');
      recommendedAction = 'Assign 1-on-1 peer mentor and enroll in placement remediation track.';
    } else if (input.cgpa < 8.0 || input.platformActivityScore < 60) {
      riskLevel = RiskLevel.MEDIUM;
      riskFactors.push('Moderate competitive coding performance; potential to reach Tier-1 product benchmarks with targeted mentoring.');
      recommendedAction = 'Schedule weekly mock interviews and encourage Arena contest participation.';
    }

    return {
      studentId: input.studentId,
      studentName: input.studentName,
      rollNumber: input.rollNumber,
      universityName: input.universityName,
      departmentName: input.departmentName,
      riskLevel,
      riskFactors,
      recommendedAction,
      cgpa: input.cgpa,
      backlogCount: input.backlogCount,
      platformActivityScore: input.platformActivityScore,
    };
  }

  /**
   * Generates strategic executive recommendations
   */
  generateExecutiveRecommendations(): ExecutiveRecommendationDto[] {
    return [
      {
        id: 'rec-ai-curriculum',
        category: RecommendationCategory.CURRICULUM,
        title: 'Accelerate Generative AI & LLM Systems Modules in Fall Semester',
        impactScore: 9,
        urgency: 'HIGH',
        description:
          'Industry hiring for GenAI has grown 142% YoY. Integrating vector search, embeddings, and prompt engineering into CS senior electives will increase placement packages by an estimated 22%.',
      },
      {
        id: 'rec-faculty-office-hours',
        category: RecommendationCategory.FACULTY_ALLOCATION,
        title: 'Scale Distributed Systems Office Hours by 40%',
        impactScore: 8,
        urgency: 'MEDIUM',
        description:
          'Student failure rate in concurrency and distributed transactions is 18% higher than average. Allocating additional TA office hours will reduce backlogs.',
      },
      {
        id: 'rec-placement-drive',
        category: RecommendationCategory.PLACEMENT_PIPELINE,
        title: 'Initiate Early Tier-1 Tech Placement Drive for Top 15% Elo Rating Cohort',
        impactScore: 10,
        urgency: 'HIGH',
        description:
          '48 students have surpassed 1800+ Contest Rating and completed system design benchmarks. Connecting them immediately to Stripe, OpenAI, and Vercel will secure early dream offers.',
      },
      {
        id: 'rec-resource-scaling',
        category: RecommendationCategory.RESOURCE_SCALING,
        title: 'Upgrade Automated Online Judge Parallel Sandbox Execution Capacity',
        impactScore: 7,
        urgency: 'LOW',
        description:
          'Campus-wide hackathons cause transient submission queue delays. Increasing concurrent execution workers prevents submission latency spikes.',
      },
    ];
  }

  /**
   * Aggregates full copilot intelligence insights
   */
  getAdminInsights(sampleStudents?: StudentRiskInput[]): AdminCopilotInsightsDto {
    const students = sampleStudents || [
      {
        studentId: 'st-01',
        studentName: 'Alex Rivera',
        rollNumber: 'MIT-CS-2026-042',
        universityName: 'Massachusetts Institute of Technology',
        departmentName: 'Computer Science',
        cgpa: 5.2,
        backlogCount: 3,
        platformActivityScore: 24,
      },
      {
        studentId: 'st-02',
        studentName: 'Elena Rostova',
        rollNumber: 'STAN-AI-2026-018',
        universityName: 'Stanford University',
        departmentName: 'AI & Data Science',
        cgpa: 6.8,
        backlogCount: 1,
        platformActivityScore: 42,
      },
      {
        studentId: 'st-03',
        studentName: 'Rahul Sharma',
        rollNumber: 'IITB-CS-2026-091',
        universityName: 'IIT Bombay',
        departmentName: 'Computer Science & Engineering',
        cgpa: 9.4,
        backlogCount: 0,
        platformActivityScore: 98,
      },
    ];

    const studentRiskAlerts = students.map(s => this.classifyStudentRisk(s));

    return {
      timestamp: new Date().toISOString(),
      studentRiskAlerts,
      recommendations: this.generateExecutiveRecommendations(),
      placementForecasts: [
        {
          cohortName: 'Class of 2026 (Computer Science & AI)',
          expectedPlacementRate: 94.5,
          projectedTopRecruiters: ['Stripe', 'Google Cloud', 'OpenAI', 'Datadog', 'Vercel'],
        },
        {
          cohortName: 'Class of 2026 (Electronics & Hardware Systems)',
          expectedPlacementRate: 86.0,
          projectedTopRecruiters: ['NVIDIA', 'Qualcomm', 'Apple', 'Tesla'],
        },
      ],
      curriculumGaps: [
        {
          topic: 'Rust Async & Tokio Concurrency',
          industryDemandGap: '+85% Enterprise hiring increase',
          actionableProposal: 'Add 3 hands-on network programming labs in Rust to CS301 Systems course.',
        },
        {
          topic: 'Distributed Tracing & OpenTelemetry',
          industryDemandGap: '+65% Cloud monitoring requirement',
          actionableProposal: 'Incorporate observability checkpoints into backend project milestones.',
        },
      ],
    };
  }
  getPlacementForecasts() {
    return [
      {
        cohortName: 'Class of 2026 (Computer Science & AI)',
        expectedPlacementRate: 94.5,
        projectedTopRecruiters: ['Stripe', 'Google Cloud', 'OpenAI', 'Datadog', 'Vercel'],
      },
      {
        cohortName: 'Class of 2026 (Electronics & Hardware Systems)',
        expectedPlacementRate: 86.0,
        projectedTopRecruiters: ['NVIDIA', 'Qualcomm', 'Apple', 'Tesla'],
      },
    ];
  }

  getCurriculumGaps() {
    return [
      {
        topic: 'Rust Async & Tokio Concurrency',
        industryDemandGap: '+85% Enterprise hiring increase',
        actionableProposal: 'Add 3 hands-on network programming labs in Rust to CS301 Systems course.',
      },
      {
        topic: 'Distributed Tracing & OpenTelemetry',
        industryDemandGap: '+65% Cloud monitoring requirement',
        actionableProposal: 'Incorporate observability checkpoints into backend project milestones.',
      },
      {
        topic: 'LLM Systems & Vector Database Indexing',
        industryDemandGap: '+120% Applied AI engineering surge',
        actionableProposal: 'Introduce practical RAG and embedding fine-tuning coursework.',
      },
    ];
  }

  generatePrescriptiveRecommendations(): ExecutiveRecommendationDto[] {
    return this.generateExecutiveRecommendations();
  }
}

export const adminCopilotService = new AdminCopilotService();
