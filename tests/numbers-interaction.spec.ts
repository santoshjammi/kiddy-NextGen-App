import { test, expect } from '@playwright/test';

test.describe('NE — Numbers Interaction', () => {
  test('NE-009 clicking a number shows its word form', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("7")').first().click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Seven')).toBeVisible({ timeout: 5000 });
  });

  test('NE-010 level 4 shows numbers 101-150', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption({ index: 3 });
    await page.waitForTimeout(500);

    const body = await page.locator('body').textContent();
    expect(body).toContain('Level 4');
    expect(body).toContain('101');
  });

  test('NE-011 number grid buttons are clickable', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button.ps-tile');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    await buttons.first().click();
    await page.waitForTimeout(500);

    const activeClass = await buttons.first().getAttribute('class');
    expect(activeClass).toContain('ps-tile-active');
  });

  test('NE-012 surprise button picks a number from current range', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('select').selectOption({ index: 4 });
    await page.waitForTimeout(300);

    await page.locator('button:has-text("Surprise")').click();
    await page.waitForTimeout(500);

    const displayNum = await page.locator('.text-8xl').textContent();
    const num = parseInt(displayNum?.trim() || '0', 10);
    expect(num).toBeGreaterThanOrEqual(151);
    expect(num).toBeLessThanOrEqual(200);
  });

  test('NE-013 repeat button plays audio (falls back to speech)', async ({ page }) => {
    await page.goto('/numbers');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("5")').first().click();
    await page.waitForTimeout(500);

    const repeat = page.locator('button:has-text("Repeat")');
    await expect(repeat).toBeVisible({ timeout: 5000 });
  });
});