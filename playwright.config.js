// playwright.config.js

// Playwright configuration file for testing Sinoptik weather website
// Setup 2 - using CI/CD

// playwright.config.js - Optimized for CI/CD
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only (weather sites can be flaky)
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,
  
  // Multiple reporters for CI
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['github'], // GitHub Actions annotations
    ['list'] // Console output
  ] : [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot settings optimized for CI
    screenshot: 'only-on-failure',
    
    // Video settings for CI
    video: process.env.CI ? 'retain-on-failure' : 'off',
    
    // Global timeout for each action (weather sites can be slow)
    actionTimeout: 30000,
    
    // Global timeout for navigation
    navigationTimeout: 30000,
    
    // User agent to avoid bot detection
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'bg-BG,bg;q=0.9,en;q=0.8'
    },
    
    // Viewport for consistent testing
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (if needed for weather sites)
    ignoreHTTPSErrors: true,
  },

  // Global test timeout
  timeout: process.env.CI ? 60000 : 30000,

  // Expect timeout
  expect: {
    timeout: 10000
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific settings for weather site testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox',
            '--disable-dev-shm-usage'
          ]
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific settings
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
          }
        }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    // Mobile testing for responsive weather site
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific timeout adjustments
        actionTimeout: 45000,
      },
    },

    // API testing project (if you add API tests later)
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.js',
      use: {
        // API testing doesn't need browser
        browserName: undefined,
      }
    }
  ],

  // Output directories
  outputDir: 'test-results/',
  
  // Global setup/teardown (if needed)
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),

  // Test match patterns
  testMatch: [
    '**/*.spec.js',
    '**/*.test.js'
  ],

  // Test ignore patterns
  testIgnore: [
    '**/node_modules/**',
    '**/build/**',
    '**/dist/**'
  ],

  // Web server for local development (if you add local server later)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});





// // Playwright configuration file for testing Sinoptik weather website
// // Setup 1
// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   // Test directory
//   testDir: './tests',
  
//   // Run tests in files in parallel
//   fullyParallel: true,
  
//   // Fail the build on CI if you accidentally left test.only in the source code
//   forbidOnly: !!process.env.CI,
  
//   // Retry on CI only
//   retries: process.env.CI ? 2 : 0,
  
//   // Opt out of parallel tests on CI
//   workers: process.env.CI ? 1 : undefined,
  
//   // Reporter to use
//   reporter: 'html',
  
//   // Shared settings for all the projects below
//   use: {
//     // Base URL to use in actions like `await page.goto('/')`
//     // baseURL: 'http://127.0.0.1:3000',
    
//     // Collect trace when retrying the failed test
//     trace: 'on-first-retry',
    
//     // Screenshot on failure
//     screenshot: 'only-on-failure',
    
//     // Video on failure
//     video: 'retain-on-failure',
    
//     // Global timeout for each action
//     actionTimeout: 30000,
    
//     // Global timeout for navigation
//     navigationTimeout: 30000,
//   },

//   // Configure projects for major browsers
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     // },

//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },

//     // // Test against mobile viewports
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     // Test against branded browsers
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   // Run your local dev server before starting the tests
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://127.0.0.1:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });

