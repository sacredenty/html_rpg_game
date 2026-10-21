// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list']
  ],
  /* Shared settings for all the projects below. See
   * https://playwright.dev/docs/api/class-testoptions.
   */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: pathToFileURL(`${__dirname}${path.sep}`).href,

    /* Collect trace when retrying with --force-show */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test in Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Uncomment to test in WebKit (Safari)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msft' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* No web server needed - using file:// protocol directly */

  /* Folder for test artifacts such as screenshots, videos, traces, and traces */
  outputDir: 'test-results/',

  /* Maximum time one test can run for. */
  timeout: 60 * 1000, // 60 seconds

  expect: {
    /**
     * Maximum time expect() should wait for the condition to become true.
     */
    timeout: 15000, // 15 seconds
  },
});
