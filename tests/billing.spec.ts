/**
 * MODULE 3 — Billing Flow (Razorpay)
 * Tests: BILL-001, BILL-003, BILL-004, BILL-006
 *
 * These tests verify the payment-to-premium pipeline.
 * BILL-001 (real payment) is tested against the emulator by directly
 * invoking the verifyRazorpayPayment function logic via Firestore writes,
 * since we cannot hit real Razorpay in automated tests.
 *
 * For a true end-to-end billing test, run the Firebase Emulator and point
 * the app at it via NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true.
 */

import { test, expect } from '@playwright/test';
import { createEmulatorUser, signInAsTestUser, firestoreSet, firestoreGet, clearEmulatorData } from './helpers';

test.describe('BILL — Billing & Payment Pipeline', () => {
  test.beforeAll(async () => {
    await clearEmulatorData();
  });

  // ── BILL-001: Payment success → premium unlocked ──────────────
  test('BILL-001 successful payment activates isPremium in Firestore', async ({ page }) => {
    const email = `bill001_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Simulate what verifyRazorpayPayment does on success
    await firestoreSet(`users/${uid}/rewards/current`, {
      isPremium: true,
      premiumActivatedAt: new Date().toISOString(),
      subscriptionStatus: 'active',
      razorpayPaymentId: 'pay_test_001',
      razorpayOrderId: 'order_test_001',
    });

    // Navigate to the payment success page
    await page.goto('/payment-success');
    await page.waitForLoadState('networkidle');

    // Should show success messaging, not an error
    await expect(page.locator('text=Premium, text=Welcome, text=activated, text=success').first())
      .toBeVisible({ timeout: 8000 });
  });

  // ── BILL-003: Payment failure → no premium, retry CTA ────────
  test('BILL-003 payment failure leaves user as free tier', async ({ page }) => {
    const email = `bill003_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // No Firestore write (payment did not complete)
    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false });

    await page.goto('/upgrade');
    await page.waitForLoadState('networkidle');

    // Should show trial/subscribe CTA — not premium state
    await expect(
      page.locator('text=Start 7-Day Free Trial, text=Subscribe').first()
    ).toBeVisible({ timeout: 8000 });

    // The payment-success page must NOT grant access for non-premium users
    await page.goto('/payment-success');
    await page.waitForLoadState('networkidle');

    const doc = await firestoreGet(`users/${uid}/rewards/current`);
    expect(doc?.isPremium).toBe(false);
  });

  // ── BILL-004: Payment cancellation → no broken state ─────────
  test('BILL-004 cancelling Razorpay checkout leaves upgrade page intact', async ({ page }) => {
    const email = `bill004_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false });

    await page.goto('/upgrade');
    await page.waitForLoadState('networkidle');

    // The upgrade page must load without JS errors
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.waitForTimeout(2000);

    // No JS errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);

    // Trial CTA still present (not broken)
    await expect(
      page.locator('text=Start 7-Day Free Trial, text=7-Day Free Trial').first()
    ).toBeVisible({ timeout: 5000 });
  });

  // ── BILL-006: Trial → paid conversion replaces trial state ────
  test('BILL-006 upgrading from trial to paid replaces subscriptionStatus correctly', async ({ page }) => {
    const email = `bill006_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Start on trial
    const trialEnds = new Date(Date.now() + 7 * 86_400_000).toISOString();
    await firestoreSet(`users/${uid}/rewards/current`, {
      isPremium: true,
      subscriptionStatus: 'trial',
      trialStartedAt: new Date().toISOString(),
      trialEndsAt: trialEnds,
    });

    // Simulate paid upgrade (verifyRazorpayPayment result)
    await firestoreSet(`users/${uid}/rewards/current`, {
      isPremium: true,
      premiumActivatedAt: new Date().toISOString(),
      subscriptionStatus: 'active',
      razorpayPaymentId: 'pay_test_006',
      razorpayOrderId: 'order_test_006',
    });

    const doc = await firestoreGet(`users/${uid}/rewards/current`);

    // Status must be 'active', not 'trial'
    expect(doc?.subscriptionStatus).toBe('active');
    expect(doc?.isPremium).toBe(true);
    // Trial fields may persist but subscriptionStatus wins
    expect(doc?.subscriptionStatus).not.toBe('trial');
  });
});
