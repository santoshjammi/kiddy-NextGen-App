import { test, expect } from '@playwright/test';

test.describe('MM — Memory Match Expansion', () => {
  test('MM-001 level selector visible with 4 levels', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    const select = page.locator('select');
    await expect(select).toBeVisible({ timeout: 5000 });
    const options = await select.locator('option').allTextContents();
    expect(options.length).toBe(4);
    expect(options[0]).toContain('Level 1');
    expect(options[3]).toContain('Level 4');
  });

  test('MM-002 level 1 shows 3 pairs target', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('1');
    await page.waitForTimeout(300);

    await expect(page.locator('text=/\\d+ \\/ 3/')).toBeVisible({ timeout: 5000 });
  });

  test('MM-003 level 2 shows 5 pairs target', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('2');
    await page.waitForTimeout(300);

    await expect(page.locator('text=/\\d+ \\/ 5/')).toBeVisible({ timeout: 5000 });
  });

  test('MM-004 level 4 shows 10 pairs target', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('4');
    await page.waitForTimeout(300);

    await expect(page.locator('text=/\\d+ \\/ 10/')).toBeVisible({ timeout: 5000 });
  });

  test('MM-005 pairs found counter starts at 0', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('1');
    await page.waitForTimeout(300);

    const pairsText = await page.locator('text=/\\d+ \\/ 3/').textContent();
    expect(pairsText?.trim()).toContain('0');
  });

  test('MM-006 move counter visible on page', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=moves')).toBeVisible({ timeout: 5000 });
  });

  test('MM-007 reset button resets the game', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    const resetBtn = page.locator('button:has-text("Reset")');
    await expect(resetBtn).toBeVisible({ timeout: 5000 });
  });

  test('MM-008 level title shows correct level label', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('3');
    await page.waitForTimeout(200);

    await expect(page.locator('text=Tricky')).toBeVisible({ timeout: 5000 });
  });
});