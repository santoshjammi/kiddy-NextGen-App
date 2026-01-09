'use client';

import { Header } from '@/components/Header';
import { AppCard } from '@/components/AppCard';
import { Footer } from '@/components/Footer';
import { learningApps } from '@/lib/learningApps';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          {!user ? (
            // Not authenticated - show welcome and login prompt
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome to Kiddy Learning Hub! 🎓</h1>
              <p className="text-xl text-white mb-6 opacity-90">
                Interactive educational games designed for children ages 3-6
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Learning?</h2>
                <p className="text-white text-base mb-6 opacity-90">
                  Sign in to access our interactive learning games and track your progress!
                </p>
                <Link href="/login">
                  <button className="app-button text-lg px-8 py-4">
                    Get Started - Sign In
                  </button>
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Why Choose Kiddy Learning Hub?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="font-semibold text-lg mb-2">Interactive Learning</h3>
                    <p className="text-sm opacity-80">Fun games that make learning engaging</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
                    <p className="text-sm opacity-80">Monitor your child&apos;s learning journey</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="font-semibold text-lg mb-2">Achievement System</h3>
                    <p className="text-sm opacity-80">Celebrate milestones and success</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Authenticated - show learning apps
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome back, {user.displayName || user.email}! 🎓</h1>
              <p className="text-xl text-white opacity-90 mb-12">
                Choose a learning adventure to continue your educational journey
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                {learningApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>

              <Link href="/dashboard">
                <button className="app-button text-lg px-8 py-4">
                  View My Progress 📊
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
