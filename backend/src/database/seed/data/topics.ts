import { LanguageId, TopicDifficulty } from '@codeforge/shared';

export interface SeedTopic {
  languageId: LanguageId;
  slug: string;
  sequence: number;
  title: string;
  description: string;
  difficulty: TopicDifficulty;
  estimatedHours: number;
}

const CORE_TOPICS = [
  { sequence: 1, title: 'Syntax & Literals', diff: TopicDifficulty.BEGINNER, hours: 2, desc: 'Foundational syntax structure, indentation rules, comments, literals, and primary entrypoints.' },
  { sequence: 2, title: 'Data Types & Variables', diff: TopicDifficulty.BEGINNER, hours: 3, desc: 'Primitive types, type systems, variable declarations, type casting, mutability, and scoping rules.' },
  { sequence: 3, title: 'Operators & Expressions', diff: TopicDifficulty.BEGINNER, hours: 2, desc: 'Arithmetic, logical, bitwise, comparison operators, operator precedence, and expression evaluation.' },
  { sequence: 4, title: 'Control Flow', diff: TopicDifficulty.BEGINNER, hours: 4, desc: 'Conditional statements, pattern matching, loops, iteration protocols, and jump statements.' },
  { sequence: 5, title: 'Data Structures', diff: TopicDifficulty.INTERMEDIATE, hours: 5, desc: 'Arrays, lists, dictionaries/maps, sets, tuples, and fundamental time/space complexity tradeoffs.' },
  { sequence: 6, title: 'Functions & Modularization', diff: TopicDifficulty.INTERMEDIATE, hours: 4, desc: 'Function definitions, parameters, closures, recursion, higher-order functions, and module architecture.' },
  { sequence: 7, title: 'Error & Exception Handling', diff: TopicDifficulty.INTERMEDIATE, hours: 3, desc: 'Try-catch mechanisms, custom exception hierarchies, assertions, and defensive programming principles.' },
  { sequence: 8, title: 'Code Packaging & Libraries', diff: TopicDifficulty.INTERMEDIATE, hours: 3, desc: 'Package managers, imports, dependency resolution, virtual environments, and project structuring.' },
  { sequence: 9, title: 'Object-Oriented & Functional Paradigms', diff: TopicDifficulty.ADVANCED, hours: 6, desc: 'Classes, encapsulation, inheritance, polymorphism, interfaces, immutability, and functional pipelines.' },
  { sequence: 10, title: 'Memory & Concurrency', diff: TopicDifficulty.ADVANCED, hours: 6, desc: 'Memory models, stack vs heap, garbage collection, pointers/references, threads, async/await, and race conditions.' },
];

export const SEED_TOPICS: SeedTopic[] = [];

const LANGUAGES: LanguageId[] = [
  LanguageId.PYTHON,
  LanguageId.JAVA,
  LanguageId.C,
  LanguageId.CPP,
  LanguageId.JAVASCRIPT,
  LanguageId.TYPESCRIPT,
];

for (const lang of LANGUAGES) {
  for (const topic of CORE_TOPICS) {
    const slug = `${lang}-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    SEED_TOPICS.push({
      languageId: lang,
      slug,
      sequence: topic.sequence,
      title: `${topic.title}`,
      description: `${lang.toUpperCase()}: ${topic.desc}`,
      difficulty: topic.diff,
      estimatedHours: topic.hours,
    });
  }
}
