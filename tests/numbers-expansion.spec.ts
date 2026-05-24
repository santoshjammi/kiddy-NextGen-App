import { test, expect } from '@playwright/test';

test.describe('NE — Numbers Engine Expansion (1–200)', () => {
  test('NE-001 page title shows Numbers 1-200', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Numbers 1–200')).toBeVisible({ timeout: 5000 });
  });

  test('NE-002 level selector has 5 levels', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    const select = page.locator('select');
    const options = await select.locator('option').allTextContents();
    expect(options.length).toBe(5);
    expect(options[0]).toContain('Level 1');
    expect(options[4]).toContain('Level 5');
  });

  test('NE-003 level 1 shows numbers 1-25 in grid', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    const tile5 = page.locator('button:has-text("5")').first();
    await expect(tile5).toBeVisible({ timeout: 5000 });
    const tile26 = page.locator('button:has-text("26")').first();
    await expect(tile26).not.toBeVisible();
  });

  test('NE-004 switching to level 5 header shows Level 5 text', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    const select = page.locator('select');
    await select.focus();
    await select.selectOption({ index: 4 });
    await page.waitForTimeout(500);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Level 5');
  });

  test('NE-005 progress bar tracks /200', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    const progressText = page.locator('text=/\\/200/');
    await expect(progressText).toBeVisible({ timeout: 5000 });
  });

  test('NE-006 clicking a number mark persists in localStorage', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("7")').first().click();
    await page.waitForTimeout(500);

    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem('kiddyHub_numbersCompleted');
      return raw ? JSON.parse(raw) : [];
    });
    expect(saved).toContain(7);
  });

  test('NE-007 select random number navigates within active level range', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('4');
    await page.waitForTimeout(300);

    await page.locator('button:has-text("Surprise")').click();
    await page.waitForTimeout(500);

    const displayedNumber = await page.locator('.text-8xl').textContent();
    const num = parseInt(displayedNumber?.trim() || '0', 10);
    expect(num).toBeGreaterThanOrEqual(151);
    expect(num).toBeLessThanOrEqual(200);
  });

  test('NE-008 reset progress clears all data', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("10")').first().click();
    await page.waitForTimeout(300);

    page.on('dialog', (dialog) => dialog.accept());

    await page.locator('button:has-text("Reset All Progress")').click();
    await page.waitForTimeout(500);

    const saved = await page.evaluate(() => {
      return localStorage.getItem('kiddyHub_numbersCompleted');
    });
    expect(saved).toBeNull();
  });
});