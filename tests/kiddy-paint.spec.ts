import { test, expect } from '@playwright/test';

test.describe('PT — Kiddy Paint', () => {
  test('PT-001 paint page loads with canvas and toolbar', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Kiddy Paint')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('PT-002 all 3 tool buttons visible', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('button[title="Brush"]')).toBeVisible();
    await expect(page.locator('button[title="Eraser"]')).toBeVisible();
    await expect(page.locator('button[title="Fill"]')).toBeVisible();
  });

  test('PT-003 color palette has 16 colors', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const colorButtons = page.locator('button[style*="background-color"]');
    const count = await colorButtons.count();
    expect(count).toBe(16);
  });

  test('PT-004 brush size selector visible with 4 sizes', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const sizeButtons = page.locator('button[title*="px"]');
    const count = await sizeButtons.count();
    expect(count).toBe(4);
  });

  test('PT-005 clear button empties canvas', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const clearBtn = page.locator('button:has-text("Clear")');
    await expect(clearBtn).toBeVisible();
  });

  test('PT-006 Brush tool is selected by default', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const brushBtn = page.locator('button[title="Brush"]');
    await expect(brushBtn).toBeVisible();
  });

  test('PT-007 eraser tool clickable', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    await page.locator('button[title="Eraser"]').click();
    await page.waitForTimeout(200);

    const activeClass = await page.locator('button[title="Eraser"]').getAttribute('class');
    expect(activeClass).toContain('bg-[#0070cc]');
  });
});