'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Star, Play } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Kiddy Learning Hub</h1>
            </div>
            <Link
              href="/login"
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Welcome to Kiddy Learning Hub
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            An interactive educational platform designed for children aged 3-6.
            Learn through fun, engaging games that make education exciting and enjoyable.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Learning Now
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
            <p className="text-purple-100">
              Engaging games and activities designed to make learning fun and effective for young children.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Personalized Progress</h3>
            <p className="text-purple-100">
              Track your child's learning journey with detailed progress reports and achievements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Age-Appropriate Content</h3>
            <p className="text-purple-100">
              Carefully crafted content suitable for children aged 3-6, promoting healthy development.
            </p>
          </div>
        </div>

        {/* Learning Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            What Your Child Will Learn
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 mb-4">
                <span className="text-4xl">🔤</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Alphabet</h4>
              <p className="text-purple-100">Learn letters A-Z with fun words and pictures</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 mb-4">
                <span className="text-4xl">🔢</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Numbers</h4>
              <p className="text-purple-100">Count from 1-10 with visual learning aids</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 mb-4">
                <span className="text-4xl">🔺</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Shapes</h4>
              <p className="text-purple-100">Recognize and learn about different shapes</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-xl p-6 mb-4">
                <span className="text-4xl">🌈</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Colors</h4>
              <p className="text-purple-100">Explore the world of colors and their names</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-xl text-purple-100 mb-8">
            Create a free account and give your child the gift of knowledge
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <Star className="h-5 w-5 mr-2" />
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">Kiddy Learning Hub</span>
            </div>
            <p className="text-purple-200 text-sm">
              © 2024 Kiddy Learning Hub. Making education fun for every child.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
