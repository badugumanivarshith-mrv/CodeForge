import { IProblemRepository, ICurriculumRepository } from '../repositories';
import {
  ProblemSummaryDto,
  ProblemDetailDto,
  LanguageId,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class ProblemService {
  constructor(
    private problemRepo: IProblemRepository,
    private curriculumRepo: ICurriculumRepository,
  ) {}

  public async listProblems(filters?: {
    topicId?: string;
    difficulty?: string;
  }): Promise<ProblemSummaryDto[]> {
    return await this.problemRepo.listProblems(filters);
  }

  public async getProblemDetail(
    slug: string,
    preferredLanguageId?: LanguageId,
  ): Promise<ProblemDetailDto> {
    const problem = await this.problemRepo.findBySlug(slug);
    if (!problem) {
      throw new NotFoundError(`Problem with slug "${slug}" not found`);
    }

    const topic = await this.curriculumRepo.getTopicById(problem.topicId);
    const examples = await this.problemRepo.getExamples(problem.id);
    const sampleTestCases = await this.problemRepo.getTestCases(problem.id, false); // STRICTLY HIDDEN = FALSE

    return {
      id: problem.id,
      topicId: problem.topicId,
      topicTitle: topic?.title || 'Algorithmic Arena',
      languageId: preferredLanguageId || topic?.languageId || LanguageId.PYTHON,
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      promptMdx: problem.promptMdx,
      starterCode: problem.starterCode,
      boilerplateCode: problem.boilerplateCode,
      memoryLimitMb: problem.memoryLimitMb,
      timeLimitMs: problem.timeLimitMs,
      examples,
      sampleTestCases,
      isSolved: false,
    };
  }

  public async getProblemHints(
    problemId: string,
    tier: number,
  ): Promise<{ tier: number; hint: string }> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new NotFoundError(`Problem with id "${problemId}" not found`);
    }

    let hint = '';
    if (tier === 1) {
      hint = `💡 **Concept Nudge (Tier 1)**: Consider the input constraints and what data structure enables fast element lookups (e.g., $O(1)$ amortized time).`;
    } else if (tier === 2) {
      hint = `🧩 **Algorithm Structure (Tier 2)**: If using a hash map or two-pointer technique, what complement value are you looking for as you iterate through the elements?`;
    } else {
      hint = `⚡ **Optimization & Edge Cases (Tier 3)**: Watch out for duplicate elements, negative numbers, or empty inputs. Aim for an $O(N)$ time complexity solution.`;
    }

    return { tier, hint };
  }
}
