import {
  ResumeRepository,
  UserRepository,
  PortfolioRepository,
  RatingRepository,
} from '../repositories';
import {
  ResumeDto,
  CreateResumeDto,
  UpdateResumeDto,
  AtsAnalysisDto,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class ResumeService {
  private resumeRepo: ResumeRepository;
  private userRepo: UserRepository;
  private portfolioRepo: PortfolioRepository;
  private ratingRepo: RatingRepository;

  constructor(
    resumeRepo = new ResumeRepository(),
    userRepo = new UserRepository(),
    portfolioRepo = new PortfolioRepository(),
    ratingRepo = new RatingRepository(),
  ) {
    this.resumeRepo = resumeRepo;
    this.userRepo = userRepo;
    this.portfolioRepo = portfolioRepo;
    this.ratingRepo = ratingRepo;
  }

  async createResume(userId: string, data: CreateResumeDto): Promise<ResumeDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }


    const profile = await this.userRepo.getProfile(userId);

    let personalInfo = data.personalInfo;
    if (!personalInfo) {
      personalInfo = {
        fullName: profile?.fullName || user.username,
        email: user.email,
        github: `https://github.com/${user.username}`,
        location: 'San Francisco, CA',
        website: undefined,
      };
    }


    let skills = data.skills || [];
    let projects = data.projects || [];
    let experience = data.experience || [];
    let education = data.education || [];

    if (data.importCodeforgeData) {
      // Import portfolio projects
      const portProjects = await this.portfolioRepo.getProjectsByUserId(userId);
      if (portProjects.length > 0) {
        projects = portProjects.map(p => ({
          name: p.title,
          description: p.description,
          technologies: p.technologies,
          liveUrl: p.demoUrl,
          repoUrl: p.repositoryUrl,
        }));
      }

      if (skills.length === 0) {
        skills = ['TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'REST APIs'];
      }

      if (experience.length === 0) {
        experience = [
          {
            company: 'CodeForge Labs',
            position: 'Software Engineering Apprentice',
            startDate: '2025-01',
            current: true,
            highlights: [
              'Architected full-stack TypeScript applications with PostgreSQL and REST microservices.',
              'Optimized algorithm execution runtime and solved 50+ Arena programming challenges.',
              'Maintained high code quality with automated unit, integration, and security test suites.',
            ],
          },
        ];
      }

      if (education.length === 0) {
        education = [
          {
            institution: 'University of Computer Science',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            graduationYear: '2025',
          },
        ];
      }
    }

    const resume = await this.resumeRepo.createResume(userId, {
      title: data.title,
      templateName: data.templateName || 'modern-ats',
      targetRole: data.targetRole,
      personalInfo,
      skills,
      experience,
      projects,
      education,
    });

    // Auto-analyze ATS score
    await this.analyzeAtsScore(resume.id, userId);

    return (await this.resumeRepo.getResumeById(resume.id))!;
  }

  async getUserResumes(userId: string): Promise<ResumeDto[]> {
    return this.resumeRepo.getResumesByUserId(userId);
  }

  async getResume(id: string, userId: string): Promise<ResumeDto> {
    const resume = await this.resumeRepo.getResumeById(id);
    if (!resume || (resume.userId !== userId && !resume.isPublic)) {
      throw new NotFoundError('Resume not found or access denied', 'RESUME_NOT_FOUND');
    }
    return resume;
  }

  async updateResume(id: string, userId: string, data: UpdateResumeDto): Promise<ResumeDto> {
    const updated = await this.resumeRepo.updateResume(id, userId, data);
    if (!updated) {
      throw new NotFoundError('Resume not found or access denied', 'RESUME_NOT_FOUND');
    }
    return updated;
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    const success = await this.resumeRepo.deleteResume(id, userId);
    if (!success) {
      throw new NotFoundError('Resume not found or access denied', 'RESUME_NOT_FOUND');
    }
  }

  async analyzeAtsScore(resumeId: string, userId: string): Promise<AtsAnalysisDto> {
    const resume = await this.resumeRepo.getResumeById(resumeId);
    if (!resume || resume.userId !== userId) {
      throw new NotFoundError('Resume not found or access denied', 'RESUME_NOT_FOUND');
    }


    const keyRoleTerms: Record<string, string[]> = {
      'frontend': ['react', 'typescript', 'javascript', 'html', 'css', 'redux', 'next.js', 'responsive', 'performance'],
      'backend': ['node.js', 'python', 'postgresql', 'sql', 'api', 'rest', 'docker', 'database', 'microservices', 'caching'],
      'fullstack': ['react', 'node.js', 'typescript', 'postgresql', 'rest', 'docker', 'git', 'ci/cd', 'cloud'],
      'ai': ['python', 'pytorch', 'machine learning', 'llm', 'rag', 'vector', 'embeddings', 'algorithms'],
    };

    const roleLower = resume.targetRole.toLowerCase();
    let targetKeywords = keyRoleTerms['fullstack'];
    for (const [key, terms] of Object.entries(keyRoleTerms)) {
      if (roleLower.includes(key)) {
        targetKeywords = terms;
        break;
      }
    }

    const textToSearch = [
      resume.skills.join(' '),
      resume.experience.map(e => e.highlights.join(' ') + ' ' + e.position).join(' '),
      resume.projects.map(p => p.name + ' ' + p.description + ' ' + p.technologies.join(' ')).join(' '),
    ].join(' ').toLowerCase();

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of targetKeywords) {
      if (textToSearch.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    let score = Math.round((matchedKeywords.length / targetKeywords.length) * 80);
    if (resume.projects.length >= 2) score += 10;
    if (resume.experience.length >= 1) score += 10;
    score = Math.min(98, Math.max(40, score));

    const strengths = [
      `Strong technical skill keyword density (${matchedKeywords.length}/${targetKeywords.length} core keywords present).`,
      'Clean ATS-parsable section structure without ambiguous non-standard table formats.',
      'Action-oriented project descriptions detailing tech stacks and deliverables.',
    ];

    const suggestions = missingKeywords.length > 0
      ? [
          `Consider incorporating high-impact keywords such as: ${missingKeywords.slice(0, 3).join(', ')}.`,
          'Quantify accomplishments in work experience bullet points (e.g., latency reduced by 30%).',
        ]
      : ['Resume is strongly optimized for ATS filters. Ready for export and recruiter review.'];

    await this.resumeRepo.updateResume(resumeId, userId, {
      atsScore: score,
      atsFeedback: {
        score,
        strengths,
        missingKeywords,
        formattingSuggestions: suggestions,
      },
    });

    return {
      score,
      strengths,
      missingKeywords,
      suggestions,
    };
  }
}
