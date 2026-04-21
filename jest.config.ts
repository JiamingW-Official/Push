/**
 * Jest configuration for Push v5.2 backend unit tests.
 *
 * Uses next/jest so the @/* path alias from tsconfig and the project's SWC
 * transform are picked up automatically — no separate ts-jest setup needed.
 *
 * To install the test toolchain:
 *   npm i -D jest @types/jest jest-environment-node
 *
 * Then add to package.json scripts:
 *   "test": "jest"
 *
 * Run:
 *   npm test                                # all tests
 *   npm test -- AIVerificationService       # filter by name
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: [
    "<rootDir>/.claude/worktrees/",
    "<rootDir>/.next/",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/.claude/worktrees/",
    "<rootDir>/.next/",
  ],
  // Backend services are pure compute + DB calls (mocked). No DOM, no React.
  // Keep the env minimal so tests stay fast (< 100ms each, per spec).
  clearMocks: true,
};

export default createJestConfig(config);
