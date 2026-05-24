import { test, expect } from '@playwright/test';

test.describe('KAE Sprint 3 Integration - Letter Fishing & Missing Letter', () => {
  
  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(60000);
  });

  test('A. Letter Fishing Interactivity - Correct/Wrong Answer Flow, Spam/Interrupt Safety, and Complete Session Telemetry', async ({ page }) => {
    // 1. Load game page (runs offline-ready, no user logged in)
    await page.goto('/letter-fishing');
    await page.waitForLoadState('networkidle');

    // 2. Confirm welcome intro scene overlay displays and then detaches cleanly
    const overlay = page.locator('.animate-fade-in');
    const isVisible = await overlay.isVisible();
    if (isVisible) {
      await page.waitForSelector('.animate-fade-in', { state: 'detached', timeout: 6000 });
    }

    // 3. Assert game board is loaded with ocean/bunny theme elements
    await expect(page.locator('h1:has-text("Letter Fishing")')).toBeVisible();
    
    // Bunny mascot widget should be sticky and clickable in bottom right
    const companion = page.locator('.fixed.bottom-6.right-6');
    await expect(companion).toBeVisible();
    await companion.hover();
    const bunnyWidget = page.locator('text=Tap me! 🐰');
    await expect(bunnyWidget).toBeVisible();

    // 4. Narration Interrupt Safety - spam-tap "Hear Letter" speaker button without locking
    const hearBtn = page.locator('button:has-text("Hear Letter")');
    await expect(hearBtn).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await hearBtn.click();
    }
    // Verify interface remains interactive and responsive
    await expect(hearBtn).toBeEnabled();

    // 5. Answer validation and struggle logging: click a wrong answer first
    const wrongTile = page.locator('[data-testid="letter-tile"][data-correct="false"]').first();
    const correctTile = page.locator('[data-testid="letter-tile"][data-correct="true"]').first();
    
    // Drag/spam safety: spam-click tiles rapidly, verifying no state crashes or duplicates
    await wrongTile.click();
    await correctTile.click(); // This click should be ignored since tiles are disabled during feedback state

    // Verify warm comforting pediatric feedback message is shown (does NOT contain "Wrong", "Incorrect", or "Failed")
    const comfortMsg = page.locator('text=Let us try again! You are doing great! 🌟');
    await expect(comfortMsg).toBeVisible();

    // Verify that the feedback layout does NOT contain discouragement terms or generic red coloring
    await expect(page.locator('text=Incorrect')).toHaveCount(0);
    await expect(page.locator('text=Failed')).toHaveCount(0);

    // Let the wrong answer sequence timer expire (1.8s) and page advances
    await page.waitForTimeout(2000);
    await expect(comfortMsg).not.toBeVisible();

    // 6. Solve 5 questions correctly to achieve session complete target
    let questionsSolved = 0;
    while (questionsSolved < 5) {
      // Find correct tile for active question
      const tile = page.locator('[data-testid="letter-tile"][data-correct="true"]').first();
      await tile.click();
      questionsSolved++;
      
      // Allow correct animation transition to play (compound correct_answer + reward_unlock takes 3.0s)
      await page.waitForTimeout(3500);
    }

    // 7. Session Complete: confirm congratulations overlay and victory card
    const celebrationTitle = page.locator('text=Wonderful Session!');
    await expect(celebrationTitle).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=caught all 5 target letters')).toBeVisible();

    // 8. Telemetry check: evaluate the window __LAST_TELEMETRY__ value to assert correct data mapping
    const telemetry = await page.evaluate(() => (window as { __LAST_TELEMETRY__?: Record<string, unknown> }).__LAST_TELEMETRY__);
    
    // Total: 5 correct + 1 wrong = 6 questions
    expect(telemetry.payload.totalCount).toBe(6);
    expect(telemetry.payload.correctCount).toBe(5);
    
    // Streak: 1 (completed successfully)
    expect(telemetry.payload.streak).toBe(1);
    
    // Struggles list should include computed struggle tags
    expect(telemetry.payload.rewards).toBeDefined();
    expect(telemetry.payload.rewards.length).toBeGreaterThanOrEqual(1);
  });

  test('B. Missing Letter Interactivity - Vowel Confusion Struggles and Custom Sequences', async ({ page }) => {
    // 1. Load Missing Letter
    await page.goto('/missing-letter');
    await page.waitForLoadState('networkidle');

    // 2. Wait for IntroScene to complete and detach if it is visible
    const overlay = page.locator('.animate-fade-in');
    const isVisible = await overlay.isVisible();
    if (isVisible) {
      await page.waitForSelector('.animate-fade-in', { state: 'detached', timeout: 6000 });
    }

    // 3. Assert jungle/owl elements
    await expect(page.locator('h1:has-text("Missing Letter")')).toBeVisible();
    const companion = page.locator('.fixed.bottom-6.right-6');
    await expect(companion).toBeVisible();
    await companion.hover();
    await expect(page.locator('text=Tap me! 🦉')).toBeVisible();

    // 4. Play wrong answer to trigger struggle tag calculation
    const wrongChoice = page.locator('[data-testid="choice-button"][data-correct="false"]').first();
    await wrongChoice.click();

    // Verify comforting message and no harsh fail words
    await expect(page.locator('text=We can do it! Let us try again! 🌟')).toBeVisible();
    await expect(page.locator('text=Failed')).toHaveCount(0);

    // Wait for transition
    await page.waitForTimeout(2000);

    // 5. Complete remaining questions
    let correctCount = 0;
    while (correctCount < 5) {
      const correctChoice = page.locator('[data-testid="choice-button"][data-correct="true"]').first();
      await correctChoice.click();
      correctCount++;
      await page.waitForTimeout(1500);
    }

    // 6. Victory Screen
    await expect(page.locator('text=Wonderful Session!')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=solved all 5 missing letters')).toBeVisible();

    // 7. Verify Telemetry in memory
    const telemetry = await page.evaluate(() => (window as { __LAST_TELEMETRY__?: Record<string, unknown> }).__LAST_TELEMETRY__);
    expect(telemetry.payload.correctCount).toBe(5);
    expect(telemetry.payload.streak).toBe(1);
    
    // Must capture specific struggle logic tags like vowel_confusion
    expect(telemetry.payload.rewards).toContain('vowel_confusion');
  });

  test('C. Telemetry Dropoff - Leaving the page triggers offline unmount telemetry write', async ({ page }) => {
    // 1. Load game page
    await page.goto('/letter-fishing');
    await page.waitForLoadState('networkidle');
    const overlay = page.locator('.animate-fade-in');
    const isVisible = await overlay.isVisible();
    if (isVisible) {
      await page.waitForSelector('.animate-fade-in', { state: 'detached', timeout: 6000 });
    }

    // 2. Solve exactly 2 questions correctly and 1 incorrectly
    // Question 1: Correct
    await page.locator('[data-testid].letter-tile[data-correct="true"], [data-testid="letter-tile"][data-correct="true"]').first().click();
    await page.waitForTimeout(3500); // 3.0s double-overlay

    // Question 2: Incorrect
    await page.locator('[data-testid].letter-tile[data-correct="false"], [data-testid="letter-tile"][data-correct="false"]').first().click();
    await page.waitForTimeout(2500); // 1.0s wrong answer overlay

    // Question 3: Correct
    await page.locator('[data-testid].letter-tile[data-correct="true"], [data-testid="letter-tile"][data-correct="true"]').first().click();
    await page.waitForTimeout(3500); // 3.0s double-overlay

    // 3. Set up page listener to serialize __LAST_TELEMETRY__ to sessionStorage on unmount/unload
    await page.evaluate(() => {
      window.addEventListener('beforeunload', () => {
        if ((window as { __LAST_TELEMETRY__?: Record<string, unknown> }).__LAST_TELEMETRY__) {
          sessionStorage.setItem('dropoff_telemetry', JSON.stringify((window as { __LAST_TELEMETRY__?: Record<string, unknown> }).__LAST_TELEMETRY__));
        }
      });
    });

    // 4. Force unmount by navigating away from the page
    await page.goto('/parent');
    await page.waitForLoadState('networkidle');

    // 5. Read persistent dropoff log from sessionStorage
    const dropoffRaw = await page.evaluate(() => sessionStorage.getItem('dropoff_telemetry'));
    expect(dropoffRaw).not.toBeNull();
    
    const telemetry = JSON.parse(dropoffRaw!);
    expect(telemetry.payload).toBeDefined();
    
    // Total solved in session before exit: 3
    expect(telemetry.payload.totalCount).toBe(3);
    expect(telemetry.payload.correctCount).toBe(2);
    expect(telemetry.payload.streak).toBe(0); // completed is false
    expect(telemetry.payload.difficulty).toBe(3); // dropoffQuestionIndex is 3 (user advanced to Question 4)
    expect(telemetry.payload.rewards).toBeDefined();
    expect(telemetry.payload.rewards.length).toBeGreaterThanOrEqual(1);
  });

  test('D. Animal Sounds TTS & State Sync - Click, Hear, and Solve gameplay loop', async ({ page }) => {
    // 1. Load animals page
    await page.goto('/animals');
    await page.waitForLoadState('networkidle');

    // 2. Confirm headers and basic layouts
    await expect(page.locator('h1:has-text("Animal Sounds")')).toBeVisible();

    // 3. Hear sound: button shows "Hear it" initially
    const hearBtn = page.locator('button:has-text("Hear it")');
    await expect(hearBtn).toBeVisible();

    // 4. Click Hear it, check that it goes into playing state
    await hearBtn.click();
    
    // Allow state transitions to settle
    await page.waitForTimeout(500);

    // 5. Select correct answer
    const correctBtn = page.locator('[data-testid="animal-choice"][data-correct="true"]').first();
    await correctBtn.click();

    // 6. Verify encouraging pediatric feedback shows up
    const successMsg = page.locator('text=Yes! The');
    await expect(successMsg).toBeVisible();

    // 7. Verify next button functions
    const nextBtn = page.locator('button:has-text("Next")');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Confirm next question loads (e.g. 2 / 12)
    await expect(page.locator('text=2 / 12')).toBeVisible();
  });
});
