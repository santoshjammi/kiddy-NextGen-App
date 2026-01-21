'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Volume2, CheckCircle } from 'lucide-react';

const numbers = [
  { number: 1, word: 'One', items: '🍎', description: 'A single apple' },
  { number: 2, word: 'Two', items: '🍎🍎', description: 'Two red apples' },
  { number: 3, word: 'Three', items: '🍎🍎🍎', description: 'Three juicy apples' },
  { number: 4, word: 'Four', items: '🍎🍎🍎🍎', description: 'Four tasty apples' },
  { number: 5, word: 'Five', items: '🍎🍎🍎🍎🍎', description: 'Five delicious apples' },
  { number: 6, word: 'Six', items: '🍎🍎🍎🍎🍎🍎', description: 'Six sweet apples' },
  { number: 7, word: 'Seven', items: '🍎🍎🍎🍎🍎🍎🍎', description: 'Seven fresh apples' },
  { number: 8, word: 'Eight', items: '🍎🍎🍎🍎🍎🍎🍎🍎', description: 'Eight shiny apples' },
  { number: 9, word: 'Nine', items: '🍎��🍎🍎🍎🍎🍎🍎🍎', description: 'Nine perfect apples' },
  { number: 10, word: 'Ten', items: '🍎🍎🍎��🍎🍎🍎🍎🍎🍎', description: 'Ten amazing apples' },
];

export default function NumbersPage() {
  const { user } = useAuth();
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('numbers-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [speaking, setSpeaking] = useState<number | null>(null);

  useEffect(() => {
    // Save completed numbers to localStorage
    localStorage.setItem('numbers-completed', JSON.stringify([...completedNumbers]));
    
    // Save overall progress to Firestore
    if (user && completedNumbers.size > 0) {
      saveProgress(user.uid, 'numbers', completedNumbers.size, numbers.length).catch(console.error);
    }
  }, [completedNumbers, user]);

  const speakText = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      setSpeaking(index);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for children
      utterance.pitch = 1.2; // Higher pitch for children
      
      utterance.onend = () => {
        setSpeaking(null);
        // Mark as completed when spoken
        setCompletedNumbers(prev => new Set([...prev, index]));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakNumberAndWord = (number: number, word: string, index: number) => {
    const text = `${number}. ${word}`;
    speakText(text, index);
  };

  const isCompleted = completedNumbers.size === numbers.length;

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🔢 Learn Numbers 1-10</h1>
            <p className="text-blue-100 text-lg">Click on any number to hear it pronounced!</p>
            
            {/* Progress */}
            <div className="mt-4 bg-white/20 rounded-full px-6 py-3 inline-block">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  {completedNumbers.size} / {numbers.length} numbers learned
                </span>
              </div>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {numbers.map((item, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer transition-all transform hover:scale-105 hover:bg-white/20 ${
                  completedNumbers.has(index) ? 'ring-4 ring-green-400 bg-green-500/20' : ''
                }`}
                onClick={() => speakNumberAndWord(item.number, item.word, index)}
              >
                {/* Number */}
                <div className="text-6xl font-bold text-white mb-2">
                  {item.number}
                </div>
                
                {/* Visual Items */}
                <div className="text-4xl mb-3">
                  {item.items}
                </div>
                
                {/* Word */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.word}
                </h3>
                
                {/* Description */}
                <p className="text-blue-100 text-sm mb-4">
                  {item.description}
                </p>
                
                {/* Audio Button */}
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    speaking === index
                      ? 'bg-blue-500 text-white animate-pulse'
                      : completedNumbers.has(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakNumberAndWord(item.number, item.word, index);
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {speaking === index ? 'Speaking...' : completedNumbers.has(index) ? 'Heard!' : 'Listen'}
                </button>
                
                {/* Completion Indicator */}
                {completedNumbers.has(index) && (
                  <div className="mt-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Fantastic Counting!</h2>
              <p className="text-blue-100 text-lg mb-6">
                You've mastered counting from 1 to 10!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCompletedNumbers(new Set());
                    localStorage.removeItem('numbers-completed');
                  }}
                  className="px-6 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                >
                  Practice Again
                </button>
                <Link href="/dashboard">
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="text-center">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
