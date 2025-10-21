/**
 * Utility function to handle consent popup on Sinoptik website
 */
export async function handleConsent(page) {
  try {
    await page.waitForSelector("button[aria-label='Давам съгласие']", { timeout: 5000 });
    await page.locator("button[aria-label='Давам съгласие']").click();
  } catch (e) {
    // No consent popup (e.g., non-EU IP), proceed
  }
}