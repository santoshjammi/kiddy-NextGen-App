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
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  user: null,
  loading: true,
  isPremium: false,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Keep isPremium in sync — read from users/{uid}/rewards/current which is
  // already covered by existing security rules (instead of the root doc).
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      return;
    }
    const ref = doc(db, 'users', user.uid, 'rewards', 'current');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setIsPremium(snap.exists() ? (snap.data()?.isPremium === true) : false);
      },
      () => setIsPremium(false), // permission-denied → safe default
    );
    return () => unsub();
  }, [user]);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading, isPremium }}>
      {children}
    </FirebaseContext.Provider>
  );
};