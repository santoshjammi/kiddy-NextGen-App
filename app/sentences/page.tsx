'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SentenceQuestion {
  words: string[];
  hint: string;
}

const QUESTIONS: SentenceQuestion[] = [
  { words: ['THE', 'CAT', 'SITS'], hint: 'Where is the cat resting?' },
  { words: ['I', 'SEE', 'A', 'DOG'], hint: 'What do you see?' },
  { words: ['THE', 'SUN', 'IS', 'BIG'], hint: 'Describe the sun' },
  { words: ['WE', 'CAN', 'JUMP'], hint: 'What are we able to do?' },
  { words: ['THE', 'BIRD', 'CAN', 'FLY'], hint: 'What can the bird do?' },
  { words: ['I', 'LIKE', 'TO', 'PLAY'], hint: 'What do you enjoy?' },
  { words: ['THE', 'FISH', 'IS', 'WET'], hint: 'Describe the fish' },
  { words: ['MY', 'DOG', 'IS', 'BIG'], hint: 'Describe your dog' },
  { words: ['THE', 'FROG', 'CAN', 'HOP'], hint: 'What can the frog do?' },
  { words: ['IT', 'IS', 'HOT', 'TODAY'], hint: 'Describe the weather' },
  { words: ['THE', 'BOY', 'CAN', 'RUN', 'FAST'], hint: 'Describe the boy running' },
  { words: ['SHE', 'HAS', 'A', 'RED', 'BALL'], hint: 'What does she have?' },
  { words: ['THE', 'BEE', 'MADE', 'HONEY'], hint: 'What did the bee make?' },
  { words: ['ALL', 'THE', 'KIDS', 'PLAY'], hint: 'What do all the kids do?' },
  { words: ['I', 'SEE', 'A', 'BIG', 'STAR'], hint: 'What do you see in the sky?' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SentencesPage() {
  const [questions] = useState(() => QUESTIONS.map(q => ({ ...q })));
  const [shuffledWords] = useState(() => questions.map(q => shuffle(q.words)));
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const bank = shuffledWords[index];

  const clickWord = (word: string, bankIdx: number) => {
    if (usedIndices.has(bankIdx) || result !== null) return;
    const nextTyped = [...typed, word];
    const nextUsed = new Set(usedIndices);
    nextUsed.add(bankIdx);
    setTyped(nextTyped);
    setUsedIndices(nextUsed);

    if (nextTyped.length === current.words.length) {
      const correct = nextTyped.join(' ') === current.words.join(' ');
      setResult(correct ? 'correct' : 'wrong');
      if (correct) setScore(s => s + 1);
      if (!correct) {
        setTimeout(() => {
          setTyped([]);
          setUsedIndices(new Set());
          setResult(null);
        }, 900);
      }
    }
  };

  const removeLast = () => {
    if (typed.length === 0 || result === 'correct') return;
    const lastWord = typed[typed.length - 1];
    const bankIdx = [...usedIndices].reverse().find(i => bank[i] === lastWord);
    if (bankIdx !== undefined) {
      const next = new Set(usedIndices);
      next.delete(bankIdx);
      setUsedIndices(next);
    }
    setTyped(typed.slice(0, -1));
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setTyped([]);
      setUsedIndices(new Set());
      setResult(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setTyped([]);
    setUsedIndices(new Set());
    setResult(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-black sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
            <h1 className="text-white font-light text-lg">Simple Sentences</h1>
            <div className="w-24" />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-[24px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.18)] text-center">
            <div className="text-7xl mb-6">✍️</div>
            <h2 className="text-[36px] font-light text-black mb-3">Sentence Builder!</h2>
            <p className="text-[#6b6b6b] text-lg mb-8">
              Score: <strong className="text-[#0070cc]">{score}</strong> / {questions.length}
            </p>
            <button onClick={restart} className="ps-btn">Play Again</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Simple Sentences</h1>
          <span className="text-white/60 text-sm font-medium">⭐ {score}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Progress */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#6b6b6b] text-sm">{index + 1} / {questions.length}</span>
            <div className="ps-progress-track w-40">
              <div className="ps-progress-fill" style={{ width: `${(index / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Hint */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-6 text-center mb-8">
            <p className="text-[#0070cc] text-sm font-medium mb-1">💡 Hint</p>
            <p className="text-[#1f1f1f] text-lg font-light">{current.hint}</p>
          </div>

          {/* Answer slots */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[56px] mb-6 p-3 bg-[#f9fafb] rounded-[14px] border-2 border-dashed border-[#e0e0e0]">
            {typed.length === 0 && (
              <span className="text-[#b0b0b0] text-sm self-center">Tap words below to build the sentence...</span>
            )}
            {typed.map((word, i) => (
              <span
                key={i}
                className={[
                  'px-3 py-1.5 rounded-[8px] text-sm font-semibold transition-all',
                  result === 'correct'
                    ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e]'
                    : result === 'wrong'
                    ? 'bg-[#fef2f2] text-[#dc2626] border border-[#ef4444]'
                    : 'bg-[#0070cc] text-white',
                ].join(' ')}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Word bank */}
          {result !== 'correct' && (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {bank.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => clickWord(word, i)}
                    disabled={usedIndices.has(i)}
                    className={[
                      'px-4 py-2.5 rounded-[10px] text-sm font-semibold border-2 transition-all duration-150',
                      usedIndices.has(i)
                        ? 'bg-[#f0f0f0] text-[#c0c0c0] border-[#e0e0e0] cursor-not-allowed'
                        : 'bg-white text-[#1f1f1f] border-[#0070cc] hover:bg-[#0070cc] hover:text-white hover:scale-105 cursor-pointer',
                    ].join(' ')}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={removeLast} className="ps-btn ps-btn-sm ps-btn-ghost">⌫ Remove</button>
                <button
                  onClick={() => { setTyped([]); setUsedIndices(new Set()); }}
                  className="ps-btn ps-btn-sm ps-btn-ghost"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          {result === 'correct' && (
            <div className="mt-4 text-center space-y-3">
              <p className="text-[#16a34a] font-semibold text-lg">
                🎉 Perfect sentence!
              </p>
              <button onClick={next} className="ps-btn">
                {index + 1 >= questions.length ? 'See Results' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
