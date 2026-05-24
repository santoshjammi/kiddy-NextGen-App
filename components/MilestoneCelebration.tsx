"use client";

import { useEffect, useState } from 'react';

interface MilestoneCelebrationProps {
  game: string;
  percentage: number;
  onDismiss: () => void;
}

const MILESTONE_CONFIG: Record<number, { emoji: string; message: string; animation: string }> = {
  25: { emoji: '🐰', message: 'Great start! Keep going!', animation: 'bunny_encourage' },
  50: { emoji: '🐰', message: "You're halfway there!", animation: 'bunny_jump' },
  75: { emoji: '⭐', message: 'Almost there! Amazing!', animation: 'stars' },
  100: { emoji: '🏆', message: 'Complete! You did it!', animation: 'reward_scene' },
};

const GAME_LABELS: Record<string, string> = {
  alphabet: 'ABC Letters',
  numbers: 'Numbers',
  shapes: 'Shapes',
  colors: 'Colors',
  math: 'Math Engine',
  english: 'Word Builder',
  'carry-borrow': 'Carry & Borrow',
  'memory-match': 'Memory Match',
  spelling: 'Spelling',
  rhyming: 'Rhyming',
  patterns: 'Patterns',
  'sight-words': 'Sight Words',
  counting: 'Counting',
  animals: 'Animals',
  sentences: 'Sentences',
  time: 'Telling Time',
  tracing: 'Tracing',
  'missing-letter': 'Missing Letter',
  'letter-fishing': 'Letter Fishing',
  'multiplication-race': 'Multiplication Race',
  'division-splitter': 'Division Splitter',
  'dino-treasure-hunt': 'Dino Treasure Hunt',
  paint: 'Kiddy Paint',
};

export function MilestoneCelebration({ game, percentage, onDismiss }: MilestoneCelebrationProps) {
  const [visible, setVisible] = useState(true);
  const config = MILESTONE_CONFIG[percentage];
  if (!config) return null;

  const gameLabel = GAME_LABELS[game] || game;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-[32px] p-8 md:p-12 text-center max-w-sm mx-4 shadow-2xl animate-bounce-in"
        style={{ animation: 'bounceIn 0.5s ease-out' }}
      >
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="absolute top-3 right-4 text-[#6b6b6b] text-xl hover:text-black transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>

        <div className="text-7xl mb-4 animate-float">{config.emoji}</div>

        <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text mb-2">
          {percentage}%
        </div>

        <p className="text-lg font-semibold text-black mb-1">{config.message}</p>
        <p className="text-sm text-[#6b6b6b]">{gameLabel}</p>

        <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}