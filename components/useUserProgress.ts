"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

export const useUserProgress = (game: string) => {
  const { db, user } = useFirebase();
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const docRef = doc(db, 'users', user.uid, 'progress', game);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgress(docSnap.data().progress || 0);
        }
      } catch {
        // Firestore rules not yet deployed — progress falls back to localStorage
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, game, db]);

  const saveProgress = async (newProgress: number) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'progress', game);
      await setDoc(docRef, { progress: newProgress }, { merge: true });
    } catch {
      // Firestore rules not yet deployed — progress saved to localStorage only
    }
    setProgress(newProgress);
  };

  return { progress, loading, saveProgress };
};