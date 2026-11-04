import { defineConfig } from 'vitest/config';

// Unit and data-contract tests (tests/*.test.ts). Browser tests live in tests/e2e and run with Playwright.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
