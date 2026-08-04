import { test, expect } from '@playwright/test';

test.describe('Mosaic End-to-End Execution Pipeline', () => {
  test('Complete document processing workflow', async ({ page }) => {
    // 1. Project Creation
    await page.goto('/');
    await page.click('text=New Project');
    await page.fill('input[name="projectName"]', 'Project Titan E2E');
    await page.click('button:has-text("Create")');
    await expect(page.locator('h1')).toHaveText('Project Titan E2E');

    // 2. Document Upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Document');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample-memo.pdf');

    // 3. Execution Observation
    await expect(page.locator('text=Ingestion Started')).toBeVisible();
    await expect(page.locator('.progress-bar')).toBeVisible();

    // 4. Provider Progress (SSE streaming validation)
    await expect(page.locator('text=Docling Provider')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Entity Extraction')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Evidence Extraction')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Hypothesis Generation')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=IC Review')).toBeVisible({ timeout: 15000 });

    // 5. Completion
    await expect(page.locator('text=Pipeline Completed')).toBeVisible({ timeout: 30000 });

    // 6. Inspect Artifacts
    await page.click('text=View Evidence');
    await expect(page.locator('.evidence-card').first()).toBeVisible();

    await page.click('text=Hypotheses');
    await expect(page.locator('.hypothesis-card').first()).toBeVisible();

    // 7. Accept Proposal
    await page.click('text=Proposals');
    await page.click('button:has-text("Accept Proposal")');
    await expect(page.locator('text=Proposal Accepted')).toBeVisible();

    // 8. Traceability
    await page.click('.hypothesis-card >> text=View Sources');
    await expect(page.locator('.pdf-viewer-highlight')).toBeVisible();
  });
});
