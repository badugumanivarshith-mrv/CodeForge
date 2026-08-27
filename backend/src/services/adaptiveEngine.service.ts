import { ProblemDifficulty } from '@codeforge/shared';

export interface DifficultyTransitionResult {
  nextDifficulty: ProblemDifficulty;
  reason: string;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export class AdaptiveEngineService {
  /**
   * Evaluates performance history and determines the next difficulty level
   * with anti-oscillation damping and explainable transition reasons.
   */
  calculateNextDifficulty(
    currentDifficulty: ProblemDifficulty | string,
    wasCorrect: boolean,
    previousConsecutiveCorrect: number = 0,
    previousConsecutiveIncorrect: number = 0,
  ): DifficultyTransitionResult {
    let consecutiveCorrect = wasCorrect ? previousConsecutiveCorrect + 1 : 0;
    let consecutiveIncorrect = !wasCorrect ? previousConsecutiveIncorrect + 1 : 0;

    let nextDifficulty = (currentDifficulty as ProblemDifficulty) || ProblemDifficulty.MEDIUM;
    let reason = wasCorrect
      ? 'Maintained difficulty after correct response.'
      : 'Maintained difficulty after incorrect response.';

    if (wasCorrect) {
      if (currentDifficulty === ProblemDifficulty.EASY) {
        // Immediate step up from easy on correct answer
        nextDifficulty = ProblemDifficulty.MEDIUM;
        reason = 'Promoted to Medium difficulty after demonstrating core proficiency on Easy question.';
        consecutiveCorrect = 0;
      } else if (currentDifficulty === ProblemDifficulty.MEDIUM) {
        // Require 2 consecutive correct answers at medium to transition to difficult (anti-oscillation)
        if (consecutiveCorrect >= 2) {
          nextDifficulty = ProblemDifficulty.DIFFICULT;
          reason = 'Advanced to Difficult difficulty after 2 consecutive correct solutions.';
          consecutiveCorrect = 0;
        } else {
          reason = 'Correct answer on Medium problem. 1 more correct solution needed to unlock Difficult level.';
        }
      } else if (currentDifficulty === ProblemDifficulty.DIFFICULT) {
        nextDifficulty = ProblemDifficulty.DIFFICULT;
        reason = 'Maintained peak Difficult level with verified mastery.';
      }
    } else {
      // Incorrect answer
      if (currentDifficulty === ProblemDifficulty.DIFFICULT) {
        // Step down from difficult to medium on failure
        nextDifficulty = ProblemDifficulty.MEDIUM;
        reason = 'Adjusted to Medium difficulty to consolidate algorithmic patterns after an unsuccessful challenge.';
        consecutiveIncorrect = 0;
      } else if (currentDifficulty === ProblemDifficulty.MEDIUM) {
        // Require 2 consecutive failures at medium before dropping to easy (anti-oscillation damping)
        if (consecutiveIncorrect >= 2) {
          nextDifficulty = ProblemDifficulty.EASY;
          reason = 'Shifted to Easy difficulty after 2 consecutive errors to reinforce foundational concepts.';
          consecutiveIncorrect = 0;
        } else {
          reason = 'Incorrect on Medium question. Maintaining Medium difficulty to assess consistency.';
        }
      } else if (currentDifficulty === ProblemDifficulty.EASY) {
        nextDifficulty = ProblemDifficulty.EASY;
        reason = 'Maintaining Easy foundational level to reinforce core prerequisites.';
      }
    }

    return {
      nextDifficulty,
      reason,
      consecutiveCorrect,
      consecutiveIncorrect,
    };
  }
}
