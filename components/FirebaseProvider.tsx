"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firestore';

interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  user: null,
  loading: true,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};