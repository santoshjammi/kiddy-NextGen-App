import { test, expect } from '@playwright/test';

test.describe('HM — Home Page Updates', () => {
  test('HM-001 Dino Treasure Hunt card visible on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Dino Treasure Hunt India')).toBeVisible({ timeout: 5000 });
  });

  test('HM-002 Kiddy Paint card visible on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Kiddy Paint')).toBeVisible({ timeout: 5000 });
  });

  test('HM-003 Numbers title updated to 1-200', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Numbers 1-200 Fun')).toBeVisible({ timeout: 5000 });
  });

  test('HM-004 all core game cards have progress bars', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const progressBars = page.locator('.ps-progress-track');
    const count = await progressBars.count();
    expect(count).toBeGreaterThanOrEqual(21);
  });

  test('HM-005 Dino card links to dino-treasure-hunt', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dinoCard = page.locator('a[href="/dino-treasure-hunt"]');
    await expect(dinoCard).toBeVisible({ timeout: 5000 });
  });

  test('HM-006 Paint card links to /paint', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const paintCard = page.locator('a[href="/paint"]');
    await expect(paintCard).toBeVisible({ timeout: 5000 });
  });
});