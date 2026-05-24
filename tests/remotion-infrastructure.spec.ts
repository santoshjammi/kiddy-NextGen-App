import { test, expect } from '@playwright/test';

test.describe('KKA Infrastructure Sprint 1 Exit Gate Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to our developers sandbox page
    await page.goto('/remotion-test');
    // Wait for the 2-second welcome intro animation overlay to finish and detach
    await page.waitForSelector('.animate-fade-in', { state: 'detached', timeout: 6000 });
  });

  test('A. EventBus Stress - Rapid correct answers should reset timer and preserve exactly one overlay player', async ({ page }) => {
    // Locate the Correct Answer trigger button in sandbox
    const stressBtn = page.locator('#btn-stress-eventbus');
    await expect(stressBtn).toBeVisible();

    // Spam click it 3 times rapidly
    await stressBtn.click();
    await stressBtn.click();
    await stressBtn.click();

    // Verify exactly one Remotion Player overlay container is spawned
    // We target the dynamic player wrapper container inside GameWrapper.tsx
    const activeOverlays = page.locator('.animate-fade-in');
    await expect(activeOverlays).toHaveCount(1);

    // Let's assert that the active overlay is showing the "GREAT JOB!" text
    const activeText = page.locator('text=GREAT JOB!');
    await expect(activeText).toHaveCount(1);
    
    // Wait for the correct answer animation duration (1.5 seconds) to expire
    await page.waitForTimeout(1600);

    // After animation duration completes, overlay must transition away cleanly
    await expect(activeOverlays).toHaveCount(0);
    await expect(activeText).toHaveCount(0);
  });

  test('C. Audio Overlap Stress - Rapid mascot speech taps interrupt synthesis cleanly', async ({ page }) => {
    // Rapidly tap the Bunny mascot companion speech button
    const audioSpamBtn = page.locator('#btn-stress-audio');
    await expect(audioSpamBtn).toBeVisible();

    // Click 10 times rapidly to verify no browser synthesis deadlock or stack blocking occurs
    for (let i = 0; i < 10; i++) {
      await audioSpamBtn.click();
    }

    // Verify page continues to be interactive and logs the taps in the debug list
    const logs = page.locator('text=Spam-tapping Bunny speech...');
    await expect(logs.first()).toBeVisible();
  });

  test('D. Remotion Overlay Sequence - Transitions operate deterministically', async ({ page }) => {
    // 1. Emit WRONG_ANSWER
    const wrongBtn = page.locator('#btn-sandbox-wrong');
    await wrongBtn.click();
    
    // Verify wrong answer overlays immediately
    const wrongText = page.locator('text=Nice try! 💪');
    await expect(wrongText).toBeVisible();

    // Wait 1.6s for it to finish and vanish
    await page.waitForTimeout(1600);
    await expect(wrongText).not.toBeVisible();

    // 2. Emit CORRECT_ANSWER
    const correctBtn = page.locator('#btn-sandbox-correct');
    await correctBtn.click();
    
    const correctText = page.locator('text=GREAT JOB!');
    await expect(correctText).toBeVisible();
    
    await page.waitForTimeout(1600);
    await expect(correctText).not.toBeVisible();
  });
});

test.describe('E. Mobile Viewport Verification - iPad & iPhone Responsive Layouts', () => {
  
  test('iPad Pro - GameWrapper elements scale cleanly without text/flex container overflow', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1194 });
    await page.goto('/remotion-test');
    
    // Asserts layout conforms to view width bounds
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewWidth = await page.evaluate(() => window.innerWidth);
    
    // The scroll width must equal the client viewport width (no horizontal scrolling issues)
    expect(bodyWidth).toBeLessThanOrEqual(viewWidth);

    // Verify main interactive hook zone fits in layout
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=KAE Testing Sandbox')).toBeVisible();
  });

  test('iPhone 14 Safari - Compresses sidebars dynamically and renders content centered', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto('/remotion-test');
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewWidth);
  });
});
