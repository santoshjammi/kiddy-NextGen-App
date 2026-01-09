'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLearningPaths, getUserProfile, LearningPath, UserProfile } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [paths, profile] = await Promise.all([
        getLearningPaths(user.uid),
        getUserProfile(user.uid),
      ]);

      setLearningPaths(paths);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container">
          <div className="text-center mt-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-white">Loading your progress...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container">
        <header className="header">
          <h1 className="main-title">📊 My Learning Dashboard</h1>
          <p className="subtitle">Welcome back, {userProfile?.name || user?.email}!</p>
        </header>

        <div className="app-card mb-6">
          <h2 className="app-title">🎯 Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {userProfile?.totalPoints || 0}
              </div>
              <div className="text-sm text-gray-600">Total Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {learningPaths.filter(p => p.isCompleted).length}
              </div>
              <div className="text-sm text-gray-600">Learning Paths Completed</div>
            </div>
          </div>
        </div>

        <div className="apps-grid">
          {learningPaths.map((path) => (
            <div key={path.id} className="app-card">
              <div className="app-icon">
                {path.id === 'alphabet' && '🔤'}
                {path.id === 'numbers' && '🔢'}
                {path.id === 'shapes' && '🔺'}
                {path.id === 'colors' && '🎨'}
              </div>
              <h2 className="app-title">{path.title}</h2>

              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-2">
                  Progress: {path.currentStep} / {path.totalSteps}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(path.currentStep / path.totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Last accessed: {path.lastAccessed.toLocaleDateString()}
              </div>

              <Link href={`/${path.id}`}>
                <button className="app-button">
                  {path.isCompleted ? '🎉 Review' : 'Continue Learning'}
                </button>
              </Link>
            </div>
          ))}

          {learningPaths.length === 0 && (
            <div className="app-card col-span-full">
              <div className="app-icon">🚀</div>
              <h2 className="app-title">Ready to Start Learning?</h2>
              <p className="app-description">
                You haven't started any learning paths yet. Choose a game below to begin your educational journey!
              </p>
              <Link href="/">
                <button className="app-button">Explore Games</button>
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={logout}
            className="app-button bg-red-500 hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}