// @ts-check
const { defineConfig, devices } = require('@playwright/test');


module.exports = defineConfig({
testDir: 'tests',
timeout: 30 * 1000,
expect: { timeout: 10 * 1000 },


// CI hardening
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 2 : undefined,


reporter: [
['list'],
['html', { open: 'never' }],
['junit', { outputFile: 'results.xml' }]
],


use: {
headless: true,
screenshot: 'only-on-failure',
video: 'retain-on-failure',
trace: 'retain-on-failure',
// If the target site blocks headless, uncomment a UA:
// userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
},


projects: [
{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
// Add these later when green:
// { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
// { name: 'webkit', use: { ...devices['Desktop Safari'] } }
]
});