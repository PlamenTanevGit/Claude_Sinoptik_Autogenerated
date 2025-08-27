import { test, expect } from '@playwright/test';
import { handleConsent } from './utils/consent-handler.js';

// Global variables
const EUROPE_LOCATIONS_URL = 'https://www.sinoptik.bg/locations/europe';

test.describe('Sinoptik Europe Locations Tests', () => {
  
  test('Verify Europe locations page elements and country sections', async ({ page }) => {
    const Europe = page.locator("a[href='https://www.sinoptik.bg/locations/europe']");
    
    const Germany = page.locator("//a[contains(@href, 'germany')]");
    const France = page.locator("//a[contains(@href, 'france')]");
    const GreatBritain = page.locator("//a[contains(@href, 'great-britain')]");

    // Navigate to the Europe locations page
    await test.step('Navigate to Europe locations page', async () => {
      await page.goto(EUROPE_LOCATIONS_URL);
      
      // Verify the page loaded correctly
      await expect(page).toHaveTitle("Страни в Европа - Sinoptik.bg");

      // Handle consent popup
      await handleConsent(page);
    });

    // Validate selected region is visible
    await test.step('Verify selected region section', async () => {
      await expect(Europe).toBeVisible();
    });

    // Validate Western Europe section and countries
    await test.step('Verify Western Europe section', async () => {
      
      // Check specific Western European countries
      await expect(France).toBeVisible();
      await expect(Germany).toBeVisible();
      await expect(GreatBritain).toBeVisible();

      console.log('Western Europe countries verified successfully');
    });

    // Optional: Take a screenshot for verification
    await test.step('Take screenshot of Europe locations page', async () => {
      await page.screenshot({ 
        path: 'europe-locations.png',
        fullPage: true 
      });
    });
  });

  test('Verify Southern Europe section and Mediterranean countries', async ({ page }) => {
    // Navigate to the Europe locations page
    await page.goto(EUROPE_LOCATIONS_URL);
    
    // Handle consent popup
    await handleConsent(page);

    // Locators for Italy / Spain / Greece
    const italyLocator = page.locator("//a[contains(@href, 'italy')]");
    const spainLocator = page.locator("//a[contains(@href, 'spain')]");
    const greeceLocator = page.locator("//a[contains(@href, 'greece')]");
    const italyMostPopularLocator = page.locator("(//li[contains(text(),'Най-търсени в Италия:')])[1]");

    // Validate Southern Europe section and countries
    await test.step('Verify Southern Europe section', async () => {
      // Check specific Southern European countries
      await expect(italyLocator).toBeVisible();
      await expect(spainLocator).toBeVisible();
      await expect(greeceLocator).toBeVisible();

      console.log('Southern Europe countries verified successfully');
    });

    // Test clicking on a specific country link
    await test.step('Test navigation to specific country', async () => {
      await expect(italyLocator).toBeVisible();
      await italyLocator.click();
      
      // Verify navigation to Italy locations page
      await expect(page.url()).toContain('/italy');
      await expect(italyMostPopularLocator).toBeVisible();
    });
  });

  test('Verify Central Europe section and country navigation', async ({ page }) => {
    // Navigate to the Europe locations page
    await page.goto(EUROPE_LOCATIONS_URL);
    
    // Handle consent popup
    await handleConsent(page);

    // Validate Central Europe section and countries
    await test.step('Verify Central Europe section', async () => {
      
      // Check specific Central European countries
      await expect(page.locator("//a[contains(@href, 'austria')]")).toBeVisible();
      await expect(page.locator("//a[contains(@href, 'switzerland')]")).toBeVisible();
      await expect(page.locator("//a[contains(@href, 'czech-republic')]")).toBeVisible();
      
      console.log('Central Europe countries verified successfully');
    });

    // Test responsive design on mobile
    await test.step('Verify mobile responsive design', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      // Handle consent popup again after reload
      await handleConsent(page);
      
      // Verify content is still accessible on mobile
      await expect(page.locator("//h3[contains(text(),'Западна Европа')]")).toBeVisible();
      await expect(page.locator("//a[contains(text(),'България')]")).toBeVisible();
      
      // Reset to desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    // Optional: Take a screenshot for verification
    await test.step('Take screenshot of Central Europe section', async () => {
      await page.screenshot({ 
        path: 'central-europe-section.png',
        fullPage: true 
      });
    });
  });
});

// Helper function for additional test utilities
test.beforeEach(async ({ page }) => {
  // Set longer timeout for weather sites (they can be slow)
  page.setDefaultTimeout(30000);

  // Set user agent to avoid bot detection
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
});

test.afterEach(async ({ page }, testInfo) => {
  // Take screenshot on failure
  if (testInfo.status !== 'passed') {
    await page.screenshot({
      path: `test-failure-${testInfo.title.replace(/\s+/g, '-')}.png`,
      fullPage: true
    });
  }
});
