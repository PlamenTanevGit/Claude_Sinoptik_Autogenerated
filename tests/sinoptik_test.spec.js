import { test, expect } from '@playwright/test';

test.describe('Sinoptik Weather Forecast Tests', () => {
  
  test('Navigate to Sinoptik.bg, search for Varna Bulgaria, and view 14-day forecast', async ({ page }) => {
    // Navigate to the Sinoptik.bg website
    await test.step('Navigate to Sinoptik.bg', async () => {
      await page.goto('https://www.sinoptik.bg/locations/europe/bulgaria');
      
      // Verify the page loaded correctly
      await expect(page).toHaveTitle(/Населени места в България, Европа - Sinoptik.bg/);

      // Consent
      console.log('Waiting for consent button...');
      await page.waitForSelector("button[aria-label='Давам съгласие']");
      console.log('Clicking consent button...');
      await page.locator("button[aria-label='Давам съгласие']").click();

      // Ensure the search field is visible
      await expect(page.locator("#searchField")).toBeVisible();
    });

    // Search for Varna, Bulgaria
    await test.step('Search for Varna, Bulgaria', async () => {
      // Check if we're already on Varna page (auto-redirect)
      const currentUrl = page.url();
      
      if (!currentUrl.includes('varna')) {
        // If not on Varna page, use the search functionality
        const searchBox = page.locator("#searchField");
        
        if (await searchBox.isVisible({ timeout: 3000 })) {
          await searchBox.fill('Varna, Bulgaria');
          await searchBox.press('Enter');
          
          // Wait for search results or redirect
          // await page.waitForLoadState('networkidle');
        }
      }
      
      // Verify we're on a Varna weather page
      // await expect(page.locator('text=Варна')).toBeVisible();
      // await expect(page.url()).toContain('varna');
    });

    // Click on 14-day forecast tab
    await test.step('Select 14-day forecast', async () => {
      // Look for the 14-day forecast link
      const fourteenDayLink = page.locator('a:has-text("14-дневна"), link:has-text("14-дневна")');
      
      await expect(fourteenDayLink).toBeVisible();
      await fourteenDayLink.click();
      
      // Wait for the 14-day forecast page to load
      // await page.waitForLoadState('networkidle');
      
      // Verify we're on the 14-day forecast page
      await expect(page.url()).toContain('14-days');
    });

    // Verify 14-day forecast content is displayed
    await test.step('Verify 14-day forecast content', async () => {
      // Check that weather forecast data is displayed
      await expect(page.locator("text=Минимална:")).toBeVisible();
      await expect(page.locator('text=Максимална:')).toBeVisible();
      await expect(page.locator('text=Минимална:')).toBeVisible();
      
      // Verify temperature data is present
      const temperatureElements = page.locator('text=/\\d+°/');
      await expect(temperatureElements.first()).toBeVisible();
      
      // // Verify date information is present
      // const dateElements = page.locator('text=/\\d{1,2} август|\\d{1,2} септември/');
      // await expect(dateElements.first()).toBeVisible();
      
      // // Verify weather icons/conditions are present
      // const weatherConditions = page.locator('img[alt*="лънчево"], img[alt*="блачно"], img[alt*="дъжд"]');
      // await expect(weatherConditions.first()).toBeVisible();  
      
      console.log('14-day weather forecast verified successfully');
    });

    // Optional: Take a screenshot for verification
    // await test.step('Take screenshot of 14-day forecast', async () => {
    //   await page.screenshot({ 
    //     path: 'varna-14-day-forecast.png',
    //     fullPage: true 
    //   });
    // });
  });

  test('Verify forecast navigation tabs work correctly', async ({ page }) => {
    // Navigate directly to Varna weather page
    await page.goto('https://www.sinoptik.bg/varna-bulgaria-100726050');

   // Consent
      console.log('Waiting for consent button...');
      await page.waitForSelector("button[aria-label='Давам съгласие']");
      console.log('Clicking consent button...');
      await page.locator("button[aria-label='Давам съгласие']").click();
    
    // Test different forecast period tabs
    const forecastTabs = [
      { text: 'В момента', urlPattern: '/varna-bulgaria-100726050$' },
      { text: 'По часове', urlPattern: '/hourly' },
      { text: 'Уикенд', urlPattern: '/weekend' },
      { text: '5-дневна', urlPattern: '/5-days' },
      { text: '14-дневна', urlPattern: '/14-days' }
    ];

    for (const tab of forecastTabs) {
      await test.step(`Test ${tab.text} tab`, async () => {
        // const tabLink = page.locator(`a:has-text("${tab.text}")`);   //npx playwright test --ui
        const tabLink = page.locator(`//a[contains(text(),"${tab.text}")]`);
        await expect(tabLink).toBeVisible();
        await tabLink.click();
        
        // Wait for navigation
        // await page.waitForLoadState('networkidle');
        
        // Verify URL pattern
        await expect(page.url()).toMatch(new RegExp(tab.urlPattern));
        
        // Verify content loaded
        await expect(page.locator("//h1[contains(text(),'Варна')]")).toBeVisible();
      });
    }
  });

  test('Verify weather data structure on 14-day forecast', async ({ page }) => {
    // Navigate directly to 14-day forecast
    await page.goto('https://www.sinoptik.bg/varna-bulgaria-100726050/14-days');

    // Consent
      console.log('Waiting for consent button...');
      await page.waitForSelector("button[aria-label='Давам съгласие']");
      console.log('Clicking consent button...');
      await page.locator("button[aria-label='Давам съгласие']").click();
    
    await test.step('Verify forecast table structure', async () => {
      // Check table headers
      const expectedHeaders = [
        'Прогноза:',
        'Максимална:',
        'Минимална:', 
        'Вятър:',
        'Вероятност за валежи:',
        'Количество валежи:',
        'Вероятност за буря:',
        'Облачност:',
        'UV индекс:'
      ];

      for (const header of expectedHeaders) {
        await expect(page.locator(`text=${header}`)).toBeVisible();
      }
    });

    await test.step('Verify daily forecast entries', async () => {
      // Check that we have multiple days shown (at least 7 days)
      const dayElements = page.locator('text=/Вт\\.|Ср\\.|Чт\\.|Пт\\.|Сб\\.|Нд\\.|Пн\\./');
      const dayCount = await dayElements.count();
      
      expect(dayCount).toBeGreaterThanOrEqual(7);
      console.log(`Found ${dayCount} forecast days`);
      
      // Verify each day has temperature data
      const maxTempElements = page.locator('text=/\\d{1,2}°/');
      const tempCount = await maxTempElements.count();
      
      expect(tempCount).toBeGreaterThan(0);
      console.log(`Found ${tempCount} temperature readings`);
    });

    await test.step('Verify responsive design elements', async () => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      // Verify content is still accessible on mobile
      await expect(page.locator("//h1[contains(text(),'Варна')]")).toBeVisible();
      await expect(page.locator("//a[contains(text(),'14-дневна')]")).toBeVisible();
      
      // Reset to desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
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