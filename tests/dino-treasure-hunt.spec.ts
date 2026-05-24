import { test, expect } from '@playwright/test';

test.describe('DT — Dino Treasure Hunt Phase 2', () => {
  test('DT-001 page loads with title and SVG map', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Dino Treasure Hunt', { timeout: 5000 });
    await expect(page.locator('svg')).toBeVisible();
  });

  test('DT-002 stage buttons visible (5 stages)', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const stageBtns = page.locator('button').filter({ hasText: /Explore|Discover|Associate|Capitals|Recall/ });
    const count = await stageBtns.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('DT-003 SVG map with clickable state paths', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const paths = page.locator('svg path[id]');
    const count = await paths.count();
    expect(count).toBeGreaterThanOrEqual(30);
  });

  test('DT-004 sticker count visible', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=/Stickers/')).toBeVisible({ timeout: 5000 });
  });

  test('DT-005 progress section visible', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const progressContainer = page.locator('.rounded-full.overflow-hidden');
    await expect(progressContainer).toBeVisible({ timeout: 5000 });
  });

  test('DT-006 home link navigates back', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    await page.locator('a:has-text("Home")').click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1').first()).toContainText('Give your child', { timeout: 5000 });
  });

  test('DT-007 dino mascot visible with message', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const dinoContainer = page.locator('text=/Let\'s explore/').first();
    await expect(dinoContainer).toBeVisible({ timeout: 5000 });
  });

  test('DT-008 first stage button says Explore', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const firstStage = page.locator('button').filter({ hasText: 'Explore' }).first();
    await expect(firstStage).toBeVisible({ timeout: 5000 });
  });

  test('DT-009 clicking a state path triggers interaction', async ({ page }) => {
    await page.goto('/dino-treasure-hunt');
    await page.waitForLoadState('networkidle');

    const firstPath = page.locator('svg path[id]').first();
    await firstPath.click({ force: true });
    await page.waitForTimeout(500);

    const body = page.locator('body');
    await expect(body).toContainText('This is', { timeout: 5000 });
  });
});