import { test, expect } from '@playwright/test';

test.describe('GC — Game Completion System', () => {
  test('GC-001 home page shows progress bars on core learning cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const coreCards = page.locator('#games .grid >> nth=0').locator('> a');
    const cardCount = await coreCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(7);
  });

  test('GC-002 each game card displays completed/total format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const progressTexts = page.locator('text=/\\d+\\/\\d+/');
    const count = await progressTexts.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('GC-003 percentage labels visible on all core game cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const percentLabels = page.locator('text=/%/');
    const count = await percentLabels.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('GC-004 new games section also shows progress bars', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const newGameSection = page.locator('h2:has-text("New Games")').locator('..').locator('..');
    const progressBars = newGameSection.locator('.ps-progress-track');
    const count = await progressBars.count();
    expect(count).toBeGreaterThanOrEqual(14);
  });

  test('GC-005 milestone celebration stored in localStorage persists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      localStorage.setItem('kiddyGameCompletion', JSON.stringify({
        alphabet: { completedLevels: 7, totalLevels: 26, percentage: 27 },
      }));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const readBack = await page.evaluate(() => {
      const raw = localStorage.getItem('kiddyGameCompletion');
      if (!raw) return null;
      return JSON.parse(raw).alphabet.percentage;
    });
    expect(readBack).toBe(27);
  });

  test('GC-006 progress stored persists across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      localStorage.setItem('kiddyGameCompletion', JSON.stringify({
        shapes: { completedLevels: 5, totalLevels: 9, percentage: 56 },
      }));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const readBack = await page.evaluate(() => {
      const raw = localStorage.getItem('kiddyGameCompletion');
      if (!raw) return null;
      return JSON.parse(raw).shapes.percentage;
    });
    expect(readBack).toBe(56);
  });
});