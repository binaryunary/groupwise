import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for visually driving GroupWise on a simulated iPhone.
 *
 * Mobile is the primary use case, so the default project emulates an iPhone on
 * the WebKit (Safari) engine — the closest match to real iOS Safari. The dev
 * server is started automatically.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  outputDir: 'test-results',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Stable, deterministic screenshots.
    reducedMotion: 'reduce',
    colorScheme: 'light',
  },

  projects: [
    {
      name: 'iphone-webkit',
      use: { ...devices['iPhone 15'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
