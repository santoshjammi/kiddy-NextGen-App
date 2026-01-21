'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Volume2, CheckCircle } from 'lucide-react';

const letters = [
  { letter: 'A', word: 'Apple', description: 'A red or green fruit', emoji: '🍎' },
  { letter: 'B', word: 'Ball', description: 'A round toy to play with', emoji: '⚽' },
  { letter: 'C', word: 'Cat', description: 'A furry pet that says meow', emoji: '🐱' },
  { letter: 'D', word: 'Dog', description: 'A friendly animal that barks', emoji: '🐶' },
  { letter: 'E', word: 'Elephant', description: 'A large animal with a trunk', emoji: '🐘' },
  { letter: 'F', word: 'Fish', description: 'An animal that lives in water', emoji: '🐠' },
  { letter: 'G', word: 'Giraffe', description: 'A tall animal with a long neck', emoji: '🦒' },
  { letter: 'H', word: 'House', description: 'A place where people live', emoji: '🏠' },
  { letter: 'I', word: 'Ice Cream', description: 'A sweet frozen treat', emoji: '🍦' },
  { letter: 'J', word: 'Jump', description: 'What you do when you go up in the air', emoji: '🤾' },
  { letter: 'K', word: 'Kangaroo', description: 'An animal that hops with a pouch', emoji: '🦘' },
  { letter: 'L', word: 'Lion', description: 'The king of the jungle', emoji: '🦁' },
  { letter: 'M', word: 'Monkey', description: 'A playful animal that swings', emoji: '🐵' },
  { letter: 'N', word: 'Nest', description: 'A home for birds', emoji: '🪺' },
  { letter: 'O', word: 'Orange', description: 'A juicy citrus fruit', emoji: '🍊' },
  { letter: 'P', word: 'Panda', description: 'A bear from China', emoji: '🐼' },
  { letter: 'Q', word: 'Queen', description: 'A royal lady', emoji: '👸' },
  { letter: 'R', word: 'Rabbit', description: 'A fluffy animal with long ears', emoji: '🐰' },
  { letter: 'S', word: 'Sun', description: 'The bright star in the sky', emoji: '☀️' },
  { letter: 'T', word: 'Tiger', description: 'A striped wild cat', emoji: '🐯' },
  { letter: 'U', word: 'Umbrella', description: 'Keeps you dry in the rain', emoji: '☂️' },
  { letter: 'V', word: 'Violin', description: 'A musical instrument', emoji: '🎻' },
  { letter: 'W', word: 'Whale', description: 'A huge sea animal', emoji: '🐋' },
  { letter: 'X', word: 'Xylophone', description: 'A musical instrument with bars', emoji: '🎵' },
  { letter: 'Y', word: 'Yacht', description: 'A fancy boat', emoji: '⛵' },
  { letter: 'Z', word: 'Zebra', description: 'A striped African animal', emoji: '🦓' },
];

export default function AlphabetPage() {
  const { user } = useAuth();
  const [completedLetters, setCompletedLetters] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alphabet-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [speaking, setSpeaking] = useState<number | null>(null);

  useEffect(() => {
    // Save completed letters to localStorage
    localStorage.setItem('alphabet-completed', JSON.stringify([...completedLetters]));
    
    // Save overall progress to Firestore
    if (user && completedLetters.size > 0) {
      saveProgress(user.uid, 'alphabet', completedLetters.size, letters.length).catch(console.error);
    }
  }, [completedLetters, user]);

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
        setCompletedLetters(prev => new Set([...prev, index]));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakLetterAndWord = (letter: string, word: string, index: number) => {
    const text = `${letter}. ${word}`;
    speakText(text, index);
  };

  const isCompleted = completedLetters.size === letters.length;

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🔤 Learn the Alphabet</h1>
            <p className="text-purple-100 text-lg">Click on any letter to hear it pronounced!</p>
            
            {/* Progress */}
            <div className="mt-4 bg-white/20 rounded-full px-6 py-3 inline-block">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  {completedLetters.size} / {letters.length} letters learned
                </span>
              </div>
            </div>
          </div>

          {/* Letters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {letters.map((item, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer transition-all transform hover:scale-105 hover:bg-white/20 ${
                  completedLetters.has(index) ? 'ring-4 ring-green-400 bg-green-500/20' : ''
                }`}
                onClick={() => speakLetterAndWord(item.letter, item.word, index)}
              >
                {/* Letter */}
                <div className="text-6xl font-bold text-white mb-2">
                  {item.letter}
                </div>
                
                {/* Emoji */}
                <div className="text-4xl mb-3">
                  {item.emoji}
                </div>
                
                {/* Word */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.word}
                </h3>
                
                {/* Description */}
                <p className="text-purple-100 text-sm mb-4">
                  {item.description}
                </p>
                
                {/* Audio Button */}
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    speaking === index
                      ? 'bg-blue-500 text-white animate-pulse'
                      : completedLetters.has(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakLetterAndWord(item.letter, item.word, index);
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {speaking === index ? 'Speaking...' : completedLetters.has(index) ? 'Heard!' : 'Listen'}
                </button>
                
                {/* Completion Indicator */}
                {completedLetters.has(index) && (
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
              <h2 className="text-3xl font-bold text-white mb-2">Amazing Work!</h2>
              <p className="text-purple-100 text-lg mb-6">
                You've learned all the letters of the alphabet!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCompletedLetters(new Set());
                    localStorage.removeItem('alphabet-completed');
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
