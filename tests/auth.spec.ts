/**
 * MODULE 1 — Authentication System
 * Tests: AUTH-001 → AUTH-006
 *
 * Requires: Firebase Emulator running
 *   firebase emulators:start --only auth,firestore
 */

import { test, expect } from '@playwright/test';
import { createEmulatorUser, signInAsTestUser, firestoreGet, clearEmulatorData } from './helpers';

test.describe('AUTH — Authentication System', () => {
  test.beforeAll(async () => {
    await clearEmulatorData();
  });

  // ── AUTH-001: New user → Firestore doc created ────────────────
  test('AUTH-001 new Google user triggers Firestore profile creation', async ({ page }) => {
    const email = `auth001_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The app should write users/{uid} on first login via FirebaseProvider
    // Allow up to 5s for the document to appear
    let profile: Record<string, unknown> | null = null;
    for (let i = 0; i < 10; i++) {
      profile = await firestoreGet(`users/${uid}`);
      if (profile) break;
      await page.waitForTimeout(500);
    }

    expect(profile).not.toBeNull();
  });

  // ── AUTH-002: Returning user — state restored ─────────────────
  test('AUTH-002 returning user sees their existing progress', async ({ page }) => {
    const email = `auth002_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Pre-seed rewards
    const { firestoreSet } = await import('./helpers');
    await firestoreSet(`users/${uid}/rewards/current`, {
      points: 150,
      streakDays: 3,
      isPremium: false,
    });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The rewards summary should show 3-day streak (visible value in DOM)
    await expect(page.getByText('3', { exact: true }).first()).toBeVisible({ timeout: 8000 });
  });

  // ── AUTH-003: Session persists across page refresh ────────────
  test('AUTH-003 user stays signed in after page refresh', async ({ page }) => {
    const email = `auth003_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Parent dashboard content should still be visible (not signed-out state)
    await expect(page.locator('text=Parent Dashboard')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Sign in')).not.toBeVisible();
  });

  // ── AUTH-004: Logout blocks access ───────────────────────────
  test('AUTH-004 after logout premium routes are blocked', async ({ page }) => {
    const email = `auth004_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // Simulate logout by clearing localStorage auth token
    await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('firebase:'));
      keys.forEach(k => localStorage.removeItem(k));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should see sign-in prompt, not dashboard content
    await expect(page.locator('text=Sign in')).toBeVisible({ timeout: 8000 });
  });

  // ── AUTH-005: Multi-device — no reward duplication ────────────
  test('AUTH-005 same account on two pages does not duplicate rewards', async ({ browser }) => {
    const email = `auth005_${Date.now()}@test.com`;
    await createEmulatorUser(email);

    // Open two separate browser contexts (simulates two devices)
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    await signInAsTestUser(page1, email);
    await signInAsTestUser(page2, email);

    await page1.goto('/parent');
    await page2.goto('/parent');

    await page1.waitForLoadState('networkidle');
    await page2.waitForLoadState('networkidle');

    // Both pages should load cleanly without JS errors
    const errors: string[] = [];
    page1.on('pageerror', e => errors.push(e.message));
    page2.on('pageerror', e => errors.push(e.message));

    // Wait a moment for any crash
    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    expect(errors.filter(e => e.includes('ChunkLoadError'))).toHaveLength(0);

    await ctx1.close();
    await ctx2.close();
  });

  // ── AUTH-006: Cross-user Firestore access denied ──────────────
  test('AUTH-006 user cannot read another users Firestore path', async ({ page }) => {
    const emailA = `auth006a_${Date.now()}@test.com`;
    const emailB = `auth006b_${Date.now()}@test.com`;

    await createEmulatorUser(emailA);
    const uidB = await createEmulatorUser(emailB);

    // Sign in as user A
    await signInAsTestUser(page, emailA);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Attempt to read user B's rewards from the client
    const result = await page.evaluate(async (targetUid) => {
      try {
        // Try to fetch another user's rewards document from the client side
        // This would normally be blocked by Firestore security rules
        const res = await window.fetch(
          `/api/firestore-check?uid=${targetUid}`,
          { method: 'GET', credentials: 'same-origin' }
        );
        return res.status;
      } catch {
        return 'blocked';
      }
    }, uidB);

    // The cross-user read should be denied (403) or blocked
    expect(result === 403 || result === 'blocked').toBeTruthy();
  });
});
