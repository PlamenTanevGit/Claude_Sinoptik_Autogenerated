import { test, expect } from '@playwright/test';
import { handleConsent } from './utils/consent-handler.js';

// Global variables
const BULGARIA_LOCATIONS_URL = 'https://www.sinoptik.bg/locations/europe/bulgaria';

test.describe('Sinoptik Bulgaria Locations Tests', () => {
  
  test('Verify Bulgaria locations page elements', async ({ page }) => {
    // Navigate to the Bulgaria locations page
    await test.step('Navigate to Bulgaria locations page', async () => {
      await page.goto(BULGARIA_LOCATIONS_URL);
      
      // Verify the page loaded correctly
      await expect(page).toHaveTitle(/Населени места в България, Европа - Sinoptik.bg/);

      // Handle consent popup
      await handleConsent(page);
    });

    // Validate selected region is visible
    await test.step('Verify selected region section', async () => {
      await expect(page.locator("//div[@class='selectedRegion']")).toBeVisible();
    });

    // Validate resorts section
    await test.step('Verify resorts section', async () => {
      await expect(page.locator("//div[@class='vestiNews']//a[contains(text(),'Курорти')]")).toBeVisible();
    });

    // Validate specific resort names
    await test.step('Verify specific resort names', async () => {
      // Check Varna resort
      await expect(page.locator("//span[@class='resortName'][contains(text(),'Варна')]")).toBeVisible();
      
      // Check Burgas resort
      await expect(page.locator("//span[@class='resortName'][contains(text(),'Бургас')]")).toBeVisible();
      
      // Check Golden Sands resort
      await expect(page.locator("//span[contains(text(),'Златни пясъци')]")).toBeVisible();
      
      console.log('All required resort names verified successfully');
    });

    // Optional: Take a screenshot for verification
    await test.step('Take screenshot of Bulgaria locations page', async () => {
      await page.screenshot({ 
        path: 'bulgaria-locations.png',
        fullPage: true 
      });
    });
  });
});

// Helper function for additional test utilities
test.beforeEach(async ({ page }) => {
  // Set longer timeout for weather sites (they can be slow)
  page.setDefaultTimeout(30000);
});