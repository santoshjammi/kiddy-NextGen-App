"use client";

import Link from 'next/link';
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

  if (loading) {
    return (
      <button disabled className="ps-btn ps-btn-sm" style={{ opacity: 0.5 }}>
        Loading…
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/profile" className="text-sm text-[#cccccc] hover:text-white transition-colors hidden md:block">
          {user.displayName ?? user.email}
        </Link>
        <button className="ps-btn ps-btn-sm" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button className="ps-btn ps-btn-sm" onClick={handleSignIn}>
      Sign in with Google
    </button>
  );
}
