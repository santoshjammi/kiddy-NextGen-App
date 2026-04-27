"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firestore';

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

  // Keep isPremium in sync with users/{uid}.isPremium in Firestore
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      return;
    }
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setIsPremium(snap.exists() ? (snap.data()?.isPremium === true) : false);
    });
    return () => unsub();
  }, [user]);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading, isPremium }}>
      {children}
    </FirebaseContext.Provider>
  );
};