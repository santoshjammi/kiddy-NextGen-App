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

  // Progress celebration
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b6b6b] text-base font-light">Loading ABC letters&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[22px] font-light text-white tracking-[0.1px]">ABC Letters</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Click a letter to learn</p>
          </div>
          <div className="text-[#6b6b6b] text-xs font-medium">
            {visitedLetters.size}/26
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-[24px] p-6 md:p-8" style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>

          <div className="ps-progress-track mb-6">
            <div className="ps-progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-2 md:gap-3 mb-8">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => selectLetter(letter)}
                className={`ps-tile aspect-square flex flex-col items-center justify-center text-xl md:text-2xl ${
                  currentLetter === letter
                    ? 'ps-tile-active'
                    : visitedLetters.has(letter)
                    ? 'ps-tile-done'
                    : ''
                }`}
              >
                <span>{letter}</span>
              </button>
            ))}
          </div>

          <div className={`bg-[#f5f7fa] rounded-[19px] p-8 mb-6 text-center ${showCelebration ? 'scale-[1.01] transition-transform' : ''}`}>
            <div className="text-8xl md:text-9xl font-light text-[#0070cc] mb-4" style={{ letterSpacing: '-2px' }}>
              {currentLetter || '?'}
            </div>
            <div className="text-[28px] font-light text-[#1f1f1f] mb-4">
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
              <button onClick={repeatAudio} className="ps-btn ps-btn-sm">
                🔊 Say it Again
              </button>
            )}
            <button onClick={selectRandomLetter} className="ps-btn ps-btn-sm">
              🎲 Surprise
            </button>
            <button onClick={resetProgress} className="ps-btn ps-btn-sm ps-btn-ghost">
              Reset Progress
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
