'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import Link from 'next/link';

const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

export default function NumbersPage() {
  const { user } = useAuth();
  const [currentNumber, setCurrentNumber] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Load progress from localStorage for demo purposes
    const saved = localStorage.getItem('numbers-progress');
    if (saved) {
      const progress = parseInt(saved);
      setCurrentNumber(progress);
      setCompleted(progress >= numbers.length);
    }
  }, []);

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

  const getNumberWord = (num: number): string => {
    const words = [
      'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
      'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
      'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty',
      'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine', 'fifty',
      'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty',
      'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine', 'seventy',
      'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine', 'eighty',
      'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine', 'ninety',
      'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine', 'one hundred'
    ];
    return words[num] || num.toString();
  };

  const renderDots = (num: number) => {
    if (num <= 20) {
      return (
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {Array.from({ length: num }, (_, i) => (
            <div key={i} className="w-3 h-3 bg-purple-500 rounded-full"></div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="main-title">🔢 Numbers 1-100 Fun</h1>
        <nav className="text-center">
          <Link href="/" className="text-white hover:text-yellow-300">← Back to Home</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="app-card">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 font-bold text-purple-600">{numbers[currentNumber]}</div>
            <div className="text-2xl text-gray-600 mb-2">
              "{getNumberWord(numbers[currentNumber])}"
            </div>
            <div className="text-sm text-gray-500">
              Number {currentNumber + 1} of {numbers.length}
            </div>
          </div>

          {renderDots(numbers[currentNumber])}

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
                <p className="text-gray-600 mb-4">You've learned all the numbers!</p>
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