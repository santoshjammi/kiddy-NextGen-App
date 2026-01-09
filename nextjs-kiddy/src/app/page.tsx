'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { AppCard } from '@/components/AppCard';
import { Footer } from '@/components/Footer';
import { learningApps } from '@/lib/learningApps';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <Header />

      <div className="apps-grid">
        {learningApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      <div className="text-center mb-8">
        {user ? (
          <Link href="/dashboard">
            <button className="app-button">
              📊 View My Progress Dashboard
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button className="app-button">
              🔐 Sign In to Track Progress
            </button>
          </Link>
        )}
      </div>

      <Footer />
    </div>
  );
}
