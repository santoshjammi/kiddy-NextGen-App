'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const numbers = [
  { number: 1, word: 'One', dots: '•' },
  { number: 2, word: 'Two', dots: '• •' },
  { number: 3, word: 'Three', dots: '• • •' },
  { number: 4, word: 'Four', dots: '• •\n• •' },
  { number: 5, word: 'Five', dots: '• • •\n• •' },
  { number: 6, word: 'Six', dots: '• • •\n• • •' },
  { number: 7, word: 'Seven', dots: '• • •\n• • •\n•' },
  { number: 8, word: 'Eight', dots: '• • •\n• • •\n• •' },
  { number: 9, word: 'Nine', dots: '• • •\n• • •\n• • •' },
  { number: 10, word: 'Ten', dots: '• • • • •\n• • • • •' },
];

export default function NumbersPage() {
  const { user } = useAuth();
  const [currentNumber, setCurrentNumber] = useState(() => {
    // Initialize with saved progress
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('numbers-progress');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [completed, setCompleted] = useState(() => {
    // Initialize completed state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('numbers-progress');
      return saved ? parseInt(saved) >= numbers.length : false;
    }
    return false;
  });

  const handleNext = async () => {
    if (currentNumber < numbers.length - 1) {
      const nextNumber = currentNumber + 1;
      setCurrentNumber(nextNumber);

      // Save to localStorage for demo
      localStorage.setItem('numbers-progress', nextNumber.toString());

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await saveProgress(user.uid, 'numbers', nextNumber, numbers.length);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      if (nextNumber >= numbers.length - 1) {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentNumber > 0) {
      const prevNumber = currentNumber - 1;
      setCurrentNumber(prevNumber);
      localStorage.setItem('numbers-progress', prevNumber.toString());
    }
  };

  const resetProgress = () => {
    setCurrentNumber(0);
    setCompleted(false);
    localStorage.removeItem('numbers-progress');
  };

  const current = numbers[currentNumber];

  return (
    <ProtectedRoute>
      <div className="container">
        <header className="header">
          <h1 className="main-title">🔢 Number Explorer</h1>
          <nav className="text-center">
            <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="app-card">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4 font-bold text-green-600">{current.number}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{current.word}</div>
              <div className="text-4xl mb-4 font-mono text-gray-700 whitespace-pre-line">
                {current.dots}
              </div>
              <div className="text-sm text-gray-500">
                Number {currentNumber + 1} of {numbers.length}
              </div>
            </div>

            <div className="progress-bar mb-6">
              <div
                className="progress-fill"
                style={{ width: `${((currentNumber + 1) / numbers.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentNumber === 0}
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
                  <p className="text-gray-600 mb-4">You&apos;ve learned all the numbers!</p>
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