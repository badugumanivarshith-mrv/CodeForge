import { LanguageId } from '../enums/index.js';

export const XP_VALUES = {
  LESSON_COMPLETE: 20,
  QUIZ_PASS: 50,
  QUIZ_PERFECT_BONUS: 25,
  PROBLEM_EASY: 50,
  PROBLEM_MEDIUM: 100,
  PROBLEM_DIFFICULT: 200,
  ASSIGNMENT_MEDIUM: 300,
  ASSIGNMENT_DIFFICULT: 500,
  DAILY_STREAK_BASE: 10,
  DAILY_STREAK_MAX: 100,
} as const;

export const EXECUTION_LIMITS = {
  DEFAULT_TIME_LIMIT_MS: 2000,
  DEFAULT_MEMORY_LIMIT_MB: 256,
  MAX_EXECUTION_TIME_MS: 5000,
  MAX_OUTPUT_BUFFER_BYTES: 65536, // 64 KB
} as const;

export const TIER_1_LANGUAGES = [
  { id: LanguageId.PYTHON, name: 'Python', monacoId: 'python', extension: 'py' },
  { id: LanguageId.JAVA, name: 'Java', monacoId: 'java', extension: 'java' },
  { id: LanguageId.C, name: 'C', monacoId: 'c', extension: 'c' },
  { id: LanguageId.CPP, name: 'C++', monacoId: 'cpp', extension: 'cpp' },
  { id: LanguageId.JAVASCRIPT, name: 'JavaScript', monacoId: 'javascript', extension: 'js' },
  { id: LanguageId.TYPESCRIPT, name: 'TypeScript', monacoId: 'typescript', extension: 'ts' },
] as const;

export const CORE_TOPIC_NAMES = [
  'Syntax & Literals',
  'Data Types & Variables',
  'Operators & Expressions',
  'Control Flow',
  'Data Structures',
  'Functions & Modularization',
  'Error & Exception Handling',
  'Code Packaging & Libraries',
  'Object-Oriented & Functional Paradigms',
  'Memory & Concurrency',
] as const;
