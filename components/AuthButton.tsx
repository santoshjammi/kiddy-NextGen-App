"use client";

import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useFirebase } from './FirebaseProvider';

export default function AuthButton() {
  const { auth, user, loading } = useFirebase();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return <button className="btn">Loading…</button>;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.email}</span>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded"
      onClick={handleSignIn}
    >
      Sign in with Google
    </button>
  );
}
