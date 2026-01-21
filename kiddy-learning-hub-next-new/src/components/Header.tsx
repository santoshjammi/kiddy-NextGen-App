'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="text-white shadow-lg h-16" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="text-2xl font-bold hover:text-yellow-300 transition-colors">
            🎓 Kiddy Learning Hub
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-yellow-300 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}