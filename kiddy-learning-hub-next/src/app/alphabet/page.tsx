'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const letters = [
  { letter: 'A', word: 'Apple', description: 'A red or green fruit that grows on trees' },
  { letter: 'B', word: 'Ball', description: 'A round object you can throw and catch' },
  { letter: 'C', word: 'Cat', description: 'A furry pet that says meow' },
  { letter: 'D', word: 'Dog', description: 'A loyal pet that says woof' },
  { letter: 'E', word: 'Elephant', description: 'A big gray animal with a long trunk' },
  { letter: 'F', word: 'Fish', description: 'An animal that lives in water and swims' },
  { letter: 'G', word: 'Giraffe', description: 'A tall animal with a long neck' },
  { letter: 'H', word: 'House', description: 'A place where people live' },
  { letter: 'I', word: 'Ice Cream', description: 'A sweet frozen treat' },
  { letter: 'J', word: 'Jump', description: 'What you do when you go up in the air' },
];

export default function AlphabetPage() {
  const { user } = useAuth();
  const [currentLetter, setCurrentLetter] = useState(() => {
    // Initialize with saved progress
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphabet-progress');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [completed, setCompleted] = useState(() => {
    // Initialize completed state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphabet-progress');
      return saved ? parseInt(saved) >= letters.length : false;
    }
    return false;
  });

  const handleNext = async () => {
    if (currentLetter < letters.length - 1) {
      const nextLetter = currentLetter + 1;
      setCurrentLetter(nextLetter);

      // Save to localStorage for demo
      localStorage.setItem('alphabet-progress', nextLetter.toString());

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await saveProgress(user.uid, 'alphabet', nextLetter, letters.length);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      if (nextLetter >= letters.length - 1) {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentLetter > 0) {
      const prevLetter = currentLetter - 1;
      setCurrentLetter(prevLetter);
      localStorage.setItem('alphabet-progress', prevLetter.toString());
    }
  };

  const resetProgress = () => {
    setCurrentLetter(0);
    setCompleted(false);
    localStorage.removeItem('alphabet-progress');
  };

  const current = letters[currentLetter];

  return (
    <ProtectedRoute>
      <div className="container">
        <header className="header">
          <h1 className="main-title">🔤 Alphabet Explorer</h1>
          <nav className="text-center">
            <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="app-card">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4 font-bold text-purple-600">{current.letter}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{current.word}</div>
              <div className="text-lg text-gray-600 mb-4">{current.description}</div>
              <div className="text-sm text-gray-500">
                Letter {currentLetter + 1} of {letters.length}
              </div>
            </div>

            <div className="progress-bar mb-6">
              <div
                className="progress-fill"
                style={{ width: `${((currentLetter + 1) / letters.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentLetter === 0}
                className="app-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <button
                onClick={resetProgress}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>

              {completed ? (
                <div className="text-center">
                  <div className="text-2xl mb-2">🎉 Congratulations!</div>
                  <p className="text-gray-600 mb-4">You&apos;ve learned all the letters!</p>
                  <Link href="/dashboard">
                    <button className="app-button">View Progress</button>
                  </Link>
                </div>
              ) : (
                <button onClick={handleNext} className="app-button">
                  Next →
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              {user ? 'Your progress is being saved!' : 'Sign in to save your progress'}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}