'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RhymeQuestion {
  word: string;
  emoji: string;
  correct: string;
  choices: string[];
}

const QUESTIONS: RhymeQuestion[] = [
  { word: 'CAT', emoji: '🐱', correct: 'HAT', choices: ['HAT', 'DOG', 'BUS'] },
  { word: 'SUN', emoji: '☀️', correct: 'FUN', choices: ['FUN', 'CAR', 'BAG'] },
  { word: 'BEE', emoji: '🐝', correct: 'TREE', choices: ['TREE', 'FISH', 'BALL'] },
  { word: 'CAKE', emoji: '🎂', correct: 'LAKE', choices: ['LAKE', 'SOCK', 'BIRD'] },
  { word: 'DOG', emoji: '🐶', correct: 'LOG', choices: ['LOG', 'SUN', 'KITE'] },
  { word: 'RAIN', emoji: '🌧️', correct: 'TRAIN', choices: ['TRAIN', 'MOON', 'FROG'] },
  { word: 'STAR', emoji: '⭐', correct: 'CAR', choices: ['CAR', 'PIG', 'LEAF'] },
  { word: 'BOOK', emoji: '📚', correct: 'COOK', choices: ['COOK', 'JUMP', 'WAVE'] },
  { word: 'FISH', emoji: '🐟', correct: 'DISH', choices: ['DISH', 'TREE', 'SAND'] },
  { word: 'BEAR', emoji: '🐻', correct: 'PEAR', choices: ['PEAR', 'DUCK', 'KITE'] },
  { word: 'FROG', emoji: '🐸', correct: 'LOG', choices: ['LOG', 'SHIP', 'BELL'] },
  { word: 'MOON', emoji: '🌙', correct: 'SPOON', choices: ['SPOON', 'ROCK', 'LAMP'] },
  { word: 'RING', emoji: '💍', correct: 'KING', choices: ['KING', 'NOSE', 'BOOT'] },
  { word: 'BALL', emoji: '⚽', correct: 'WALL', choices: ['WALL', 'TREE', 'FISH'] },
  { word: 'BOAT', emoji: '⛵', correct: 'COAT', choices: ['COAT', 'BIRD', 'JUMP'] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RhymingPage() {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const shuffledChoices = (selected === null)
    ? shuffle(current.choices)
    : current.choices;

  // Keep choices stable once shown
  const [displayChoices] = useState(() => questions.map(q => shuffle(q.choices)));

  const pick = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === current.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-black sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
            <h1 className="text-white font-light text-lg">Rhyming Words</h1>
            <div className="w-24" />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-[24px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.18)] text-center">
            <div className="text-7xl mb-6">🎊</div>
            <h2 className="text-[36px] font-light text-black mb-3">Well done!</h2>
            <p className="text-[#6b6b6b] text-lg mb-8">
              You scored <strong className="text-[#0070cc]">{score}</strong> out of{' '}
              <strong className="text-[#0070cc]">{questions.length}</strong>
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
          <h1 className="text-white font-light text-lg">Rhyming Words</h1>
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

          {/* Question */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-10 text-center mb-8">
            <div className="text-7xl mb-4">{current.emoji}</div>
            <p className="text-[#6b6b6b] text-sm mb-2">Find the word that rhymes with:</p>
            <h2 className="text-[48px] font-light text-black tracking-tight">{current.word}</h2>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-3 gap-4">
            {displayChoices[index].map(choice => {
              const isSelected = selected === choice;
              const isCorrect = choice === current.correct;
              let cls =
                'py-4 rounded-[16px] text-lg font-semibold transition-all duration-180 border-2 ';
              if (selected === null) {
                cls += 'bg-[#0070cc] text-white border-[#0070cc] hover:bg-[#1eaedb] hover:border-white hover:shadow-[0_0_0_2px_#0070cc] hover:scale-110 cursor-pointer';
              } else if (isCorrect) {
                cls += 'bg-[#f0fdf4] border-[#22c55e] text-[#16a34a]';
              } else if (isSelected && !isCorrect) {
                cls += 'bg-[#fef2f2] border-[#ef4444] text-[#dc2626]';
              } else {
                cls += 'bg-[#f5f5f5] border-[#e0e0e0] text-[#9b9b9b]';
              }
              return (
                <button key={choice} onClick={() => pick(choice)} className={cls}>
                  {isCorrect && selected !== null ? '✓ ' : isSelected && !isCorrect ? '✗ ' : ''}
                  {choice}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-6 text-center">
              {selected === current.correct ? (
                <p className="text-[#16a34a] font-semibold mb-4">
                  🎉 Yes! <strong>{current.correct}</strong> rhymes with <strong>{current.word}</strong>!
                </p>
              ) : (
                <p className="text-[#dc2626] font-semibold mb-4">
                  The answer was <strong>{current.correct}</strong> — it rhymes with {current.word}!
                </p>
              )}
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
