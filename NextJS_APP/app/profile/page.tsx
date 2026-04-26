'use client';

import Link from 'next/link';
import { useFirebase } from '../../components/FirebaseProvider';

export default function ProfilePage() {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-2xl font-semibold text-gray-800">Not signed in</h2>
        <p className="text-gray-500">Please sign in to view your profile.</p>
        <Link href="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full transition-colors">
          ← Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {user.photoURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md" />
        )}
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.displayName || 'Learner'}</h2>
        <p className="text-gray-500 mb-6">{user.email}</p>
        <Link href="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full transition-colors">
          ← Back to Hub
        </Link>
      </div>
    </div>
  );
}
