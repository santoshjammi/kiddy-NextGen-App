'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';

const LEVELS = [
  { level: 1, pairs: 3, label: 'Easy Start', cols: 3 },
  { level: 2, pairs: 5, label: 'Getting Harder', cols: 4 },
  { level: 3, pairs: 7, label: 'Tricky', cols: 4 },
  { level: 4, pairs: 10, label: 'Memory Master', cols: 4 },
];

const ALL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐸', '🐨', '🦁', '🐯', '🐮', '🐷', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Card {
  key: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(pairs: number): Card[] {
  const chosen = shuffle(ALL_EMOJIS).slice(0, pairs);
  return shuffle([...chosen, ...chosen]).map((emoji, i) => ({
    key: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>(() => makeCards(LEVELS[0].pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const levelConfig = LEVELS[level - 1];
  const matchedCount = cards.filter(c => c.matched).length;
  const completedPairs = matchedCount / 2;

  const reset = useCallback((targetLevel?: number) => {
    const l = targetLevel ?? level;
    setCards(makeCards(LEVELS[l - 1].pairs));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setShowConfetti(false);
    setShowLevelUp(false);
  }, [level]);

  const changeLevel = (newLevel: number) => {
    setLevel(newLevel);
    reset(newLevel);
  };

  const handleClick = useCallback((idx: number) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;

    const next = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const nextFlipped = [...flipped, idx];
    setCards(next);
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = nextFlipped;
      if (next[a].emoji === next[b].emoji) {
        const resolved = next.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setCards(resolved);
        setFlipped([]);
        setLocked(false);
        if (resolved.every(c => c.matched)) {
          setWon(true);
          setShowConfetti(true);
          if (level < LEVELS.length) {
            setShowLevelUp(true);
          }
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, level]);

  const cols = levelConfig.cols;

  return (
    <div className="min-h-screen bg-black">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '⭐', '✨', '🎊', '💫', '🌟'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
          <style jsx>{`
            @keyframes fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-fall {
              animation: fall linear forwards;
            }
          `}</style>
        </div>
      )}

      <header className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <div className="text-center">
            <h1 className="text-white font-light text-lg">Memory Match</h1>
            <p className="text-white/40 text-xs">{levelConfig.label} — Level {level}</p>
          </div>
          <span className="text-white/60 text-sm font-medium">{moves} moves</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {won ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-[36px] font-light text-black mb-3">Level Complete!</h2>
              <p className="text-[#6b6b6b] mb-6">
                Found all {levelConfig.pairs} pairs in <strong className="text-[#0070cc]">{moves}</strong> moves
              </p>
              {showLevelUp ? (
                <div className="space-y-3">
                  <p className="text-green-600 font-semibold text-lg">🐰 Amazing! Next level unlocked!</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => changeLevel(level + 1)} className="ps-btn">
                      Next Level →
                    </button>
                    <button onClick={() => reset(level)} className="ps-btn ps-btn-ghost">
                      Replay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[#0070cc] font-semibold text-lg">🏆 You completed all levels!</p>
                  <button onClick={() => changeLevel(1)} className="ps-btn">
                    Play Again from Level 1
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Pairs found</p>
                  <p className="text-[#0070cc] font-semibold text-lg">
                    {completedPairs} / {levelConfig.pairs}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    className="bg-[#f5f7fa] text-sm border border-[#e0e0e0] rounded-[8px] px-2 py-1.5"
                    value={level}
                    onChange={(e) => changeLevel(parseInt(e.target.value))}
                  >
                    {LEVELS.map((l) => (
                      <option key={l.level} value={l.level}>
                        Level {l.level}: {l.pairs} pairs
                      </option>
                    ))}
                  </select>
                  <div className="ps-progress-track w-24">
                    <div
                      className="ps-progress-fill"
                      style={{ width: `${(matchedCount / (levelConfig.pairs * 2)) * 100}%` }}
                    />
                  </div>
                  <button onClick={() => reset(level)} className="ps-btn ps-btn-sm ps-btn-ghost">Reset</button>
                </div>
              </div>

              <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {cards.map((card, idx) => (
                  <button
                    key={card.key}
                    onClick={() => handleClick(idx)}
                    className={[
                      'aspect-square rounded-[16px] text-2xl md:text-3xl flex items-center justify-center',
                      'transition-all duration-200 border-2 select-none',
                      card.matched
                        ? 'bg-[#f0fdf4] border-[#22c55e] cursor-default'
                        : card.flipped
                        ? 'bg-[#f5f7fa] border-[#0070cc] scale-105'
                        : 'bg-[#0070cc] border-[#0070cc] hover:bg-[#1eaedb] hover:border-white hover:shadow-[0_0_0_2px_#0070cc] hover:scale-110 cursor-pointer',
                    ].join(' ')}
                  >
                    {(card.flipped || card.matched) ? card.emoji : ''}
                  </button>
                ))}
              </div>

              <p className="text-[#6b6b6b] text-xs text-center mt-6">
                Flip two cards to find matching pairs. Find all {levelConfig.pairs} pairs to win!
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}