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
        <h2 className="text-[35px] font-light text-white">Not signed in</h2>
        <p className="text-[#6b6b6b] font-light">Please sign in to view your profile.</p>
        <Link href="/" className="ps-btn">← Back to Hub</Link>
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
      </div>
    </div>
  );
}
