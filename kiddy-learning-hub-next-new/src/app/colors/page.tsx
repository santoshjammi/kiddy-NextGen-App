'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Volume2, CheckCircle } from 'lucide-react';

const colors = [
  { name: 'Red', hex: '#FF0000', emoji: '🍎', description: 'The color of apples and roses' },
  { name: 'Blue', hex: '#0000FF', emoji: '💙', description: 'The color of the sky and ocean' },
  { name: 'Green', hex: '#00FF00', emoji: '🍏', description: 'The color of grass and leaves' },
  { name: 'Yellow', hex: '#FFFF00', emoji: '🌞', description: 'The color of the sun and bananas' },
  { name: 'Orange', hex: '#FFA500', emoji: '🍊', description: 'The color of oranges and carrots' },
  { name: 'Purple', hex: '#800080', emoji: '🍇', description: 'The color of grapes and eggplants' },
  { name: 'Pink', hex: '#FFC0CB', emoji: '🌸', description: 'The color of flowers and cotton candy' },
  { name: 'Brown', hex: '#A52A2A', emoji: '🟤', description: 'The color of chocolate and trees' },
];

export default function ColorsPage() {
  const { user } = useAuth();
  const [completedColors, setCompletedColors] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colors-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [speaking, setSpeaking] = useState<number | null>(null);

  useEffect(() => {
    // Save completed colors to localStorage
    localStorage.setItem('colors-completed', JSON.stringify([...completedColors]));
    
    // Save overall progress to Firestore
    if (user && completedColors.size > 0) {
      saveProgress(user.uid, 'colors', completedColors.size, colors.length).catch(console.error);
    }
  }, [completedColors, user]);

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
        setCompletedColors(prev => new Set([...prev, index]));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakColor = (colorName: string, index: number) => {
    speakText(colorName, index);
  };

  const isCompleted = completedColors.size === colors.length;

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-red-600 via-pink-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🌈 Learn Colors</h1>
            <p className="text-pink-100 text-lg">Click on any color to hear its name!</p>
            
            {/* Progress */}
            <div className="mt-4 bg-white/20 rounded-full px-6 py-3 inline-block">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  {completedColors.size} / {colors.length} colors learned
                </span>
              </div>
            </div>
          </div>

          {/* Colors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer transition-all transform hover:scale-105 hover:bg-white/20 ${
                  completedColors.has(index) ? 'ring-4 ring-green-400 bg-green-500/20' : ''
                }`}
                onClick={() => speakColor(color.name, index)}
              >
                {/* Color Circle */}
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                  style={{ backgroundColor: color.hex }}
                ></div>
                
                {/* Emoji */}
                <div className="text-4xl mb-3">
                  {color.emoji}
                </div>
                
                {/* Color Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {color.name}
                </h3>
                
                {/* Hex Code */}
                <p className="text-pink-100 text-sm mb-2 font-mono">
                  {color.hex}
                </p>
                
                {/* Description */}
                <p className="text-pink-100 text-sm mb-4">
                  {color.description}
                </p>
                
                {/* Audio Button */}
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    speaking === index
                      ? 'bg-blue-500 text-white animate-pulse'
                      : completedColors.has(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakColor(color.name, index);
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {speaking === index ? 'Speaking...' : completedColors.has(index) ? 'Heard!' : 'Listen'}
                </button>
                
                {/* Completion Indicator */}
                {completedColors.has(index) && (
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
              <h2 className="text-3xl font-bold text-white mb-2">Color Champion!</h2>
              <p className="text-pink-100 text-lg mb-6">
                You've learned all the colors of the rainbow!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCompletedColors(new Set());
                    localStorage.removeItem('colors-completed');
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
