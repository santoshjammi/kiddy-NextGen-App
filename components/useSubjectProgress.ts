"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

// Shared learning progression types (used by math and english engines)
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface SubjectProgress {
  subject: string;
  current_topic: string;
  difficulty_level: DifficultyLevel;
  mastery_score: number;         // 0–100. Reaches 90 → auto level-up
  total_problems_solved: number;
  recent_struggles: string[];    // Last 5 struggle tags
  last_played: string;           // ISO timestamp
}

const defaultProgress = (subject: string): SubjectProgress => ({
  subject,
  current_topic: subject === 'mathematics' ? 'addition' : 'sight-words',
  difficulty_level: 1,
  mastery_score: 0,
  total_problems_solved: 0,
  recent_struggles: [],
  last_played: new Date().toISOString(),
});

export function useSubjectProgress(subject: string) {
  const { db, user } = useFirebase();
  const [progress, setProgress] = useState<SubjectProgress>(defaultProgress(subject));
  const [loading, setLoading] = useState(true);

  // One-time load from Firestore on mount / user change
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const docRef = doc(db, 'users', user.uid, 'progress', subject);
    getDoc(docRef).then((snap) => {
      if (snap.exists()) setProgress(snap.data() as SubjectProgress);
      setLoading(false);
    });
  }, [user, subject, db]);

  /**
   * Call after each problem attempt. Updates local state immediately
   * and writes to Firestore asynchronously.
   * Optionally pass a struggle tag (e.g. 'regrouping_tens').
   */
  const recordSolve = async (correct: boolean, struggle?: string) => {
    setProgress((prev) => {
      const newMastery = correct
        ? Math.min(100, prev.mastery_score + 2)
        : Math.max(0, prev.mastery_score - 1);

      const newStruggles =
        struggle && !correct
          ? [...new Set([struggle, ...prev.recent_struggles])].slice(0, 5)
          : prev.recent_struggles;

      // Auto level-up when mastery reaches 90%
      const levelUp = newMastery >= 90 && prev.difficulty_level < 5;
      const newLevel: DifficultyLevel = levelUp
        ? ((prev.difficulty_level + 1) as DifficultyLevel)
        : prev.difficulty_level;

      const updated: SubjectProgress = {
        ...prev,
        mastery_score: levelUp ? 0 : newMastery, // reset on level-up
        difficulty_level: newLevel,
        total_problems_solved: prev.total_problems_solved + 1,
        recent_struggles: newStruggles,
        last_played: new Date().toISOString(),
      };

      // Async Firestore write — don't block UI
      if (user) {
        setDoc(doc(db, 'users', user.uid, 'progress', subject), updated, { merge: true }).catch(
          console.error
        );
      }

      return updated;
    });
  };

  return { progress, loading, recordSolve };
}
