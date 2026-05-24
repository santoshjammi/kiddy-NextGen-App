"use client";

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

export interface GameProgress {
  completedLevels: number;
  totalLevels: number;
  percentage: number;
}

const GAME_CONFIGS: Record<string, { total: number }> = {
  alphabet: { total: 26 },
  numbers: { total: 200 },
  shapes: { total: 9 },
  colors: { total: 12 },
  math: { total: 5 },
  english: { total: 4 },
  'carry-borrow': { total: 5 },
  'memory-match': { total: 8 },
  spelling: { total: 15 },
  rhyming: { total: 15 },
  patterns: { total: 15 },
  'sight-words': { total: 90 },
  counting: { total: 10 },
  animals: { total: 12 },
  sentences: { total: 15 },
  time: { total: 12 },
  tracing: { total: 26 },
  'missing-letter': { total: 3 },
  'letter-fishing': { total: 26 },
  'multiplication-race': { total: 5 },
  'division-splitter': { total: 5 },
  'dino-treasure-hunt': { total: 4 },
  paint: { total: 1 },
};

const MILESTONES = [25, 50, 75, 100];

export function useGameCompletion() {
  const { db, user } = useFirebase();
  const [allProgress, setAllProgress] = useState<Record<string, GameProgress>>({});
  const [loading, setLoading] = useState(true);
  const [milestoneQueue, setMilestoneQueue] = useState<Array<{ game: string; percentage: number }>>([]);
  const [dismissedMilestones, setDismissedMilestones] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('kiddyGameCompletion');
    if (saved) {
      try {
        setAllProgress(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchAllProgress = async () => {
      const result: Record<string, GameProgress> = { ...allProgress };
      for (const gameId of Object.keys(GAME_CONFIGS)) {
        try {
          const docRef = doc(db, 'user_game_progress', `${user.uid}_${gameId}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as GameProgress;
            result[gameId] = data;
          }
        } catch { /* fallback to localStorage */ }
      }
      setAllProgress(result);
      localStorage.setItem('kiddyGameCompletion', JSON.stringify(result));
      setLoading(false);
    };
    fetchAllProgress();
  }, [user]);

  const getProgress = useCallback((gameId: string): GameProgress => {
    const config = GAME_CONFIGS[gameId];
    if (!config) return { completedLevels: 0, totalLevels: 0, percentage: 0 };

    const progress = allProgress[gameId];
    if (progress) return progress;

    const localStorageKey = `kiddyHub_${gameId}Completed`;
    try {
      const saved = localStorage.getItem(localStorageKey);
      const completed = saved ? JSON.parse(saved).length : 0;
      const percentage = Math.round((completed / config.total) * 100);
      return { completedLevels: completed, totalLevels: config.total, percentage };
    } catch {
      return { completedLevels: 0, totalLevels: config.total, percentage: 0 };
    }
  }, [allProgress]);

  const updateProgress = useCallback(async (gameId: string, completed: number) => {
    const config = GAME_CONFIGS[gameId];
    if (!config) return;

    const percentage = Math.round((completed / config.total) * 100);
    const progress: GameProgress = { completedLevels: completed, totalLevels: config.total, percentage };

    setAllProgress(prev => {
      const next = { ...prev, [gameId]: progress };
      localStorage.setItem('kiddyGameCompletion', JSON.stringify(next));

      const prevPct = prev[gameId]?.percentage ?? 0;
      for (const m of MILESTONES) {
        if (prevPct < m && percentage >= m) {
          setMilestoneQueue(q => [...q, { game: gameId, percentage: m }]);
        }
      }

      return next;
    });

    if (user) {
      try {
        const docRef = doc(db, 'user_game_progress', `${user.uid}_${gameId}`);
        await setDoc(docRef, progress, { merge: true });
      } catch { /* Firestore rules may not allow */ }
    }
  }, [user, db]);

  const dismissMilestone = useCallback((game: string, percentage: number) => {
    const key = `${game}_${percentage}`;
    setDismissedMilestones(prev => new Set(prev).add(key));
    setMilestoneQueue(q => q.filter(m => !(m.game === game && m.percentage === percentage)));
  }, []);

  const getActiveMilestones = useCallback(() => {
    return milestoneQueue.filter(m => {
      const key = `${m.game}_${m.percentage}`;
      return !dismissedMilestones.has(key);
    });
  }, [milestoneQueue, dismissedMilestones]);

  return {
    allProgress,
    loading,
    getProgress,
    updateProgress,
    getActiveMilestones,
    dismissMilestone,
    GAME_CONFIGS,
  };
}