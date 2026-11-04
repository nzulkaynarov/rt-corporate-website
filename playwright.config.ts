import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests of the BUILT site (run `npm run build` first; `make e2e` does both).
 * Locally a preinstalled Chromium can be used: PW_CHROMIUM_PATH=/path/to/chromium npx playwright test
 * In CI: `npx playwright install --with-deps chromium`.
 */
const PORT = 4329;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/rt-corporate-website/`,
    launchOptions: { executablePath },
  },
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/rt-corporate-website/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
});
