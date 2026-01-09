'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphabetPage() {
  const { user } = useAuth();
  const [currentLetter, setCurrentLetter] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Load progress from localStorage for demo purposes
    // In a real app, this would come from Firestore
    const saved = localStorage.getItem('alphabet-progress');
    if (saved) {
      const progress = parseInt(saved);
      setCurrentLetter(progress);
      setCompleted(progress >= alphabet.length);
    }
  }, []);

  const handleNext = async () => {
    if (currentLetter < alphabet.length - 1) {
      const nextLetter = currentLetter + 1;
      setCurrentLetter(nextLetter);

      // Save to localStorage for demo
      localStorage.setItem('alphabet-progress', nextLetter.toString());

      // Save to Firestore if user is logged in
      if (user) {
        try {
          await saveProgress(user.uid, 'alphabet', nextLetter, alphabet.length);
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      if (nextLetter >= alphabet.length - 1) {
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

  return (
    <div className="container">
      <header className="header">
        <h1 className="main-title">🔤 ABC Letters Learning</h1>
        <nav className="text-center">
          <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="app-card">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">{alphabet[currentLetter]}</div>
            <div className="text-2xl text-gray-600 mb-2">
              {alphabet[currentLetter]} says "{getPhoneticSound(alphabet[currentLetter])}"
            </div>
            <div className="text-sm text-gray-500">
              Letter {currentLetter + 1} of {alphabet.length}
            </div>
          </div>

          <div className="progress-bar mb-6">
            <div
              className="progress-fill"
              style={{ width: `${((currentLetter + 1) / alphabet.length) * 100}%` }}
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
                <p className="text-gray-600 mb-4">You've learned all the letters!</p>
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

function getPhoneticSound(letter: string): string {
  const sounds: Record<string, string> = {
    'A': 'Ah',
    'B': 'Buh',
    'C': 'Kuh',
    'D': 'Duh',
    'E': 'Eh',
    'F': 'Fuh',
    'G': 'Guh',
    'H': 'Huh',
    'I': 'Ih',
    'J': 'Juh',
    'K': 'Kuh',
    'L': 'Luh',
    'M': 'Muh',
    'N': 'Nuh',
    'O': 'Oh',
    'P': 'Puh',
    'Q': 'Koo',
    'R': 'Ruh',
    'S': 'Suh',
    'T': 'Tuh',
    'U': 'Uh',
    'V': 'Vuh',
    'W': 'Wuh',
    'X': 'Eks',
    'Y': 'Why',
    'Z': 'Zee',
  };
  return sounds[letter] || letter.toLowerCase();
}