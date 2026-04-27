'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const ITEM_EMOJIS = ['🍎', '⭐', '🐱', '🐶', '🌸', '🍕', '🚗', '🎈', '🦋', '🍦'];

function getRandomEmoji(): string {
  return ITEM_EMOJIS[Math.floor(Math.random() * ITEM_EMOJIS.length)];
}

function generateRound() {
  const count = Math.floor(Math.random() * 10) + 1;
  const emoji = getRandomEmoji();
  return { count, emoji };
}

export default function CountingPage() {
  const [round, setRound] = useState(generateRound);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const pick = useCallback((n: number) => {
    if (selected !== null) return;
    setSelected(n);
    setTotal(t => t + 1);
    if (n === round.count) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  }, [selected, round.count]);

  const next = () => {
    setRound(generateRound());
    setSelected(null);
  };

  const isCorrect = selected === round.count;

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Counting Puzzle</h1>
          <span className="text-white/60 text-sm font-medium">
            {streak > 0 ? `🔥 ${streak}` : `⭐ ${score}`}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-[#0070cc] text-xl font-semibold">{score}</p>
              <p className="text-[#6b6b6b] text-xs">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-[#6b6b6b] text-xl font-semibold">{total}</p>
              <p className="text-[#6b6b6b] text-xs">Played</p>
            </div>
            <div className="text-center">
              <p className="text-[#f59e0b] text-xl font-semibold">{streak}</p>
              <p className="text-[#6b6b6b] text-xs">Streak 🔥</p>
            </div>
          </div>

          {/* Items display */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-8 px-4 mb-8 min-h-[180px]">
            <p className="text-[#6b6b6b] text-sm text-center mb-4">How many do you see?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: round.count }).map((_, i) => (
                <span
                  key={i}
                  className="text-4xl select-none"
                  style={{
                    animation: `bounceIn 0.3s ease ${i * 0.06}s both`,
                  }}
                >
                  {round.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Number buttons 1-10 */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
              const isSelected = selected === n;
              const correct = n === round.count;
              let cls =
                'py-4 rounded-[14px] text-xl font-semibold border-2 transition-all duration-180 ';
              if (selected === null) {
                cls += 'bg-[#0070cc] text-white border-[#0070cc] hover:bg-[#1eaedb] hover:border-white hover:shadow-[0_0_0_2px_#0070cc] hover:scale-110 cursor-pointer';
              } else if (correct) {
                cls += 'bg-[#f0fdf4] border-[#22c55e] text-[#16a34a]';
              } else if (isSelected) {
                cls += 'bg-[#fef2f2] border-[#ef4444] text-[#dc2626]';
              } else {
                cls += 'bg-[#f5f5f5] border-[#e0e0e0] text-[#b0b0b0]';
              }
              return (
                <button key={n} onClick={() => pick(n)} className={cls}>
                  {n}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selected !== null && (
            <div className="text-center space-y-3">
              {isCorrect ? (
                <p className="text-[#16a34a] font-semibold text-lg">
                  🎉 Yes! There {round.count === 1 ? 'was' : 'were'}{' '}
                  <strong>{round.count}</strong> {round.emoji}!
                </p>
              ) : (
                <p className="text-[#dc2626] font-semibold">
                  There {round.count === 1 ? 'was' : 'were'}{' '}
                  <strong>{round.count}</strong> — you picked {selected}. Try again!
                </p>
              )}
              <button onClick={next} className="ps-btn">Next →</button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes bounceIn {
          from { opacity: 0; transform: scale(0.4); }
          60% { transform: scale(1.15); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
