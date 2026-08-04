import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Validation', () => {
  test('Dashboard should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('.progress-bar', { state: 'hidden' });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Execution page should meet a11y standards', async ({ page }) => {
    await page.goto('/executions/test-exec-123');
    
    // Wait for the execution status to render
    await page.waitForSelector('text=Status:');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
