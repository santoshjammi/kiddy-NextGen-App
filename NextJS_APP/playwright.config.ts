import { defineConfig, devices } from '@playwright/test';

/**
 * Kiddy Playwright config.
 *
 * Tests run against the local Next.js dev server (npm run dev).
 * Start the emulator separately before running billing/auth tests:
 *   firebase emulators:start --only auth,firestore
 *
 * Run all tests:      npx playwright test
 * Run one module:     npx playwright test tests/auth.spec.ts
 * Show HTML report:   npx playwright show-report
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // keep false — tests share auth/Firestore state
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  // Start dev server automatically when running locally (not in CI)
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 30_000,
      },
});
