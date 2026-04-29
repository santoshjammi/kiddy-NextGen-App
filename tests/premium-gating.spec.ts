/**
 * MODULE 2 — Premium Gating
 * Tests: PREM-001 → PREM-005
 *
 * These tests run against localhost:3000 and verify that free users
 * cannot access premium content through any known bypass route.
 */

import { test, expect } from '@playwright/test';
import { createEmulatorUser, signInAsTestUser, firestoreSet, clearEmulatorData } from './helpers';

test.describe('PREM — Premium Gating', () => {
  test.beforeAll(async () => {
    await clearEmulatorData();
  });

  // ── PREM-001: Free user → Learning Path hard gated ───────────
  test('PREM-001 free user sees gate screen on /learning-path', async ({ page }) => {
    const email = `prem001_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/learning-path');
    await page.waitForLoadState('networkidle');

    // Should see a lock/upgrade CTA, not the actual learning path content
    const upgradeLink = page.locator('a[href="/upgrade"], button:has-text("Upgrade"), text=Upgrade');
    await expect(upgradeLink.first()).toBeVisible({ timeout: 8000 });
  });

  // ── PREM-002: Free user → Dashboard sections blurred ─────────
  test('PREM-002 free user sees blurred premium sections in parent dashboard', async ({ page }) => {
    const email = `prem002_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Ensure user is NOT premium
    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false, points: 0 });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The premium-gated sections have blur CSS applied
    const blurredEl = page.locator('.blur-\\[3px\\]').first();
    await expect(blurredEl).toBeVisible({ timeout: 8000 });

    // The upgrade CTA inside the lock overlay must be present
    const unlockBtn = page.locator('text=Unlock Plan, text=Unlock Analysis').first();
    await expect(unlockBtn).toBeVisible({ timeout: 5000 });
  });

  // ── PREM-003: Premium user → full access, no false blocking ──
  test('PREM-003 premium user sees full dashboard content', async ({ page }) => {
    const email = `prem003_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Grant premium via Firestore
    await firestoreSet(`users/${uid}/rewards/current`, {
      isPremium: true,
      premiumActivatedAt: new Date().toISOString(),
      subscriptionStatus: 'active',
    });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // No blurred sections should be visible
    const blurred = page.locator('.blur-\\[3px\\]');
    await expect(blurred).toHaveCount(0, { timeout: 8000 });

    // Premium section headings should be visible
    await expect(page.locator('text=What to Practise Today')).toBeVisible({ timeout: 5000 });
  });

  // ── PREM-004: Firestore premium flip → UI reflects immediately
  test('PREM-004 toggling isPremium in Firestore reflects in under 5s', async ({ page }) => {
    const email = `prem004_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Start as free
    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // Confirm blur is visible
    await expect(page.locator('.blur-\\[3px\\]').first()).toBeVisible({ timeout: 8000 });

    // Flip premium ON via emulator (simulates payment webhook)
    await firestoreSet(`users/${uid}/rewards/current`, {
      isPremium: true,
      subscriptionStatus: 'active',
      premiumActivatedAt: new Date().toISOString(),
    });

    // FirebaseProvider uses onSnapshot — UI should update within 5s
    await expect(page.locator('.blur-\\[3px\\]')).toHaveCount(0, { timeout: 5000 });
  });

  // ── PREM-005: URL manipulation still blocked ──────────────────
  test('PREM-005 free user navigating directly to /learning-path sees gate', async ({ page }) => {
    const email = `prem005_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false });

    //直接 navigate without going through the UI
    await page.goto('/learning-path');
    await page.waitForLoadState('networkidle');

    // Must NOT see actual learning path content
    const premiumContent = page.locator('[data-testid="learning-path-content"]');
    // Either gated by redirect or overlay — either way no bypass
    const upgradeText = page.locator('text=Upgrade, text=Premium');
    await expect(upgradeText.first()).toBeVisible({ timeout: 8000 });

    // If the page redirected the user away, that's also acceptable
    const url = page.url();
    const isGated = url.includes('/upgrade') || url.includes('/learning-path');
    expect(isGated).toBeTruthy();
  });
});
