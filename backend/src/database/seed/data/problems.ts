import { ProblemDifficulty } from '@codeforge/shared';

export interface SeedProblemExample {
  sequence: number;
  inputData: string;
  expectedOutput: string;
  explanationMdx: string;
}

export interface SeedProblemConstraint {
  sequence: number;
  constraintText: string;
}

export interface SeedTestCase {
  sequence: number;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
  isSample: boolean;
  isEdgeCase: boolean;
  weight: number;
}

export interface SeedProblem {
  topicSlug: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  promptMdx: string;
  starterCode: Record<string, string>;
  boilerplateCode: Record<string, string>;
  solutionCode?: Record<string, string>;
  memoryLimitMb: number;
  timeLimitMs: number;
  isPublished: boolean;
  examples: SeedProblemExample[];
  constraints: SeedProblemConstraint[];
  testCases: SeedTestCase[];
}

export const SEED_PROBLEMS: SeedProblem[] = [
  // -------------------------------------------------------------
  // PROBLEM 1: Two Sum Target Indices (Easy)
  // -------------------------------------------------------------
  {
    topicSlug: 'python-syntax-literals',
    slug: 'two-sum-target',
    title: 'Two Sum Target Indices',
    difficulty: ProblemDifficulty.EASY,
    promptMdx: `### Problem Statement\n\nGiven an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order (e.g. sorted \`[i, j]\`).`,
    starterCode: {
      python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass\n`,
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n}\n`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Write your solution here\n  return [];\n}\n`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[0];\n    }\n}\n`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    *returnSize = 2;\n    return 0;\n}\n`,
    },
    boilerplateCode: {
      python: `import json\nimport sys\n\ndef main():\n    lines = sys.stdin.read().strip().split('\\n')\n    if not lines or not lines[0]: return\n    nums = json.loads(lines[0])\n    target = int(lines[1])\n    res = two_sum(nums, target)\n    print(json.dumps(res))\n\nif __name__ == '__main__':\n    main()\n`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\nif (input[0]) {\n  const nums = JSON.parse(input[0]);\n  const target = parseInt(input[1], 10);\n  console.log(JSON.stringify(twoSum(nums, target)));\n}\n`,
      typescript: `import * as fs from 'fs';\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\nif (input[0]) {\n  const nums: number[] = JSON.parse(input[0]);\n  const target: number = parseInt(input[1], 10);\n  console.log(JSON.stringify(twoSum(nums, target)));\n}\n`,
    },
    memoryLimitMb: 256,
    timeLimitMs: 2000,
    isPublished: true,
    examples: [
      {
        sequence: 1,
        inputData: '[2, 7, 11, 15]\n9',
        expectedOutput: '[0, 1]',
        explanationMdx: 'Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.',
      },
      {
        sequence: 2,
        inputData: '[3, 2, 4]\n6',
        expectedOutput: '[1, 2]',
        explanationMdx: 'Because `nums[1] + nums[2] == 6`, we return `[1, 2]`.',
      },
    ],
    constraints: [
      { sequence: 1, constraintText: '2 <= nums.length <= 10^4' },
      { sequence: 2, constraintText: '-10^9 <= nums[i] <= 10^9' },
      { sequence: 3, constraintText: '-10^9 <= target <= 10^9' },
      { sequence: 4, constraintText: 'Only one valid answer exists.' },
    ],
    testCases: [
      { sequence: 1, inputData: '[2, 7, 11, 15]\n9', expectedOutput: '[0, 1]', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 2, inputData: '[3, 2, 4]\n6', expectedOutput: '[1, 2]', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 3, inputData: '[3, 3]\n6', expectedOutput: '[0, 1]', isHidden: false, isSample: false, isEdgeCase: true, weight: 1 },
      // Hidden test cases (never returned to standard client problem fetch)
      { sequence: 4, inputData: '[-1, -2, -3, -4, -5]\n-8', expectedOutput: '[2, 4]', isHidden: true, isSample: false, isEdgeCase: true, weight: 2 },
      { sequence: 5, inputData: '[0, 4, 3, 0]\n0', expectedOutput: '[0, 3]', isHidden: true, isSample: false, isEdgeCase: true, weight: 2 },
    ],
  },

  // -------------------------------------------------------------
  // PROBLEM 2: Valid Palindrome String (Easy)
  // -------------------------------------------------------------
  {
    topicSlug: 'python-syntax-literals',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome String',
    difficulty: ProblemDifficulty.EASY,
    promptMdx: `### Problem Statement\n\nA phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    starterCode: {
      python: `def is_palindrome(s: str) -> bool:\n    # Write your solution here\n    pass\n`,
      javascript: `function isPalindrome(s) {\n  // Write your solution here\n}\n`,
      typescript: `function isPalindrome(s: string): boolean {\n  // Write your solution here\n  return false;\n}\n`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}\n`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    bool isPalindrome(std::string s) {\n        return false;\n    }\n};\n`,
      c: `bool isPalindrome(char* s) {\n    return false;\n}\n`,
    },
    boilerplateCode: {},
    memoryLimitMb: 256,
    timeLimitMs: 2000,
    isPublished: true,
    examples: [
      {
        sequence: 1,
        inputData: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        explanationMdx: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        sequence: 2,
        inputData: '"race a car"',
        expectedOutput: 'false',
        explanationMdx: '"raceacar" is not a palindrome.',
      },
    ],
    constraints: [
      { sequence: 1, constraintText: '1 <= s.length <= 2 * 10^5' },
      { sequence: 2, constraintText: '`s` consists only of printable ASCII characters.' },
    ],
    testCases: [
      { sequence: 1, inputData: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 2, inputData: '"race a car"', expectedOutput: 'false', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 3, inputData: '" "', expectedOutput: 'true', isHidden: false, isSample: false, isEdgeCase: true, weight: 1 },
      { sequence: 4, inputData: '"0P"', expectedOutput: 'false', isHidden: true, isSample: false, isEdgeCase: true, weight: 2 },
    ],
  },

  // -------------------------------------------------------------
  // PROBLEM 3: Longest Substring Without Repeating Characters (Medium)
  // -------------------------------------------------------------
  {
    topicSlug: 'python-data-types-variables',
    slug: 'longest-substring-without-repeats',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: ProblemDifficulty.MEDIUM,
    promptMdx: `### Problem Statement\n\nGiven a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:\n    # Write your sliding window solution here\n    pass\n`,
      javascript: `function lengthOfLongestSubstring(s) {\n  // Write your sliding window solution here\n}\n`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // Write your sliding window solution here\n  return 0;\n}\n`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}\n`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        return 0;\n    }\n};\n`,
      c: `int lengthOfLongestSubstring(char* s) {\n    return 0;\n}\n`,
    },
    boilerplateCode: {},
    memoryLimitMb: 256,
    timeLimitMs: 2000,
    isPublished: true,
    examples: [
      {
        sequence: 1,
        inputData: '"abcabcbb"',
        expectedOutput: '3',
        explanationMdx: 'The answer is "abc", with the length of 3.',
      },
      {
        sequence: 2,
        inputData: '"bbbbb"',
        expectedOutput: '1',
        explanationMdx: 'The answer is "b", with the length of 1.',
      },
    ],
    constraints: [
      { sequence: 1, constraintText: '0 <= s.length <= 5 * 10^4' },
      { sequence: 2, constraintText: '`s` consists of English letters, digits, symbols and spaces.' },
    ],
    testCases: [
      { sequence: 1, inputData: '"abcabcbb"', expectedOutput: '3', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 2, inputData: '"bbbbb"', expectedOutput: '1', isHidden: false, isSample: true, isEdgeCase: false, weight: 1 },
      { sequence: 3, inputData: '"pwwkew"', expectedOutput: '3', isHidden: false, isSample: false, isEdgeCase: false, weight: 1 },
      { sequence: 4, inputData: '""', expectedOutput: '0', isHidden: true, isSample: false, isEdgeCase: true, weight: 2 },
    ],
  },
];
