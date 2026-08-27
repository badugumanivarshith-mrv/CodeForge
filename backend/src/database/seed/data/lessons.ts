import { ContentStatus } from '@codeforge/shared';

export interface SeedLessonSection {
  sequence: number;
  title: string;
  contentMdx: string;
  contentType: 'text' | 'code_sandbox' | 'video_callout' | 'quiz_checkpoint';
}

export interface SeedLearningExample {
  sequence: number;
  title: string;
  codeTemplate: string;
  expectedOutput: string;
  explanationMdx: string;
}

export interface SeedLesson {
  topicSlug: string;
  sequence: number;
  slug: string;
  title: string;
  description: string;
  readTimeMinutes: number;
  status: ContentStatus;
  sections: SeedLessonSection[];
  examples: SeedLearningExample[];
}

export const SEED_LESSONS: SeedLesson[] = [
  // -------------------------------------------------------------
  // PYTHON: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'python-syntax-literals',
    sequence: 1,
    slug: 'python-syntax-fundamentals',
    title: 'Python Syntax & Whitespace Rules',
    description: 'Learn how Python uses indentation to define code blocks, basic literals, and comment conventions.',
    readTimeMinutes: 6,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'The Philosophy of Python Syntax',
        contentType: 'text',
        contentMdx: `### Readability Counts\n\nPython relies on **meaningful whitespace** (indentation) rather than curly braces \`{ }\` or \`begin/end\` keywords to delineate blocks of code.\n\nKey conventions:\n- Standard indentation is **4 spaces** per nesting level.\n- Never mix tabs and spaces in the same file.\n- Comments begin with the hash character \`#\`.`,
      },
      {
        sequence: 2,
        title: 'Variables and Output',
        contentType: 'code_sandbox',
        contentMdx: `### Printing and Formatting\n\nThe \`print()\` function is your primary tool for standard output. In Python 3.6+, **f-strings** provide concise string interpolation.\n\n\`\`\`python\nname = "CodeForge"\ngreeting = f"Welcome to {name}!"\nprint(greeting)\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Basic Hello World with Interpolation',
        codeTemplate: 'name = "CodeForge Explorer"\nprint(f"Hello, {name}!")',
        expectedOutput: 'Hello, CodeForge Explorer!',
        explanationMdx: 'Uses an f-string to insert the variable `name` into the output string.',
      },
    ],
  },
  {
    topicSlug: 'python-syntax-literals',
    sequence: 2,
    slug: 'python-numeric-and-string-literals',
    title: 'Numeric & String Literals in Python',
    description: 'Explore integers, floating-point numbers, multi-line string literals, and escape sequences.',
    readTimeMinutes: 5,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'Numeric Literals and Underscores',
        contentType: 'text',
        contentMdx: `Python supports integer literals of arbitrary precision and IEEE-754 double precision floats.\n\nYou can use underscores as visual digit separators for readability:\n\`\`\`python\none_million = 1_000_000\npi_approx = 3.14159_26535\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Multi-line Triple Quotes',
        codeTemplate: 'doc = """Line 1\nLine 2"""\nprint(doc)',
        expectedOutput: 'Line 1\nLine 2',
        explanationMdx: 'Triple quotes preserve newlines and whitespace formatting.',
      },
    ],
  },

  // -------------------------------------------------------------
  // PYTHON: Topic 2 - Data Types & Variables
  // -------------------------------------------------------------
  {
    topicSlug: 'python-data-types-variables',
    sequence: 1,
    slug: 'python-primitive-types-and-casting',
    title: 'Python Primitive Types and Dynamic Typing',
    description: 'Master int, float, bool, str, NoneType, and type conversion mechanics.',
    readTimeMinutes: 7,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'Dynamic vs Strong Typing',
        contentType: 'text',
        contentMdx: `Python is **dynamically typed** (types are checked at runtime) yet **strongly typed** (implicit type coercion is disallowed for incompatible operations like \`"5" + 2\`).\n\nUse type annotations for static analysis:\n\`\`\`python\nage: int = 25\nis_learner: bool = True\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Explicit Type Casting',
        codeTemplate: 'str_val = "42"\nnum_val = int(str_val)\nprint(num_val * 2)',
        expectedOutput: '84',
        explanationMdx: 'Converts string representation of a number to an integer and multiplies it.',
      },
    ],
  },

  // -------------------------------------------------------------
  // JAVASCRIPT: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'javascript-syntax-literals',
    sequence: 1,
    slug: 'javascript-syntax-and-declarations',
    title: 'JavaScript Syntax, Scoping & Declarations',
    description: 'Understand modern ECMAScript declarations (let, const), block scopes, and template literals.',
    readTimeMinutes: 6,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'const vs let vs var',
        contentType: 'text',
        contentMdx: `### Modern Scoping Rules\n\n- **\`const\`**: Block-scoped immutable binding. Use this by default.\n- **\`let\`**: Block-scoped reassignable variable.\n- **\`var\`**: Function-scoped or global (legacy, avoid in modern code).`,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Template Literals',
        codeTemplate: 'const platform = "CodeForge";\nconsole.log(`Welcome to ${platform}!`);',
        expectedOutput: 'Welcome to CodeForge!',
        explanationMdx: 'Template strings use backticks for variable substitution.',
      },
    ],
  },

  // -------------------------------------------------------------
  // TYPESCRIPT: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'typescript-syntax-literals',
    sequence: 1,
    slug: 'typescript-foundations',
    title: 'TypeScript Type Annotations & Compilation',
    description: 'Static type checking, primitive annotations, interfaces, and compile-time guarantees.',
    readTimeMinutes: 7,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'Static Typing on JavaScript',
        contentType: 'text',
        contentMdx: `TypeScript adds a compile-time static type system on top of standard JavaScript syntax.\n\n\`\`\`typescript\ninterface Learner {\n  id: string;\n  xp: number;\n  isActive: boolean;\n}\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Typed Function Signature',
        codeTemplate: 'function calculateLevel(xp: number): number {\n  return Math.floor(Math.sqrt(xp / 100)) + 1;\n}\nconsole.log(calculateLevel(400));',
        expectedOutput: '3',
        explanationMdx: 'Computes level mathematically with strict parameter and return types.',
      },
    ],
  },

  // -------------------------------------------------------------
  // C: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'c-syntax-literals',
    sequence: 1,
    slug: 'c-program-structure-and-main',
    title: 'C Program Structure & The main() Entrypoint',
    description: 'Preprocessors (#include), headers, standard library functions, and return codes.',
    readTimeMinutes: 6,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'Anatomy of a C Program',
        contentType: 'text',
        contentMdx: `Every C program begins execution in the \`main\` function.\n\n\`\`\`c\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CodeForge!\\n");\n    return 0;\n}\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Formatted Output with printf',
        codeTemplate: '#include <stdio.h>\n\nint main(void) {\n    int xp = 50;\n    printf("XP: %d\\n", xp);\n    return 0;\n}',
        expectedOutput: 'XP: 50',
        explanationMdx: 'Uses `%d` format specifier to print a decimal integer.',
      },
    ],
  },

  // -------------------------------------------------------------
  // C++: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'cpp-syntax-literals',
    sequence: 1,
    slug: 'cpp-streams-and-namespaces',
    title: 'C++ Streams, Namespaces and auto Keyword',
    description: 'Learn std::cout, iostream stream extraction, namespaces, and auto type deduction.',
    readTimeMinutes: 6,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'C++ I/O Streams',
        contentType: 'text',
        contentMdx: `C++ utilizes \`<iostream>\` stream operators \`<<\` and \`>>\` for type-safe input and output.\n\n\`\`\`cpp\n#include <iostream>\n\nint main() {\n    std::cout << "CodeForge C++ Arena" << std::endl;\n    return 0;\n}\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'Stream Insertion Operator',
        codeTemplate: '#include <iostream>\n\nint main() {\n    int streak = 7;\n    std::cout << "Streak: " << streak << " days" << std::endl;\n    return 0;\n}',
        expectedOutput: 'Streak: 7 days',
        explanationMdx: 'Chains stream insertion operators to output text and numbers.',
      },
    ],
  },

  // -------------------------------------------------------------
  // JAVA: Topic 1 - Syntax & Literals
  // -------------------------------------------------------------
  {
    topicSlug: 'java-syntax-literals',
    sequence: 1,
    slug: 'java-class-structure-and-entrypoint',
    title: 'Java Class Structure & public static void main',
    description: 'Explore the class-centric architecture of Java, compilation bytecode, and System.out.println.',
    readTimeMinutes: 6,
    status: ContentStatus.PUBLISHED,
    sections: [
      {
        sequence: 1,
        title: 'The Blueprint of Java',
        contentType: 'text',
        contentMdx: `In Java, all executable code lives inside a class definition.\n\n\`\`\`java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to Java on CodeForge!");\n    }\n}\n\`\`\``,
      },
    ],
    examples: [
      {
        sequence: 1,
        title: 'System Output',
        codeTemplate: 'public class Main {\n    public static void main(String[] args) {\n        int points = 100;\n        System.out.println("Points: " + points);\n    }\n}',
        expectedOutput: 'Points: 100',
        explanationMdx: 'Outputs string concatenation to standard output.',
      },
    ],
  },
];
