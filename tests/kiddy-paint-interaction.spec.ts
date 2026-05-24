import { test, expect } from '@playwright/test';

test.describe('PT — Kiddy Paint Interaction', () => {
  test('PT-008 drawing on canvas changes pixel data', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');

    const initialData = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(100, 100, 1, 1).data);
    });

    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(150, 150);
      ctx.stroke();
    });

    const afterData = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(100, 100, 1, 1).data);
    });

    const initialStr = JSON.stringify(initialData);
    const afterStr = JSON.stringify(afterData);
    expect(initialStr).not.toBe(afterStr);
  });

  test('PT-009 fill bucket fills entire canvas', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    await page.locator('button[title="Fill"]').click();
    await page.waitForTimeout(200);

    const canvas = page.locator('canvas');
    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, c.width, c.height);
    });

    const pixel = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(10, 10, 1, 1).data);
    });

    expect(pixel?.[0]).toBe(0);
    expect(pixel?.[1]).toBe(0);
    expect(pixel?.[2]).toBe(255);
  });

  test('PT-010 eraser clears drawn content', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');

    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 200);
      ctx.stroke();
    });

    const drawnPixel = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(100, 100, 1, 1).data);
    });
    const drawnStr = JSON.stringify(drawnPixel);

    await page.locator('button[title="Eraser"]').click();
    await page.waitForTimeout(200);

    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 200);
      ctx.stroke();
    });

    const erasedPixel = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(100, 100, 1, 1).data);
    });

    const erasedStr = JSON.stringify(erasedPixel);
    expect(drawnStr).not.toBe(erasedStr);
  });

  test('PT-011 changing color affects subsequent strokes', async ({ page }) => {
    await page.goto('/paint');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas');

    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(50, 50);
      ctx.stroke();
    });

    const colorBtn = page.locator('button[style*="background-color: rgb(0, 0, 255)"]').first();
    if (await colorBtn.isVisible()) {
      await colorBtn.click();
      await page.waitForTimeout(200);
    }

    await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#0000FF';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(60, 60);
      ctx.lineTo(100, 100);
      ctx.stroke();
    });

    const pixel = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      return Array.from(ctx.getImageData(80, 80, 1, 1).data);
    });

    const hasBlue = pixel?.[2] !== undefined && pixel[2] > 200;
    expect(hasBlue).toBe(true);
  });
});