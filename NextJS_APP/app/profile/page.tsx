'use client';

import Link from 'next/link';
import { useFirebase } from '../../components/FirebaseProvider';

export default function ProfilePage() {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-8">
        <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
             style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
          <div className="text-5xl mb-5">📚</div>
          <h2 className="text-[28px] font-light text-black mb-3">Save Your Progress</h2>
          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
            All games are free to play without signing in.
            Sign in with Google to sync your progress across devices and track your learning journey.
          </p>
          <Link href="/" className="block ps-btn mb-3 text-center">
            Continue Playing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="bg-white rounded-[24px] p-10 max-w-md w-full text-center"
           style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>
        {user.photoURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer"
               className="w-20 h-20 rounded-full mx-auto mb-5" style={{ boxShadow: 'rgba(0,0,0,0.16) 0 5px 9px 0' }} />
        )}
        <h2 className="text-[35px] font-light text-black mb-1">{user.displayName || 'Learner'}</h2>
        <p className="text-[#6b6b6b] mb-8 font-light">{user.email}</p>
        <Link href="/" className="ps-btn">← Back to Hub</Link>
        <Link href="/community" className="block ps-btn ps-btn-ghost mt-3">💬 Community</Link>
      </div>
    </div>
  );
}
