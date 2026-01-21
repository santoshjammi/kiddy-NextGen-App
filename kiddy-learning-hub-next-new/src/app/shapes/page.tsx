'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveProgress } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Volume2, CheckCircle } from 'lucide-react';

const shapes = [
  { name: 'Circle', emoji: '⭕', description: 'A round shape with no corners' },
  { name: 'Square', emoji: '⬜', description: 'A shape with four equal sides' },
  { name: 'Triangle', emoji: '🔺', description: 'A shape with three sides' },
  { name: 'Rectangle', emoji: '⬛', description: 'A shape with four sides, two long and two short' },
  { name: 'Star', emoji: '⭐', description: 'A shape with five points' },
  { name: 'Heart', emoji: '❤️', description: 'A shape that looks like love' },
  { name: 'Diamond', emoji: '💎', description: 'A precious stone shape' },
  { name: 'Oval', emoji: '🥚', description: 'A stretched circle shape' },
];

export default function ShapesPage() {
  const { user } = useAuth();
  const [completedShapes, setCompletedShapes] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shapes-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [speaking, setSpeaking] = useState<number | null>(null);

  useEffect(() => {
    // Save completed shapes to localStorage
    localStorage.setItem('shapes-completed', JSON.stringify([...completedShapes]));
    
    // Save overall progress to Firestore
    if (user && completedShapes.size > 0) {
      saveProgress(user.uid, 'shapes', completedShapes.size, shapes.length).catch(console.error);
    }
  }, [completedShapes, user]);

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
        setCompletedShapes(prev => new Set([...prev, index]));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakShape = (shapeName: string, index: number) => {
    speakText(shapeName, index);
  };

  const isCompleted = completedShapes.size === shapes.length;

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🔺 Learn Shapes</h1>
            <p className="text-green-100 text-lg">Click on any shape to hear its name!</p>
            
            {/* Progress */}
            <div className="mt-4 bg-white/20 rounded-full px-6 py-3 inline-block">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  {completedShapes.size} / {shapes.length} shapes learned
                </span>
              </div>
            </div>
          </div>

          {/* Shapes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {shapes.map((shape, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer transition-all transform hover:scale-105 hover:bg-white/20 ${
                  completedShapes.has(index) ? 'ring-4 ring-green-400 bg-green-500/20' : ''
                }`}
                onClick={() => speakShape(shape.name, index)}
              >
                {/* Shape Emoji */}
                <div className="text-6xl mb-3">
                  {shape.emoji}
                </div>
                
                {/* Shape Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {shape.name}
                </h3>
                
                {/* Description */}
                <p className="text-green-100 text-sm mb-4">
                  {shape.description}
                </p>
                
                {/* Audio Button */}
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    speaking === index
                      ? 'bg-blue-500 text-white animate-pulse'
                      : completedShapes.has(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakShape(shape.name, index);
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {speaking === index ? 'Speaking...' : completedShapes.has(index) ? 'Heard!' : 'Listen'}
                </button>
                
                {/* Completion Indicator */}
                {completedShapes.has(index) && (
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
              <h2 className="text-3xl font-bold text-white mb-2">Shape Master!</h2>
              <p className="text-green-100 text-lg mb-6">
                You've learned all the shapes!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCompletedShapes(new Set());
                    localStorage.removeItem('shapes-completed');
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
