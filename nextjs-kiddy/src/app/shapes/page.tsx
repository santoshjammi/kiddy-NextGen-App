'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';

const shapes = [
  { name: 'Circle', icon: '⭕', description: 'A round shape with no corners' },
  { name: 'Square', icon: '⬜', description: 'A shape with four equal sides and four right angles' },
  { name: 'Triangle', icon: '🔺', description: 'A shape with three sides and three angles' },
  { name: 'Rectangle', icon: '⬛', description: 'A shape with four sides, opposite sides equal and parallel' },
  { name: 'Oval', icon: '🥚', description: 'A stretched circle, longer than it is wide' },
  { name: 'Diamond', icon: '💎', description: 'A shape with four equal sides, like a tilted square' },
  { name: 'Star', icon: '⭐', description: 'A shape with five points, like the night sky' },
  { name: 'Heart', icon: '❤️', description: 'A shape that looks like a valentine' },
  { name: 'Hexagon', icon: '⬡', description: 'A shape with six sides and six angles' },
  { name: 'Pentagon', icon: '⬟', description: 'A shape with five sides and five angles' },
];

export default function ShapesPage() {
  const { user } = useAuth();
  const [currentShape, setCurrentShape] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Load progress from localStorage for demo purposes
    const saved = localStorage.getItem('shapes-progress');
    if (saved) {
      const progress = parseInt(saved);
      setCurrentShape(progress);
      setCompleted(progress >= shapes.length);
    }
  }, []);

  const handleNext = async () => {
    if (currentShape < shapes.length - 1) {
      const nextShape = currentShape + 1;
      setCurrentShape(nextShape);

      // Save to localStorage for demo
      localStorage.setItem('shapes-progress', nextShape.toString());

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await saveProgress(user.uid, 'shapes', nextShape, shapes.length);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      if (nextShape >= shapes.length - 1) {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentShape > 0) {
      const prevShape = currentShape - 1;
      setCurrentShape(prevShape);
      localStorage.setItem('shapes-progress', prevShape.toString());
    }
  };

  const resetProgress = () => {
    setCurrentShape(0);
    setCompleted(false);
    localStorage.removeItem('shapes-progress');
  };

  const current = shapes[currentShape];

  return (
    <div className="container">
      <header className="header">
        <h1 className="main-title">🔺 Shape Explorer</h1>
        <nav className="text-center">
          <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="app-card">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">{current.icon}</div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{current.name}</div>
            <div className="text-lg text-gray-600 mb-4">{current.description}</div>
            <div className="text-sm text-gray-500">
              Shape {currentShape + 1} of {shapes.length}
            </div>
          </div>

          <div className="progress-bar mb-6">
            <div
              className="progress-fill"
              style={{ width: `${((currentShape + 1) / shapes.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentShape === 0}
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
                <p className="text-gray-600 mb-4">You've explored all the shapes!</p>
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
  );
}