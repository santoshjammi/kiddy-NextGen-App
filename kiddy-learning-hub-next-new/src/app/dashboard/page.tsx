'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLearningPaths, getUserProfile, LearningPath, UserProfile } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
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

  const getProgressPercentage = (path: LearningPath) => {
    return Math.round((path.currentStep / path.totalSteps) * 100);
  };

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* User Profile Section */}
          <div className="app-card mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">👤</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {userProfile?.name || user?.displayName || 'Young Learner'}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    🏆 {userProfile?.totalPoints || 0} Points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Progress Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningApps.map((app) => {
                const path = learningPaths.find(p => p.id === app.id);
                const progress = path ? getProgressPercentage(path) : 0;
                
                return (
                  <Link key={app.id} href={app.path}>
                    <div className="app-card cursor-pointer hover:shadow-xl transition-all">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-4xl">{app.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">{app.title}</h3>
                          <p className="text-sm text-gray-600">{app.description}</p>
                        </div>
                      </div>
                      
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {path ? `${path.currentStep}/${path.totalSteps} completed` : 'Not started'}
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {progress}%
                        </span>
                      </div>
                      
                      {path?.isCompleted && (
                        <div className="mt-2 text-green-600 font-medium text-sm">
                          ✓ Completed!
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="app-card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {learningApps.map((app) => {
                const path = learningPaths.find(p => p.id === app.id);
                const isCompleted = path?.isCompleted;
                
                return (
                  <div 
                    key={app.id}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      isCompleted 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{isCompleted ? '🏆' : '🔒'}</div>
                    <p className="text-xs font-medium text-gray-700">
                      {app.title} Master
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link href="/">
              <button className="app-button">
                ← Back to Learning Hub
              </button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
