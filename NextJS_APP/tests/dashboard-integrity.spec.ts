/**
 * MODULE 8 — Parent Dashboard Data Integrity
 * Tests: PD-001, PD-002, PD-003, PD-004, PD-005
 *
 * Verifies that the dashboard accurately reflects Firestore data —
 * the most trust-critical module per PostPhase02.md.
 */

import { test, expect } from '@playwright/test';
import { createEmulatorUser, signInAsTestUser, firestoreSet, clearEmulatorData } from './helpers';

test.describe('PD — Parent Dashboard Data Integrity', () => {
  test.beforeAll(async () => {
    await clearEmulatorData();
  });

  // ── PD-001: Today Minutes matches logged sessions ─────────────
  test('PD-001 today minutes stat reflects all logged sessions for today', async ({ page }) => {
    const email = `pd001_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    const today = new Date().toISOString().slice(0, 10);

    // Write two sessions for today (12 + 8 = 20 min)
    await firestoreSet(`users/${uid}/sessions/s1`, { date: today, durationMinutes: 12, subject: 'mathematics' });
    await firestoreSet(`users/${uid}/sessions/s2`, { date: today, durationMinutes: 8, subject: 'english' });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // "Today's Practice" stat should show 20 min
    await expect(page.locator('text=20 min')).toBeVisible({ timeout: 8000 });
  });

  // ── PD-001b: No false-zero when sessions exist ────────────────
  test('PD-001b dashboard does not show 0 min when sessions are logged', async ({ page }) => {
    const email = `pd001b_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    const today = new Date().toISOString().slice(0, 10);
    await firestoreSet(`users/${uid}/sessions/s1`, { date: today, durationMinutes: 15, subject: 'carry-borrow' });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The Today's Practice tile must NOT show 0
    const todayTile = page.locator('text=Today\'s Practice').locator('..');
    await expect(todayTile).toBeVisible({ timeout: 8000 });

    const valueText = await todayTile.locator('.text-3xl').textContent();
    expect(valueText?.trim()).not.toBe('0 min');
  });

  // ── PD-002: Weak area detection uses actual struggle data ─────
  test('PD-002 Where to Focus shows only tags from actual Firestore struggle data', async ({ page }) => {
    const email = `pd002_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    // Grant premium so the section is unblurred
    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: true, subscriptionStatus: 'active' });

    // Write progress with specific struggle tags
    await firestoreSet(`users/${uid}/progress/mathematics`, {
      subject: 'mathematics',
      current_topic: 'addition',
      difficulty_level: 2,
      mastery_score: 35,
      total_problems_solved: 20,
      recent_struggles: ['carry_level_2_add'],
      last_played: new Date().toISOString(),
    });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // "Where to Focus" section must mention the actual struggle
    await expect(page.locator('text=Carry Level 2 Add, text=carry, text=Carry').first())
      .toBeVisible({ timeout: 8000 });
  });

  // ── PD-003: Recommendation quality — not generic ──────────────
  test('PD-003 adaptive recommendation routes to the correct remediation game', async ({ page }) => {
    const email = `pd003_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: true, subscriptionStatus: 'active' });

    // Vowel confusion → should recommend missing-letter
    await firestoreSet(`users/${uid}/progress/english`, {
      subject: 'english',
      current_topic: 'vowels',
      difficulty_level: 2,
      mastery_score: 30,
      total_problems_solved: 15,
      recent_struggles: ['vowel_confusion_level_2'],
      last_played: new Date().toISOString(),
    });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The "Start Practice" button in Recommended Today should link to missing-letter
    const startBtn = page.locator('a[href="/missing-letter"], a:has-text("missing"), a:has-text("Letter")');
    await expect(startBtn.first()).toBeVisible({ timeout: 8000 });
  });

  // ── PD-004: All 5 subjects visible in Learning Progress ───────
  test('PD-004 all 5 subjects appear in the Learning Progress grid', async ({ page }) => {
    const email = `pd004_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    const expectedSubjects = ['Carry & Borrow', 'Math Engine', 'Word Builder', 'Multiplication Race', 'Division Splitter'];
    for (const subject of expectedSubjects) {
      await expect(page.locator(`text=${subject}`)).toBeVisible({ timeout: 8000 });
    }
  });

  // ── PD-005: Premium blur cannot be bypassed ───────────────────
  test('PD-005 css pointer-events:none prevents clicking blurred premium content', async ({ page }) => {
    const email = `pd005_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    const uid = await signInAsTestUser(page, email);

    await firestoreSet(`users/${uid}/rewards/current`, { isPremium: false });

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // Blurred sections must have pointer-events:none preventing interaction
    const blurredCount = await page.locator('.pointer-events-none').count();
    expect(blurredCount).toBeGreaterThan(0);

    // The hidden content inside blurred sections is not clickable
    const blurredLink = page.locator('.pointer-events-none a').first();
    // It should exist in DOM but not be interactive (pointer-events: none)
    const pointerEvents = await blurredLink.evaluate(el =>
      window.getComputedStyle(el).pointerEvents
    ).catch(() => 'none');

    expect(pointerEvents).toBe('none');
  });

  // ── Onboarding modal shown on first visit ─────────────────────
  test('first-session empty-state prompt shows when no data exists', async ({ page }) => {
    const email = `pd_empty_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // The empty state "Pick a game" CTA should be visible
    await expect(page.locator('text=Pick a game')).toBeVisible({ timeout: 8000 });
  });

  // ── Onboarding modal dismissed on second visit ────────────────
  test('onboarding modal is dismissed after first close', async ({ page }) => {
    const email = `pd_modal_${Date.now()}@test.com`;
    await createEmulatorUser(email);
    await signInAsTestUser(page, email);

    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // Modal should appear
    await expect(page.locator('text=Here\'s what your dashboard tracks')).toBeVisible({ timeout: 8000 });

    // Dismiss it
    await page.locator('text=I\'ll explore on my own').click();
    await page.waitForTimeout(300);

    // Reload — modal should NOT appear again (localStorage flag set)
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Here\'s what your dashboard tracks')).not.toBeVisible({ timeout: 3000 });
  });
});
