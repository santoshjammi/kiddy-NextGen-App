'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface WordEntry {
  word: string;
  emoji: string;
  hint: string;
}

const WORDS: WordEntry[] = [
  { word: 'CAT', emoji: '🐱', hint: 'A furry pet that meows' },
  { word: 'DOG', emoji: '🐶', hint: 'A loyal pet that barks' },
  { word: 'SUN', emoji: '☀️', hint: 'It shines bright in the sky' },
  { word: 'BEE', emoji: '🐝', hint: 'It makes honey and buzzes' },
  { word: 'PIG', emoji: '🐷', hint: 'A farm animal that oinks' },
  { word: 'COW', emoji: '🐄', hint: 'A farm animal that gives milk' },
  { word: 'OWL', emoji: '🦉', hint: 'A bird that hoots at night' },
  { word: 'FOX', emoji: '🦊', hint: 'A clever wild animal with a bushy tail' },
  { word: 'HAT', emoji: '🎩', hint: 'You wear this on your head' },
  { word: 'BUS', emoji: '🚌', hint: 'A big vehicle for many people' },
  { word: 'CUP', emoji: '☕', hint: 'You drink from this' },
  { word: 'ANT', emoji: '🐜', hint: 'A tiny insect that lives in colonies' },
  { word: 'MAP', emoji: '🗺️', hint: 'It shows you where places are' },
  { word: 'HEN', emoji: '🐔', hint: 'A female chicken on a farm' },
  { word: 'JAR', emoji: '🫙', hint: 'A glass container with a lid' },
];

const EXTRA_LETTERS = 'XVZQWJK';

function getShuffledLetters(word: string): string[] {
  const pool = word.split('');
  // Add 2 random distractors
  for (let i = 0; i < 2; i++) {
    pool.push(EXTRA_LETTERS[Math.floor(Math.random() * EXTRA_LETTERS.length)]);
  }
  return pool.sort(() => Math.random() - 0.5);
}

export default function SpellingPage() {
  const [index, setIndex] = useState(0);
  const [letterBank, setLetterBank] = useState(() => getShuffledLetters(WORDS[0].word));
  const [typed, setTyped] = useState<string[]>([]);
  const [used, setUsed] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const current = WORDS[index];

  const pickLetter = useCallback((letter: string, bankIdx: number) => {
    if (used.has(bankIdx) || typed.length >= current.word.length) return;
    const next = [...typed, letter];
    const nextUsed = new Set(used);
    nextUsed.add(bankIdx);
    setTyped(next);
    setUsed(nextUsed);

    if (next.length === current.word.length) {
      const attempt = next.join('');
      if (attempt === current.word) {
        setResult('correct');
        setScore(s => s + 1);
      } else {
        setResult('wrong');
        setTimeout(() => {
          setTyped([]);
          setUsed(new Set());
          setResult(null);
        }, 800);
      }
    }
  }, [typed, used, current.word]);

  const deleteLast = () => {
    if (typed.length === 0 || result === 'correct') return;
    const lastTyped = typed[typed.length - 1];
    // Find the last used bank index that matches the last letter
    const bankIdx = [...used].reverse().find(i => letterBank[i] === lastTyped);
    if (bankIdx !== undefined) {
      const nextUsed = new Set(used);
      nextUsed.delete(bankIdx);
      setUsed(nextUsed);
    }
    setTyped(typed.slice(0, -1));
  };

  const next = () => {
    const nextIdx = (index + 1) % WORDS.length;
    setIndex(nextIdx);
    setLetterBank(getShuffledLetters(WORDS[nextIdx].word));
    setTyped([]);
    setUsed(new Set());
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Spelling Builder</h1>
          <span className="text-white/60 text-sm font-medium">⭐ {score}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Progress */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#6b6b6b] text-sm">{index + 1} / {WORDS.length}</span>
            <div className="ps-progress-track w-40">
              <div className="ps-progress-fill" style={{ width: `${((index) / WORDS.length) * 100}%` }} />
            </div>
          </div>

          {/* Emoji + Hint */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-10 text-center mb-8">
            <div className="text-7xl mb-4">{current.emoji}</div>
            <p className="text-[#6b6b6b] text-sm">{current.hint}</p>
          </div>

          {/* Blank slots */}
          <div className="flex justify-center gap-3 mb-8">
            {current.word.split('').map((_, i) => (
              <div
                key={i}
                className={[
                  'w-14 h-14 rounded-[12px] border-2 flex items-center justify-center text-2xl font-semibold transition-all',
                  result === 'correct'
                    ? 'bg-[#f0fdf4] border-[#22c55e] text-[#16a34a]'
                    : result === 'wrong' && typed[i]
                    ? 'bg-[#fef2f2] border-[#ef4444] text-[#dc2626]'
                    : typed[i]
                    ? 'bg-[#f5f7fa] border-[#0070cc] text-[#0070cc]'
                    : 'bg-white border-[#e0e0e0] text-transparent',
                ].join(' ')}
              >
                {typed[i] ?? '_'}
              </div>
            ))}
          </div>

          {result === 'correct' ? (
            <div className="text-center space-y-4">
              <p className="text-[#16a34a] font-semibold text-lg">
                🎉 Correct! <strong>{current.word}</strong> — spelled perfectly!
              </p>
              <button onClick={next} className="ps-btn">
                Next Word →
              </button>
            </div>
          ) : (
            <>
              {/* Letter bank */}
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {letterBank.map((letter, i) => (
                  <button
                    key={i}
                    onClick={() => pickLetter(letter, i)}
                    disabled={used.has(i)}
                    className={[
                      'w-12 h-12 rounded-[10px] text-lg font-semibold transition-all duration-180',
                      used.has(i)
                        ? 'bg-[#e5e5e5] text-[#b0b0b0] cursor-not-allowed'
                        : 'bg-[#0070cc] text-white hover:bg-[#1eaedb] hover:border-2 hover:border-white hover:shadow-[0_0_0_2px_#0070cc] hover:scale-110 cursor-pointer',
                    ].join(' ')}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={deleteLast} className="ps-btn ps-btn-sm ps-btn-ghost">
                  ⌫ Delete
                </button>
                <button onClick={() => { setTyped([]); setUsed(new Set()); }} className="ps-btn ps-btn-sm ps-btn-ghost">
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
