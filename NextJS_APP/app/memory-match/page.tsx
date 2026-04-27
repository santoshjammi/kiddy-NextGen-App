'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Card {
  key: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
    key: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<Card[]>(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  const matchedCount = cards.filter(c => c.matched).length;

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
        if (resolved.every(c => c.matched)) setWon(true);
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
  }, [cards, flipped, locked]);

  const reset = () => {
    setCards(makeCards());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Memory Match</h1>
          <span className="text-white/60 text-sm font-medium">{moves} moves</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {won ? (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-[36px] font-light text-black mb-3">You won!</h2>
              <p className="text-[#6b6b6b] mb-8">
                Completed in <strong className="text-[#0070cc]">{moves}</strong> moves
              </p>
              <button onClick={reset} className="ps-btn">Play Again</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Pairs found</p>
                  <p className="text-[#0070cc] font-semibold text-lg">
                    {matchedCount / 2} / {EMOJIS.length}
                  </p>
                </div>
                <div className="ps-progress-track w-36">
                  <div
                    className="ps-progress-fill"
                    style={{ width: `${(matchedCount / (EMOJIS.length * 2)) * 100}%` }}
                  />
                </div>
                <button onClick={reset} className="ps-btn ps-btn-sm ps-btn-ghost">Reset</button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {cards.map((card, idx) => (
                  <button
                    key={card.key}
                    onClick={() => handleClick(idx)}
                    className={[
                      'aspect-square rounded-[16px] text-3xl flex items-center justify-center',
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
                Flip two cards to find matching pairs. Find all {EMOJIS.length} pairs to win!
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
