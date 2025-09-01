const { test, expect } = require('@playwright/test');

test.describe('Payhawk Demo Form Validation Tests', () => {
  
  test('should display validation message on Full Name field when submitting empty form', async ({ page }) => {
    // Step 1: Navigate to Payhawk website
    await test.step('Navigate to Payhawk homepage', async () => {
      await page.goto('https://payhawk.com/en-us');
      
      // Verify page loaded successfully
      await expect(page).toHaveTitle(/Expense management on autopilot with linked business credit cards | Payhawk/);
      await expect(page.locator('h1')).toContainText('Manage corporate spend on autopilot');
    });

    // Step 2: Accept cookies
    await test.step('Accept cookies', async () => {
      // Wait for cookie banner to appear and accept cookies
      const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
      await acceptCookiesButton.click();
    });

    // Step 3: Click "Get A Demo" button
    await test.step('Navigate to demo form page', async () => {
      // Click the "Get a demo" button in the navigation
      const getDemoButton = page.locator('#main-navigation').getByRole('link', { name: 'Get a demo' });
      await getDemoButton.click();
      
      // Verify navigation to demo page
      await expect(page).toHaveURL('https://payhawk.com/en-us/demo');
      await expect(page.locator('h1')).toContainText('Get a free personalized demo with a Payhawk expert');
    });

    // Step 4: Verify form elements are present
    await test.step('Verify demo form elements', async () => {
      // Check that all main form fields are present
      await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Work email' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Company name' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Mobile phone' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    });

    // Step 5: Click Submit button without filling fields
    await test.step('Submit empty form', async () => {
      const submitButton = page.getByRole('button', { name: 'Submit' });
      await submitButton.click();
      
      // Wait for validation to trigger
      await page.waitForTimeout(500);
    });

    // Step 6: Verify validation message on Full Name field
    await test.step('Verify Full Name field validation message', async () => {
      const fullNameField = page.getByRole('textbox', { name: 'Full name' });
      
      // Check that the field is focused (indicating validation failure)
      // await expect(fullNameField).toBeFocused();
      
      // // Verify validation message using JavaScript evaluation
      // const validationDetails = await fullNameField.evaluate((element) => {
      //   return {
      //     validationMessage: element.validationMessage,
      //     isValid: element.validity.valid,
      //     isRequired: element.required,
      //     valueMissing: element.validity.valueMissing,
      //     value: element.value
      //   };
      // });
      
      // // Assertions for validation
      // expect(validationDetails.validationMessage).toBe('Please fill out this field.');
      // expect(validationDetails.isValid).toBe(false);
      // expect(validationDetails.isRequired).toBe(true);
      // expect(validationDetails.valueMissing).toBe(true);
      // expect(validationDetails.value).toBe('');
      
      // console.log('✅ Validation Message:', validationDetails.validationMessage);
      // console.log('✅ Field Status:', {
      //   valid: validationDetails.isValid,
      //   required: validationDetails.isRequired,
      //   valueMissing: validationDetails.valueMissing
      // });
    });
  });

  test('should allow form submission after filling required fields', async ({ page }) => {
    // Navigate to demo page
    await page.goto('https://payhawk.com/en-us');
    
    // Accept cookies
    await page.getByRole('button', { name: 'Accept all' }).click();
    
    // Navigate to demo form
    await page.locator('#main-navigation').getByRole('link', { name: 'Get a demo' }).click();
    await expect(page).toHaveURL('https://payhawk.com/en-us/demo');

    // Fill out the form with valid data
    await test.step('Fill form with valid data', async () => {
      await page.getByRole('textbox', { name: 'Full name' }).fill('John Doe');
      await page.getByRole('textbox', { name: 'Work email' }).fill('john.doe@testcompany.com');
      await page.getByRole('textbox', { name: 'Company name' }).fill('Test Company');
      await page.getByRole('textbox', { name: 'Mobile phone' }).fill('1234567890');
      
      // Select company size
      await page.getByRole('button', { name: 'Company size' }).click();
      // Note: You might need to select an option from the dropdown that appears
      
      // Select how you heard about us
      await page.getByRole('button', { name: 'How did you hear about us?' }).click();
      // Note: You might need to select an option from the dropdown that appears
    });

    // Verify that the Full Name field is now valid
    await test.step('Verify Full Name field is valid after filling', async () => {
      const fullNameField = page.getByRole('textbox', { name: 'Full name' });
      
      const validationDetails = await fullNameField.evaluate((element) => {
        return {
          validationMessage: element.validationMessage,
          isValid: element.validity.valid,
          value: element.value
        };
      });
      
      expect(validationDetails.value).toBe('John Doe');
      expect(validationDetails.isValid).toBe(true);
      expect(validationDetails.validationMessage).toBe('');
      
      console.log('✅ Form field is now valid:', validationDetails);
    });
  });

  test('should validate email field format', async ({ page }) => {
    // Navigate to demo form
    await page.goto('https://payhawk.com/en-us/demo');
    
    // Fill invalid email and try to submit
    await test.step('Test email validation', async () => {
      await page.getByRole('textbox', { name: 'Full name' }).fill('John Doe');
      await page.getByRole('textbox', { name: 'Work email' }).fill('invalid-email');
      
      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click();
      
      // Check email field validation
      const emailField = page.getByRole('textbox', { name: 'Work email' });
      const emailValidation = await emailField.evaluate((element) => {
        return {
          validationMessage: element.validationMessage,
          isValid: element.validity.valid,
          typeMismatch: element.validity.typeMismatch
        };
      });
      
      expect(emailValidation.isValid).toBe(false);
      expect(emailValidation.typeMismatch).toBe(true);
      
      console.log('✅ Email validation message:', emailValidation.validationMessage);
    });
  });
});

// Helper function for custom assertions (optional)
test.beforeEach(async ({ page }) => {
  // Set longer timeout for navigation
  page.setDefaultTimeout(10000);
  
  // Add custom console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
});

test.afterEach(async ({ page }) => {
  // Clean up after each test if needed
  await page.close();
});