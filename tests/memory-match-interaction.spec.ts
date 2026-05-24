import { test, expect } from '@playwright/test';

test.describe('MM — Memory Match Interaction', () => {
  test('MM-009 level 1 has 6 card buttons', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('1');
    await page.waitForTimeout(400);

    const buttons = page.locator('div[style*="grid"] button');
    const count = await buttons.count();
    expect(count).toBe(6);
  });

  test('MM-010 level 4 has 20 card buttons', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('4');
    await page.waitForTimeout(400);

    const buttons = page.locator('div[style*="grid"] button');
    const count = await buttons.count();
    expect(count).toBe(20);
  });

  test('MM-011 clicking a card flips it (shows emoji)', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('1');
    await page.waitForTimeout(400);

    const buttons = page.locator('div[style*="grid"] button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const textBefore = await buttons.nth(i).textContent();
      if (!textBefore || textBefore.trim() === '') {
        await buttons.nth(i).click();
        await page.waitForTimeout(200);
        const textAfter = await buttons.nth(i).textContent();
        expect(textAfter?.trim()).not.toBe('');
        return;
      }
    }
  });

  test('MM-012 reset button works on all levels', async ({ page }) => {
    await page.goto('/memory-match');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption('3');
    await page.waitForTimeout(300);

    const reset = page.locator('button:has-text("Reset")');
    await expect(reset).toBeVisible({ timeout: 3000 });
    await reset.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=/\\d+ \\/ 7/')).toBeVisible({ timeout: 3000 });
  });
});