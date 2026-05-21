'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Dolch Pre-Primer + Primer sight words
const ALL_WORDS = [
  'A', 'AND', 'AWAY', 'BIG', 'BLUE', 'CAN', 'COME', 'DOWN', 'FIND', 'FOR',
  'FUNNY', 'GO', 'HELP', 'HERE', 'I', 'IN', 'IS', 'IT', 'JUMP', 'LITTLE',
  'LOOK', 'MAKE', 'ME', 'MY', 'NOT', 'ONE', 'PLAY', 'RED', 'RUN', 'SAID',
  'SEE', 'THE', 'THREE', 'TO', 'TWO', 'UP', 'WE', 'WHERE', 'YELLOW', 'YOU',
  'ALL', 'AM', 'ARE', 'AT', 'ATE', 'BE', 'BLACK', 'BROWN', 'BUT', 'CAME',
  'DID', 'DO', 'EAT', 'FOUR', 'GET', 'GOOD', 'HAS', 'HE', 'INTO', 'LIKE',
  'MUST', 'NEW', 'NO', 'NOW', 'ON', 'OUR', 'OUT', 'PLEASE', 'PRETTY',
  'RAN', 'RIDE', 'SAW', 'SAY', 'SHE', 'SO', 'SOON', 'THAT', 'THERE',
  'THEY', 'THIS', 'TOO', 'UNDER', 'WANT', 'WAS', 'WELL', 'WENT', 'WHAT',
  'WHITE', 'WHO', 'WILL', 'WITH', 'YES',
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const STORAGE_KEY = 'kiddyNG_sightWordsKnown';

export default function SightWordsPage() {
  const [deck, setDeck] = useState<string[]>(() => shuffle(ALL_WORDS));
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch { return new Set(); }
  });
  const [revealed, setRevealed] = useState(false);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionLearning, setSessionLearning] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...known]));
    } catch { /* ignore */ }
  }, [known]);

  const current = deck[index];
  const progress = Math.round((known.size / ALL_WORDS.length) * 100);

  const markKnown = () => {
    setKnown(prev => new Set([...prev, current]));
    setSessionKnown(n => n + 1);
    advance();
  };

  const markLearning = () => {
    setSessionLearning(n => n + 1);
    advance();
  };

  const advance = () => {
    setRevealed(false);
    if (index + 1 >= deck.length) {
      // reshuffle the unknown words
      const learning = deck.filter(w => !known.has(w) && w !== current);
      setDeck(shuffle(learning.length > 0 ? learning : ALL_WORDS));
      setIndex(0);
    } else {
      setIndex(i => i + 1);
    }
  };

  const resetProgress = () => {
    setKnown(new Set());
    setDeck(shuffle(ALL_WORDS));
    setIndex(0);
    setSessionKnown(0);
    setSessionLearning(0);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Sight Words</h1>
          <span className="text-white/60 text-sm font-medium">{known.size} / {ALL_WORDS.length}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6b6b6b] text-xs uppercase tracking-wider">Words I know</span>
              <span className="text-[#0070cc] text-xs font-semibold">{progress}%</span>
            </div>
            <div className="ps-progress-track">
              <div className="ps-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Session stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-[#16a34a] text-2xl font-semibold">{sessionKnown}</p>
              <p className="text-[#6b6b6b] text-xs">Known ✓</p>
            </div>
            <div className="text-center">
              <p className="text-[#6b6b6b] text-2xl font-semibold">{sessionLearning}</p>
              <p className="text-[#6b6b6b] text-xs">Learning 📖</p>
            </div>
            <div className="text-center">
              <p className="text-[#0070cc] text-2xl font-semibold">{deck.length - index}</p>
              <p className="text-[#6b6b6b] text-xs">Remaining</p>
            </div>
          </div>

          {/* Flash card */}
          <div
            className={[
              'bg-[#f5f7fa] rounded-[19px] py-20 text-center mb-8 cursor-pointer transition-all duration-200',
              revealed ? 'ring-2 ring-[#0070cc]' : 'hover:bg-[#eef1f5]',
            ].join(' ')}
            onClick={() => setRevealed(true)}
          >
            <p className="text-[72px] font-light text-black tracking-tight leading-none">
              {current}
            </p>
            {!revealed && (
              <p className="text-[#6b6b6b] text-sm mt-4">Tap to reveal</p>
            )}
            {revealed && known.has(current) && (
              <p className="text-[#16a34a] text-sm mt-4 font-medium">✓ Already in your known words!</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={markLearning}
              className="py-4 rounded-[999px] border-2 border-[#0070cc] text-[#0070cc] font-semibold
                         hover:bg-[#f0f7ff] transition-colors text-sm"
            >
              📖 Still Learning
            </button>
            <button
              onClick={markKnown}
              className="ps-btn py-4 text-sm"
            >
              ✓ I Know It!
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={resetProgress} className="text-[#6b6b6b] text-xs hover:text-[#0070cc] transition-colors">
              Reset progress
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
