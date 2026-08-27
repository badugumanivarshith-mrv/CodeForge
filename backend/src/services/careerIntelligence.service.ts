import {
  CareerRepository,
  RatingRepository,
  CurriculumRepository,
} from '../repositories';
import { db } from '../database/connection';
import { topicMastery, topics } from '../database/schema';

import { eq } from 'drizzle-orm';
import {
  CareerRole,
  CareerGoalDto,
  SetCareerGoalDto,
  CareerReadinessDto,
  CareerPathDetailDto,
  CareerSkillGapDto,
} from '@codeforge/shared';

export const CAREER_PATHS_DATA: Record<CareerRole, CareerPathDetailDto> = {
  [CareerRole.FRONTEND_DEVELOPER]: {
    role: CareerRole.FRONTEND_DEVELOPER,
    title: 'Frontend Developer',
    description: 'Specializes in user interfaces, browser runtime mechanics, responsive design, and state management.',
    marketDemand: 'Very High',
    avgSalaryRange: '$95,000 - $145,000',
    keySkills: ['JavaScript/TypeScript', 'React & Next.js', 'CSS Layouts & Animation', 'DOM Performance', 'REST/GraphQL Integration'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Core Web Fundamentals & JavaScript',
        description: 'Master modern ES6+, DOM manipulation, asynchronous programming, and event loops.',
        topics: ['javascript-syntax-variables', 'javascript-functions-scope', 'javascript-async-promises'],
        recommendedProjects: ['Interactive Component Showcase', 'Task Management Dashboard'],
      },
      {
        phaseNumber: 2,
        title: 'Framework Architecture & State Management',
        description: 'Deep dive into React component lifecycles, hooks, and scalable global state patterns.',
        topics: ['javascript-dom-events', 'typescript-interfaces-types'],
        recommendedProjects: ['E-Commerce Product Explorer', 'Real-time Collaborative Whiteboard'],
      },
      {
        phaseNumber: 3,
        title: 'Web Performance & Accessibility',
        description: 'Core Web Vitals, SSR/SSG, code splitting, and WCAG AA accessibility compliance.',
        topics: ['typescript-generics-utility'],
        recommendedProjects: ['High-Performance Data Visualization App'],
      },
    ],
  },
  [CareerRole.BACKEND_DEVELOPER]: {
    role: CareerRole.BACKEND_DEVELOPER,
    title: 'Backend Developer',
    description: 'Architects robust server APIs, microservices, databases, authentication, and high-throughput pipelines.',
    marketDemand: 'Very High',
    avgSalaryRange: '$105,000 - $160,000',
    keySkills: ['Python / Node.js / Java', 'Relational & NoSQL Databases', 'REST & gRPC APIs', 'Caching & Message Queues', 'Security & Concurrency'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Programming Foundations & Algorithms',
        description: 'Core data structures, object-oriented design, algorithmic complexity, and clean code.',
        topics: ['python-data-types-variables', 'python-control-flow', 'python-functions-modules'],
        recommendedProjects: ['CLI Task Automation Tool', 'Algorithmic Problem Solver'],
      },
      {
        phaseNumber: 2,
        title: 'Database Architecture & Query Optimization',
        description: 'Relational schema modeling, indexing strategies, ACID transactions, and query tuning.',
        topics: ['python-data-structures', 'python-oop-classes'],
        recommendedProjects: ['Multi-Tenant SaaS Database Schema', 'Inventory Management API'],
      },
      {
        phaseNumber: 3,
        title: 'Distributed Systems & Scalability',
        description: 'Microservice design, Redis caching, message brokers (Kafka/RabbitMQ), and rate limiting.',
        topics: ['python-error-handling-exceptions', 'python-file-io-serialization'],
        recommendedProjects: ['Distributed Rate Limiter & Message Worker'],
      },
    ],
  },
  [CareerRole.FULLSTACK_DEVELOPER]: {
    role: CareerRole.FULLSTACK_DEVELOPER,
    title: 'Full Stack Developer',
    description: 'Bridges frontend experiences with backend distributed architectures and end-to-end delivery.',
    marketDemand: 'Very High',
    avgSalaryRange: '$110,000 - $165,000',
    keySkills: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'PostgreSQL / Drizzle ORM', 'Docker & CI/CD'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'End-to-End TypeScript & Web Fundamentals',
        description: 'Full-stack type sharing, isomorphic data validation, and modern async patterns.',
        topics: ['typescript-syntax-basics', 'javascript-async-promises'],
        recommendedProjects: ['CRUD Application with Auth'],
      },
      {
        phaseNumber: 2,
        title: 'Database Integration & API Engineering',
        description: 'Relational DB persistence, JWT authentication, and optimistic client state.',
        topics: ['typescript-interfaces-types', 'python-data-structures'],
        recommendedProjects: ['CodeForge Learning Dashboard'],
      },
      {
        phaseNumber: 3,
        title: 'Production Deployment & Cloud Hosting',
        description: 'Containerization, edge deployments, caching layers, and observability.',
        topics: ['typescript-generics-utility'],
        recommendedProjects: ['Production SaaS Platform with Analytics'],
      },
    ],
  },
  [CareerRole.DEVOPS_ENGINEER]: {
    role: CareerRole.DEVOPS_ENGINEER,
    title: 'DevOps Engineer',
    description: 'Automates infrastructure provisioning, CI/CD pipelines, container orchestration, and telemetry.',
    marketDemand: 'High',
    avgSalaryRange: '$115,000 - $170,000',
    keySkills: ['Linux & Bash', 'Docker & Kubernetes', 'Terraform / IaC', 'GitHub Actions CI/CD', 'Prometheus & Grafana'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Linux Systems & Scripting',
        description: 'OS kernel basics, process management, shell scripting, and network configuration.',
        topics: ['python-functions-modules', 'python-file-io-serialization'],
        recommendedProjects: ['Automated Server Health Monitor'],
      },
      {
        phaseNumber: 2,
        title: 'Containerization & CI/CD Automation',
        description: 'Multi-stage Docker builds, Kubernetes pods & services, automated testing pipelines.',
        topics: ['python-error-handling-exceptions'],
        recommendedProjects: ['Zero-Downtime Deployment Pipeline'],
      },
      {
        phaseNumber: 3,
        title: 'Infrastructure as Code & Observability',
        description: 'Declarative cloud provisioning, centralized logging, alerts, and SLO monitoring.',
        topics: ['python-data-structures'],
        recommendedProjects: ['Multi-Region Cloud Infrastructure with Terraform'],
      },
    ],
  },
  [CareerRole.CLOUD_ENGINEER]: {
    role: CareerRole.CLOUD_ENGINEER,
    title: 'Cloud Engineer',
    description: 'Designs resilient cloud architectures, serverless systems, and cloud security frameworks.',
    marketDemand: 'High',
    avgSalaryRange: '$110,000 - $165,000',
    keySkills: ['AWS / GCP / Azure', 'Serverless Functions', 'Cloud Networking (VPC)', 'IAM & Security', 'Cloud Storage & Databases'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Cloud Foundations & Networking',
        description: 'VPCs, subnets, routing tables, security groups, and cloud IAM access policies.',
        topics: ['python-data-types-variables'],
        recommendedProjects: ['Secure Multi-Tier Cloud VPC'],
      },
      {
        phaseNumber: 2,
        title: 'Serverless & Cloud Databases',
        description: 'Event-driven architectures using Cloud Functions, Lambda, BigQuery, and DynamoDB.',
        topics: ['python-functions-modules'],
        recommendedProjects: ['Event-Driven Thumbnail Generator'],
      },
      {
        phaseNumber: 3,
        title: 'Cloud Cost Optimization & High Availability',
        description: 'Auto-scaling groups, cross-region replication, failover testing, and FinOps.',
        topics: ['python-oop-classes'],
        recommendedProjects: ['Disaster Recovery Failover Simulation'],
      },
    ],
  },
  [CareerRole.AI_ENGINEER]: {
    role: CareerRole.AI_ENGINEER,
    title: 'AI Systems Engineer',
    description: 'Builds GenAI applications, LLM fine-tuning pipelines, vector embeddings, and RAG systems.',
    marketDemand: 'Very High',
    avgSalaryRange: '$130,000 - $190,000',
    keySkills: ['Python & PyTorch', 'LLMs & Prompt Engineering', 'Vector Databases (Pinecone/Chroma)', 'RAG Architectures', 'AI Agents & Tool Calling'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Python for AI & Numerical Computing',
        description: 'Vectorized NumPy math, linear algebra, tokenization, and API orchestration.',
        topics: ['python-data-types-variables', 'python-data-structures', 'python-functions-modules'],
        recommendedProjects: ['Document Embeddings & Semantic Search'],
      },
      {
        phaseNumber: 2,
        title: 'RAG & Vector Retrieval Systems',
        description: 'Chunking strategies, hybrid vector + keyword search, re-ranking, and context injection.',
        topics: ['python-oop-classes', 'python-file-io-serialization'],
        recommendedProjects: ['Codebase Q&A Assistant with Socratic Feedback'],
      },
      {
        phaseNumber: 3,
        title: 'Autonomous AI Agents & Structured Outputs',
        description: 'Multi-agent orchestration, tool use, JSON schema enforcement, and latency optimization.',
        topics: ['python-error-handling-exceptions'],
        recommendedProjects: ['Autonomous Bug-Fixing Coding Agent'],
      },
    ],
  },
  [CareerRole.DATA_SCIENTIST]: {
    role: CareerRole.DATA_SCIENTIST,
    title: 'Data Scientist',
    description: 'Transforms raw telemetry into predictive machine learning models and actionable analytics.',
    marketDemand: 'High',
    avgSalaryRange: '$105,000 - $155,000',
    keySkills: ['Python & Pandas', 'Statistical Modeling', 'Scikit-Learn / XGBoost', 'Data Visualization', 'SQL & Big Data'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Data Analysis & Wrangling',
        description: 'DataFrame operations, feature extraction, handling missing data, and statistical tests.',
        topics: ['python-data-types-variables', 'python-data-structures'],
        recommendedProjects: ['Exploratory Data Analysis Report'],
      },
      {
        phaseNumber: 2,
        title: 'Supervised & Unsupervised Machine Learning',
        description: 'Regression, classification, clustering, cross-validation, and hyperparameter tuning.',
        topics: ['python-functions-modules'],
        recommendedProjects: ['Student Learning Dropout Prediction Model'],
      },
      {
        phaseNumber: 3,
        title: 'Model Deployment & Explainable AI',
        description: 'SHAP values, model serialization, API serving, and drift detection.',
        topics: ['python-file-io-serialization'],
        recommendedProjects: ['Real-Time Inference Microservice'],
      },
    ],
  },
  [CareerRole.CYBERSECURITY_ENGINEER]: {
    role: CareerRole.CYBERSECURITY_ENGINEER,
    title: 'Cybersecurity Engineer',
    description: 'Protects software systems against vulnerabilities, zero-days, injection attacks, and data breaches.',
    marketDemand: 'Very High',
    avgSalaryRange: '$115,000 - $175,000',
    keySkills: ['AppSec & OWASP Top 10', 'Cryptographic Primitives', 'Network Security', 'Penetration Testing', 'Security Auditing'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Application Security & Defensive Coding',
        description: 'OWASP Top 10 mitigation, SQL injection defense, XSS/CSRF prevention, and input sanitization.',
        topics: ['c-syntax-basic-types', 'python-error-handling-exceptions'],
        recommendedProjects: ['Vulnerability Scanner for Web Endpoints'],
      },
      {
        phaseNumber: 2,
        title: 'Cryptography & Auth Protocols',
        description: 'Argon2id hashing, HMAC signatures, JWT token lifecycle, and OAuth 2.0 / PKCE security.',
        topics: ['python-functions-modules'],
        recommendedProjects: ['Zero-Knowledge Authentication Proof of Concept'],
      },
      {
        phaseNumber: 3,
        title: 'Threat Modeling & Infrastructure Hardening',
        description: 'Container security, CIS benchmarks, secret management, and incident response runbooks.',
        topics: ['python-file-io-serialization'],
        recommendedProjects: ['Automated Dependency Security Auditing Tool'],
      },
    ],
  },
  [CareerRole.MOBILE_DEVELOPER]: {
    role: CareerRole.MOBILE_DEVELOPER,
    title: 'Mobile App Developer',
    description: 'Builds fluid, responsive native and cross-platform mobile applications for iOS and Android.',
    marketDemand: 'High',
    avgSalaryRange: '$95,000 - $150,000',
    keySkills: ['React Native / Flutter', 'TypeScript', 'Offline Storage & Sync', 'Native Device APIs', 'App Store Deployment'],
    roadmapPhases: [
      {
        phaseNumber: 1,
        title: 'Cross-Platform Framework Fundamentals',
        description: 'Component lifecycles, mobile gestures, navigation stacks, and responsive UI layouts.',
        topics: ['javascript-syntax-variables', 'typescript-syntax-basics'],
        recommendedProjects: ['Personal Habit Tracker App'],
      },
      {
        phaseNumber: 2,
        title: 'Offline-First Architecture & State',
        description: 'SQLite/WatermelonDB storage, background sync workers, and push notifications.',
        topics: ['typescript-interfaces-types', 'javascript-async-promises'],
        recommendedProjects: ['Offline Coding Flashcard Application'],
      },
      {
        phaseNumber: 3,
        title: 'Mobile Performance & Store Release',
        description: 'Startup time optimization, native modules, memory profiling, and automated app publishing.',
        topics: ['typescript-generics-utility'],
        recommendedProjects: ['Full-Featured Mobile Learning Companion'],
      },
    ],
  },
};

export class CareerIntelligenceService {
  private careerRepo: CareerRepository;
  private ratingRepo: RatingRepository;
  private curriculumRepo: CurriculumRepository;

  constructor(
    careerRepo = new CareerRepository(),
    ratingRepo = new RatingRepository(),
    curriculumRepo = new CurriculumRepository(),
  ) {
    this.careerRepo = careerRepo;
    this.ratingRepo = ratingRepo;
    this.curriculumRepo = curriculumRepo;
  }

  getCareerPaths(): CareerPathDetailDto[] {
    return Object.values(CAREER_PATHS_DATA);
  }

  getCareerPath(role: CareerRole): CareerPathDetailDto {
    return CAREER_PATHS_DATA[role] || CAREER_PATHS_DATA[CareerRole.FULLSTACK_DEVELOPER];
  }

  async getUserGoal(userId: string): Promise<CareerGoalDto | null> {
    return this.careerRepo.getGoal(userId);
  }

  async setUserGoal(userId: string, data: SetCareerGoalDto): Promise<CareerGoalDto> {
    return this.careerRepo.upsertGoal(userId, data);
  }

  async calculateReadiness(userId: string, targetRoleOverride?: CareerRole): Promise<CareerReadinessDto> {
    let targetRole = targetRoleOverride;
    if (!targetRole) {
      const goal = await this.careerRepo.getGoal(userId);
      targetRole = goal?.targetRole || CareerRole.FULLSTACK_DEVELOPER;
    }

    const roadmap = this.getCareerPath(targetRole);
    const ratingData = await this.ratingRepo.getUserRating(userId);
    const userRating = ratingData?.currentRating || 1200;


    // Fetch user topic mastery scores
    const masteryRows = await db
      .select({
        topicSlug: topics.slug,
        masteryScore: topicMastery.masteryScore,
      })
      .from(topicMastery)
      .innerJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(eq(topicMastery.userId, userId));

    const masteryMap: Record<string, number> = {};
    for (const r of masteryRows) {
      masteryMap[r.topicSlug] = Math.round(Number(r.masteryScore) || 0);
    }

    // Evaluate skill gaps across key skills
    const skillGaps: CareerSkillGapDto[] = [];
    let passedSkillsCount = 0;

    roadmap.keySkills.forEach((skill, idx) => {
      // Benchmark readiness on rating and mastery
      const baselineRatingThreshold = 1200 + idx * 60;
      const isMet = userRating >= baselineRatingThreshold;

      if (isMet) passedSkillsCount++;

      skillGaps.push({
        skillName: skill,
        requiredLevel: idx < 2 ? 'Proficient' : 'Advanced',
        currentLevel: isMet ? (userRating > baselineRatingThreshold + 100 ? 'Advanced' : 'Proficient') : 'Learning',
        isMet,
        gapSeverity: isMet ? 'none' : (baselineRatingThreshold - userRating > 100 ? 'critical' : 'minor'),
      });
    });

    // Score calculation (0-100)
    const baseScore = Math.round((passedSkillsCount / roadmap.keySkills.length) * 60);
    const ratingBonus = Math.min(40, Math.max(0, Math.round(((userRating - 1000) / 1000) * 40)));
    const readinessScore = Math.min(100, Math.max(20, baseScore + ratingBonus));

    // Recommendations
    const recommendedCourses = [
      { topicId: 'python-data-structures', title: 'Data Structures & Algorithms', languageId: 'python' },
      { topicId: 'javascript-async-promises', title: 'Asynchronous Programming', languageId: 'javascript' },
      { topicId: 'typescript-generics-utility', title: 'Advanced Type Systems', languageId: 'typescript' },
    ];

    const recommendedProjects = roadmap.roadmapPhases[0]?.recommendedProjects.map(title => ({
      title,
      difficulty: 'Medium',
      description: `Build a production-grade ${title} to prove competence in ${targetRole.replace(/_/g, ' ')}.`,
    })) || [];

    const timelineEstimate = readinessScore > 75 ? '1-2 Months' : (readinessScore > 50 ? '3-4 Months' : '5-6 Months');

    // Persist readiness history
    await this.careerRepo.saveReadinessHistory(
      userId,
      targetRole,
      readinessScore,
      skillGaps,
      recommendedCourses,
    );

    return {
      targetRole,
      readinessScore,
      skillGaps,
      recommendedCourses,
      recommendedProjects,
      timelineEstimate,
      careerRoadmap: roadmap,
    };
  }
}
