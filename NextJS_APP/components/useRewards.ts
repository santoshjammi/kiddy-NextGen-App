"use client";

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

// ── Types ─────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: string; // ISO
}

export interface RewardsState {
  points: number;
  badges: Badge[];
  streakDays: number;
  lastSessionDate: string; // YYYY-MM-DD
  totalSessions: number;
}

export interface SessionLog {
  subject: string;
  durationMinutes: number;
  completedModules: number;
}

// ── Badge catalogue ────────────────────────────────────────────────

export const ALL_BADGES: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first_steps',       emoji: '🌱', name: 'First Steps',         description: 'Solved your very first problem'              },
  { id: 'century_club',      emoji: '💯', name: 'Century Club',        description: 'Solved 100 problems total'                   },
  { id: 'carry_champion',    emoji: '📦', name: 'Carry Champion',      description: 'Got 10 carry additions right'                },
  { id: 'borrow_boss',       emoji: '🔄', name: 'Borrow Boss',         description: 'Got 10 borrow subtractions right'            },
  { id: 'math_level_2',      emoji: '⚡', name: 'Level 2 Unlocked',    description: 'Reached Level 2 in any math subject'        },
  { id: 'math_level_3',      emoji: '🔥', name: 'Level 3 Unlocked',    description: 'Reached Level 3 in any math subject'        },
  { id: 'math_level_4',      emoji: '🚀', name: 'Math Expert',         description: 'Reached Level 4 in any math subject'        },
  { id: 'math_master',       emoji: '🏆', name: 'Math Master',         description: 'Reached Level 5 — the highest math level'   },
  { id: 'word_builder_l2',   emoji: '📖', name: 'Word Explorer',       description: 'Reached Level 2 in Word Builder'            },
  { id: 'word_builder_l4',   emoji: '✍️', name: 'Spelling Pro',        description: 'Reached Level 4 in Word Builder'            },
  { id: 'streak_3',          emoji: '🔥', name: '3-Day Streak',        description: 'Practiced 3 days in a row'                  },
  { id: 'streak_7',          emoji: '📅', name: 'Week Warrior',        description: 'Practiced 7 days in a row'                  },
  { id: 'streak_30',         emoji: '🌟', name: 'Monthly Champion',    description: 'Practiced 30 days in a row'                 },
  { id: 'daily_learner',     emoji: '☀️', name: 'Daily Learner',       description: 'Completed a full practice session today'    },
];

const defaultState = (): RewardsState => ({
  points: 0,
  badges: [],
  streakDays: 0,
  lastSessionDate: '',
  totalSessions: 0,
});

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ── Hook ──────────────────────────────────────────────────────────

export function useRewards() {
  const { db, user } = useFirebase();
  const [rewards, setRewards] = useState<RewardsState>(defaultState());
  const [loading, setLoading] = useState(true);
  // Track per-game counters locally for badge triggers (not persisted between page loads)
  const [sessionCarryCorrect, setSessionCarryCorrect] = useState(0);
  const [sessionBorrowCorrect, setSessionBorrowCorrect] = useState(0);

  // ── Load from Firestore ────────────────────────────────────────
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDoc(doc(db, 'users', user.uid, 'rewards', 'current'))
      .then(snap => {
        if (snap.exists()) setRewards(snap.data() as RewardsState);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, db]);

  // ── Save helper ───────────────────────────────────────────────
  const save = useCallback((updated: RewardsState) => {
    setRewards(updated);
    if (!user) return;
    setDoc(doc(db, 'users', user.uid, 'rewards', 'current'), updated, { merge: true })
      .catch(console.error);
  }, [user, db]);

  // ── Award points ──────────────────────────────────────────────
  const awardPoints = useCallback((pts: number) => {
    setRewards(prev => {
      const updated = { ...prev, points: prev.points + pts };
      if (user) {
        setDoc(doc(db, 'users', user.uid, 'rewards', 'current'), updated, { merge: true })
          .catch(console.error);
      }
      return updated;
    });
  }, [user, db]);

  // ── Award badge (idempotent) ───────────────────────────────────
  const awardBadge = useCallback((badgeId: string) => {
    const meta = ALL_BADGES.find(b => b.id === badgeId);
    if (!meta) return;

    setRewards(prev => {
      if (prev.badges.some(b => b.id === badgeId)) return prev; // already earned
      const newBadge: Badge = { ...meta, earnedAt: new Date().toISOString() };
      const updated = {
        ...prev,
        badges: [...prev.badges, newBadge],
        points: prev.points + 100, // 100 pts per badge
      };
      if (user) {
        setDoc(doc(db, 'users', user.uid, 'rewards', 'current'), updated, { merge: true })
          .catch(console.error);
      }
      return updated;
    });
  }, [user, db]);

  // ── Record a correct answer ───────────────────────────────────
  // type: 'carry' | 'borrow' | 'math' | 'english'
  const recordCorrect = useCallback((type: string, newLevel?: number) => {
    // +10 per correct answer
    awardPoints(10);

    // First-ever problem badge
    setRewards(prev => {
      if (prev.badges.some(b => b.id === 'first_steps')) return prev;
      // will be awarded on next render via awardBadge — call it separately
      return prev;
    });
    awardBadge('first_steps');

    // Century club
    setRewards(prev => {
      const newTotal = prev.points + 10; // approximate
      if (newTotal >= 1000 && !prev.badges.some(b => b.id === 'century_club')) {
        awardBadge('century_club');
      }
      return prev;
    });

    // Carry / Borrow streaks
    if (type === 'carry') {
      setSessionCarryCorrect(n => {
        const next = n + 1;
        if (next >= 10) awardBadge('carry_champion');
        return next;
      });
    }
    if (type === 'borrow') {
      setSessionBorrowCorrect(n => {
        const next = n + 1;
        if (next >= 10) awardBadge('borrow_boss');
        return next;
      });
    }

    // Level-up badges
    if (newLevel === 2) { awardBadge('math_level_2'); awardPoints(50); }
    if (newLevel === 3) { awardBadge('math_level_3'); awardPoints(50); }
    if (newLevel === 4) { awardBadge('math_level_4'); awardPoints(50); }
    if (newLevel === 5) { awardBadge('math_master');  awardPoints(100); }
  }, [awardPoints, awardBadge]);

  // ── Log a completed session ────────────────────────────────────
  const logSession = useCallback(async (log: SessionLog) => {
    if (!user) return;

    // Update streak
    setRewards(prev => {
      const today = todayStr();
      const isNewDay = prev.lastSessionDate !== today;
      if (!isNewDay) return prev; // already logged today

      const wasYesterday = prev.lastSessionDate === yesterday();
      const newStreak = wasYesterday ? prev.streakDays + 1 : 1;
      const newSessions = prev.totalSessions + 1;

      const updated: RewardsState = {
        ...prev,
        streakDays: newStreak,
        lastSessionDate: today,
        totalSessions: newSessions,
      };
      save(updated);

      // Streak badges
      if (newStreak >= 3)  awardBadge('streak_3');
      if (newStreak >= 7)  awardBadge('streak_7');
      if (newStreak >= 30) awardBadge('streak_30');
      awardBadge('daily_learner');

      return updated;
    });

    // Write to sessions collection
    try {
      await addDoc(collection(db, 'users', user.uid, 'sessions'), {
        ...log,
        date: todayStr(),
        createdAt: serverTimestamp(),
      });
    } catch { /* silent — Firestore rules */ }
  }, [user, db, save, awardBadge]);

  // Start a 7-day free trial — one per account, guarded by trialStartedAt presence
  const startTrial = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'not_signed_in' };
    try {
      const ref = doc(db, 'users', user.uid, 'rewards', 'current');
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()?.trialStartedAt) {
        return { success: false, error: 'trial_already_used' };
      }
      const trialStart = new Date();
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + 7);
      await setDoc(ref, {
        trialStartedAt: trialStart.toISOString(),
        trialEndsAt: trialEnd.toISOString(),
        subscriptionStatus: 'trial',
      }, { merge: true });
      return { success: true };
    } catch {
      return { success: false, error: 'write_failed' };
    }
  }, [user, db]);

  return {
    rewards,
    loading,
    awardPoints,
    awardBadge,
    recordCorrect,
    logSession,
    startTrial,
    sessionCarryCorrect,
    sessionBorrowCorrect,
  };
}
