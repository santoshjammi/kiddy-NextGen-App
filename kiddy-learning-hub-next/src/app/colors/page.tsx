'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const colors = [
  { name: 'Red', hex: '#FF0000', description: 'The color of apples and roses' },
  { name: 'Orange', hex: '#FFA500', description: 'The color of carrots and pumpkins' },
  { name: 'Yellow', hex: '#FFFF00', description: 'The color of the sun and bananas' },
  { name: 'Green', hex: '#008000', description: 'The color of grass and leaves' },
  { name: 'Blue', hex: '#0000FF', description: 'The color of the sky and ocean' },
  { name: 'Purple', hex: '#800080', description: 'The color of grapes and eggplants' },
  { name: 'Pink', hex: '#FFC0CB', description: 'The color of flowers and cotton candy' },
  { name: 'Brown', hex: '#A52A2A', description: 'The color of chocolate and trees' },
  { name: 'Black', hex: '#000000', description: 'The darkest color, like night' },
  { name: 'White', hex: '#FFFFFF', description: 'The lightest color, like clouds' },
];

export default function ColorsPage() {
  const { user } = useAuth();
  const [currentColor, setCurrentColor] = useState(() => {
    // Initialize with saved progress
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colors-progress');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [completed, setCompleted] = useState(() => {
    // Initialize completed state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colors-progress');
      return saved ? parseInt(saved) >= colors.length : false;
    }
    return false;
  });

  const handleNext = async () => {
    if (currentColor < colors.length - 1) {
      const nextColor = currentColor + 1;
      setCurrentColor(nextColor);

      // Save to localStorage for demo
      localStorage.setItem('colors-progress', nextColor.toString());

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await saveProgress(user.uid, 'colors', nextColor, colors.length);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      if (nextColor >= colors.length - 1) {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentColor > 0) {
      const prevColor = currentColor - 1;
      setCurrentColor(prevColor);
      localStorage.setItem('colors-progress', prevColor.toString());
    }
  };

  const resetProgress = () => {
    setCurrentColor(0);
    setCompleted(false);
    localStorage.removeItem('colors-progress');
  };

  const current = colors[currentColor];

  return (
    <ProtectedRoute>
      <div className="container">
        <header className="header">
          <h1 className="main-title">🎨 Color Explorer</h1>
          <nav className="text-center">
            <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="app-card">
            <div className="text-center mb-6">
              <div
                className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-white shadow-lg"
                style={{ backgroundColor: current.hex }}
              ></div>
              <div className="text-3xl font-bold mb-2" style={{ color: current.hex }}>
                {current.name}
              </div>
              <div className="text-lg text-gray-600 mb-4">{current.description}</div>
              <div className="text-sm text-gray-500">
                Color {currentColor + 1} of {colors.length}
              </div>
            </div>

            <div className="progress-bar mb-6">
              <div
                className="progress-fill"
                style={{ width: `${((currentColor + 1) / colors.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentColor === 0}
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
                  <p className="text-gray-600 mb-4">You&apos;ve explored all the colors!</p>
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