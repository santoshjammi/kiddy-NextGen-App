'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserProgress } from '../../components/useUserProgress';

const alphabetData: Record<string, { word: string; image: string; audio: string }> = {
  A: { word: 'Apple', image: '/assets/apple.webp', audio: '/assets/apple.mp3' },
  B: { word: 'Ball', image: '/assets/ball.webp', audio: '/assets/ball.mp3' },
  C: { word: 'Cat', image: '/assets/cat.webp', audio: '/assets/cat.mp3' },
  D: { word: 'Dog', image: '/assets/dog.webp', audio: '/assets/dog.mp3' },
  E: { word: 'Elephant', image: '/assets/elephant.webp', audio: '/assets/elephant.mp3' },
  F: { word: 'Fish', image: '/assets/fish.webp', audio: '/assets/fish.mp3' },
  G: { word: 'Grapes', image: '/assets/grapes.webp', audio: '/assets/grapes.mp3' },
  H: { word: 'Hat', image: '/assets/hat.webp', audio: '/assets/hat.mp3' },
  I: { word: 'Ice Cream', image: '/assets/icecream.webp', audio: '/assets/icecream.mp3' },
  J: { word: 'Juice', image: '/assets/juice.webp', audio: '/assets/juice.mp3' },
  K: { word: 'Kite', image: '/assets/kite.webp', audio: '/assets/kite.mp3' },
  L: { word: 'Lion', image: '/assets/lion.webp', audio: '/assets/lion.mp3' },
  M: { word: 'Monkey', image: '/assets/monkey.webp', audio: '/assets/monkey.mp3' },
  N: { word: 'Nest', image: '/assets/nest.webp', audio: '/assets/nest.mp3' },
  O: { word: 'Orange', image: '/assets/orange.webp', audio: '/assets/orange.mp3' },
  P: { word: 'Penguin', image: '/assets/penguin.webp', audio: '/assets/penguin.mp3' },
  Q: { word: 'Queen', image: '/assets/queen.webp', audio: '/assets/queen.mp3' },
  R: { word: 'Rabbit', image: '/assets/rabbit.webp', audio: '/assets/rabbit.mp3' },
  S: { word: 'Sun', image: '/assets/sun.webp', audio: '/assets/sun.mp3' },
  T: { word: 'Tiger', image: '/assets/tiger.webp', audio: '/assets/tiger.mp3' },
  U: { word: 'Umbrella', image: '/assets/umbrella.webp', audio: '/assets/umbrella.mp3' },
  V: { word: 'Violin', image: '/assets/violin.webp', audio: '/assets/violin.mp3' },
  W: { word: 'Whale', image: '/assets/whale.webp', audio: '/assets/whale.mp3' },
  X: { word: 'Xylophone', image: '/assets/xylophone.webp', audio: '/assets/xylophone.mp3' },
  Y: { word: 'Yacht', image: '/assets/yacht.webp', audio: '/assets/yacht.mp3' },
  Z: { word: 'Zebra', image: '/assets/zebra.webp', audio: '/assets/zebra.mp3' },
};

const letters = Object.keys(alphabetData);

export default function AlphabetPage() {
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [visitedLetters, setVisitedLetters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { saveProgress: syncToFirebase } = useUserProgress('alphabet');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    const saved = localStorage.getItem('kiddyHub_alphabetCompleted');
    if (saved) setVisitedLetters(new Set(JSON.parse(saved)));
    return () => clearTimeout(timer);
  }, []);

  const saveAlphabetProgress = useCallback((newSet: Set<string>) => {
    setVisitedLetters(newSet);
    localStorage.setItem('kiddyHub_alphabetCompleted', JSON.stringify([...newSet]));
    syncToFirebase(Math.round((newSet.size / 26) * 100));
  }, [syncToFirebase]);

  useEffect(() => {
    if (visitedLetters.size === 26) {
      setTimeout(() => {
        alert('🎉 Congratulations! You\'ve learned all the letters! 🎉');
      }, 500);
    }
  }, [visitedLetters]);

  const playAudio = useCallback((audioSrc: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(audioSrc);
    audio.volume = 0.8;
    audio.play().catch(() => {});
    setCurrentAudio(audio);
  }, [currentAudio]);

  const selectLetter = useCallback((letter: string) => {
    const data = alphabetData[letter];
    if (!data) return;
    
    setCurrentLetter(letter);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 600);
    
    playAudio(data.audio);
    
    setVisitedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(letter);
      localStorage.setItem('kiddyHub_alphabetCompleted', JSON.stringify([...newSet]));
      syncToFirebase(Math.round((newSet.size / 26) * 100));
      return newSet;
    });
  }, [playAudio, syncToFirebase]);

  const selectRandomLetter = () => {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    selectLetter(randomLetter);
  };

  const repeatAudio = () => {
    if (currentLetter) {
      playAudio(alphabetData[currentLetter].audio);
    }
  };

  const resetProgress = () => {
    setVisitedLetters(new Set());
    setCurrentLetter(null);
    localStorage.removeItem('kiddyHub_alphabetCompleted');
    syncToFirebase(0);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  };

  const progressPercentage = (visitedLetters.size / 26) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading magical letters... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-colors">
              ← Back to Hub
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-3xl md:text-4xl font-fredoka text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
                🌈 ABC Fun Land 🎉
              </h1>
              <p className="text-gray-600 mt-1">Click on letters to learn and have fun!</p>
            </div>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-2 md:gap-3 mb-8">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => selectLetter(letter)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xl md:text-2xl font-bold transition-all duration-200 hover:scale-110 ${
                  currentLetter === letter
                    ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg scale-110'
                    : visitedLetters.has(letter)
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                }`}
              >
                <span>{letter}</span>
              </button>
            ))}
          </div>

          <div className={`bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 mb-6 text-center ${showCelebration ? 'animate-pulse' : ''}`}>
            <div className="text-8xl md:text-9xl font-fredoka text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text mb-4">
              {currentLetter || '?'}
            </div>
            <div className="text-3xl font-semibold text-gray-700 mb-4">
              {currentLetter ? alphabetData[currentLetter].word : 'Click a letter to start!'}
            </div>
            {currentLetter && alphabetData[currentLetter].image && (
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src={alphabetData[currentLetter].image}
                  alt={alphabetData[currentLetter].word}
                  fill
                  className="object-contain rounded-2xl shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {currentLetter && (
              <button
                onClick={repeatAudio}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                🔊 Say it Again!
              </button>
            )}
            <button
              onClick={selectRandomLetter}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              🎲 Surprise Me!
            </button>
            <button
              onClick={resetProgress}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              🔄 Start Over
            </button>
          </div>

          <div className="text-center mt-8 text-6xl cursor-pointer" title="Hi! I'm Alphabear! 🐻">
            🐻
          </div>
        </div>
      </div>
    </div>
  );
}
