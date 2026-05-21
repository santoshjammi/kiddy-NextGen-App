"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firestore';

// isPremium is stored in and read from the rewards/current subcollection
// (same path used by useRewards) so it is covered by existing Firestore rules.
// Reading the root users/{uid} document requires a separate rule that many
// projects omit — keeping it in the subcollection avoids permission errors.

interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  user: null,
  loading: true,
  isPremium: false,
  isTrial: false,
  trialDaysLeft: 0,
});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Keep isPremium + trial status in sync
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setIsTrial(false);
      setTrialDaysLeft(0);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'rewards', 'current');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setIsPremium(false);
          setIsTrial(false);
          setTrialDaysLeft(0);
          return;
        }
        const data = snap.data();
        const paid = data?.isPremium === true;
        const trialEndsAt: string = data?.trialEndsAt ?? '';
        const now = new Date();
        const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null;
        const trialActive = !paid && trialEnd !== null && trialEnd > now;
        const daysLeft = trialActive
          ? Math.max(1, Math.ceil((trialEnd!.getTime() - now.getTime()) / 86400000))
          : 0;
        setIsPremium(paid || trialActive);
        setIsTrial(trialActive);
        setTrialDaysLeft(daysLeft);
      },
      () => { setIsPremium(false); setIsTrial(false); setTrialDaysLeft(0); },
    );
    return () => unsub();
  }, [user]);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading, isPremium, isTrial, trialDaysLeft }}>
      {children}
    </FirebaseContext.Provider>
  );
};