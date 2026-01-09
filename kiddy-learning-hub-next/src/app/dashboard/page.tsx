'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLearningPaths, getUserProfile, LearningPath, UserProfile } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';
import { learningApps } from '@/lib/learningApps';

export default function Dashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const [profile, paths] = await Promise.all([
        getUserProfile(user.uid),
        getLearningPaths(user.uid),
      ]);

      setUserProfile(profile);
      setLearningPaths(paths);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container">
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link href="/" className="text-white hover:text-yellow-300 mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="main-title">Your Learning Dashboard 📊</h1>
              <p className="subtitle">
                Welcome back, {userProfile?.name || user?.email}!
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="app-card text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-purple-600">
                  {userProfile?.totalPoints || 0}
                </div>
                <div className="text-gray-600">Total Points</div>
              </div>

              <div className="app-card text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-green-600">
                  {learningPaths.filter(path => path.isCompleted).length}
                </div>
                <div className="text-gray-600">Completed Games</div>
              </div>

              <div className="app-card text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-blue-600">
                  {learningPaths.length}
                </div>
                <div className="text-gray-600">Games Started</div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Learning Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningApps.map((app) => {
                  const path = learningPaths.find(p => p.id === app.id);
                  const progress = path ? (path.currentStep / path.totalSteps) * 100 : 0;

                  return (
                    <div key={app.id} className="app-card">
                      <div className="flex items-center mb-4">
                        <div className="text-3xl mr-4">{app.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{app.title}</h3>
                          <p className="text-gray-600 text-sm">{app.description}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>
                            {path ? `${path.currentStep}/${path.totalSteps}` : '0/0'}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link href={app.path}>
                        <button className="w-full app-button">
                          {path ? 'Continue Learning' : 'Start Learning'}
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements 🏆</h2>
              <div className="app-card">
                {learningPaths.filter(path => path.isCompleted).length > 0 ? (
                  <div className="space-y-4">
                    {learningPaths
                      .filter(path => path.isCompleted)
                      .map((path) => (
                        <div key={path.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">🎉</div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                Completed {path.title}!
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(path.lastAccessed).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-green-600 font-bold">
                            +{path.totalSteps * 10} points
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-600">
                      Complete your first learning game to earn achievements!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}