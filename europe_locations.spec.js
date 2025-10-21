import { test, expect } from '@playwright/test';
import { handleConsent } from './utils/consent-handler.js';

// Global variables
const EUROPE_LOCATIONS_URL = 'https://www.sinoptik.bg/locations/europe';

test.describe('Sinoptik Europe Locations Tests', () => {
  
  test('should load Europe locations page with correct title', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    await expect(page).toHaveTitle("Страни в Европа - Sinoptik.bg");
  });

  test('should display Europe region link as visible', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const Europe = page.locator("a[href='https://www.sinoptik.bg/locations/europe']");
    await expect(Europe).toBeVisible();
  });

  test('should display France link in Western Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const France = page.locator("//a[contains(@href, 'france')]");
    await expect(France).toBeVisible();
  });

  test('should display Germany link in Western Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const Germany = page.locator("//a[contains(@href, 'germany')]");
    await expect(Germany).toBeVisible();
  });

  test('should display Great Britain link in Western Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const GreatBritain = page.locator("//a[contains(@href, 'great-britain')]");
    await expect(GreatBritain).toBeVisible();
  });

  test('should display Italy link in Southern Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const italyLocator = page.locator("//a[contains(@href, 'italy')]");
    await expect(italyLocator).toBeVisible();
  });

  test('should display Spain link in Southern Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const spainLocator = page.locator("//a[contains(@href, 'spain')]");
    await expect(spainLocator).toBeVisible();
  });

  test('should display Greece link in Southern Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const greeceLocator = page.locator("//a[contains(@href, 'greece')]");
    await expect(greeceLocator).toBeVisible();
  });

  test('should navigate to Italy page when Italy link is clicked', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const italyLocator = page.locator("//a[contains(@href, 'italy')]");
    await italyLocator.click();
    
    await expect(page.url()).toContain('/italy');
  });

  test('should display Italy most popular section after navigating to Italy', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    const italyLocator = page.locator("//a[contains(@href, 'italy')]");
    await italyLocator.click();
    
    const italyMostPopularLocator = page.locator("(//li[contains(text(),'Най-търсени в Италия:')])[1]");
    await expect(italyMostPopularLocator).toBeVisible();
  });

  test('should display Austria link in Central Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    await expect(page.locator("//a[contains(@href, 'austria')]")).toBeVisible();
  });

  test('should display Switzerland link in Central Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    await expect(page.locator("//a[contains(@href, 'switzerland')]")).toBeVisible();
  });

  test('should display Czech Republic link in Central Europe section', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    await expect(page.locator("//a[contains(@href, 'czech-republic')]")).toBeVisible();
  });

  test('should display Bulgaria link on mobile viewport', async ({ page }) => {
    await page.goto(EUROPE_LOCATIONS_URL);
    await handleConsent(page);
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await handleConsent(page);
    
    await expect(page.locator("//a[@href='https://www.sinoptik.bg/locations/europe/bulgaria'][contains(text(),'България')]")).toBeVisible();
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
