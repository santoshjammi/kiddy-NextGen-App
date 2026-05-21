'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PatternQuestion {
  sequence: string[];
  answer: string;
  choices: string[];
}

const QUESTIONS: PatternQuestion[] = [
  { sequence: ['🔴', '🔵', '🔴', '🔵', '?'], answer: '🔴', choices: ['🔴', '🟡', '🟢'] },
  { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'], answer: '🌙', choices: ['🌙', '☀️', '⭐'] },
  { sequence: ['🐱', '🐶', '🐱', '🐶', '?'], answer: '🐱', choices: ['🐱', '🐸', '🐰'] },
  { sequence: ['🔺', '🔷', '🔺', '?'], answer: '🔷', choices: ['🔷', '⭐', '🔴'] },
  { sequence: ['🍎', '🍌', '🍊', '🍎', '🍌', '?'], answer: '🍊', choices: ['🍊', '🍇', '🍎'] },
  { sequence: ['🌸', '🌸', '🌻', '🌸', '🌸', '?'], answer: '🌻', choices: ['🌻', '🌸', '🌹'] },
  { sequence: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣', '?'], answer: '3️⃣', choices: ['3️⃣', '4️⃣', '1️⃣'] },
  { sequence: ['🚗', '🚗', '🚕', '🚗', '🚗', '?'], answer: '🚕', choices: ['🚕', '🚌', '🚗'] },
  { sequence: ['🔵', '🟡', '🟢', '🔵', '?'], answer: '🟡', choices: ['🟡', '🔴', '🟢'] },
  { sequence: ['🐶', '🐶', '🐱', '🐶', '🐶', '?'], answer: '🐱', choices: ['🐱', '🐭', '🐶'] },
  { sequence: ['🎈', '🎀', '🎈', '🎀', '🎈', '?'], answer: '🎀', choices: ['🎀', '🎁', '🎈'] },
  { sequence: ['🌞', '🌧️', '🌞', '🌧️', '?'], answer: '🌞', choices: ['🌞', '🌨️', '⛅'] },
  { sequence: ['🍕', '🍔', '🍕', '🍔', '🍕', '?'], answer: '🍔', choices: ['🍔', '🌮', '🍕'] },
  { sequence: ['🎵', '🎵', '🎶', '🎵', '🎵', '?'], answer: '🎶', choices: ['🎶', '🎸', '🎵'] },
  { sequence: ['🏠', '🌳', '🏠', '🌳', '🏠', '?'], answer: '🌳', choices: ['🌳', '🌺', '🏠'] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PatternsPage() {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [displayChoices] = useState(() => questions.map(q => shuffle(q.choices)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  const pick = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === current.answer) setScore(s => s + 1);
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
            <h1 className="text-white font-light text-lg">Pattern Recognition</h1>
            <div className="w-24" />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-[24px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.18)] text-center">
            <div className="text-7xl mb-6">🧩</div>
            <h2 className="text-[36px] font-light text-black mb-3">Pattern Master!</h2>
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
          <h1 className="text-white font-light text-lg">Pattern Recognition</h1>
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

          <p className="text-[#6b6b6b] text-sm text-center mb-6">
            What comes next in the pattern?
          </p>

          {/* Pattern sequence */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-8 px-4 mb-8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {current.sequence.map((item, i) => (
                <div
                  key={i}
                  className={[
                    'w-14 h-14 rounded-[12px] flex items-center justify-center text-3xl',
                    item === '?'
                      ? 'border-2 border-dashed border-[#0070cc] bg-white text-[#0070cc] text-2xl font-bold'
                      : 'bg-white border border-[#e0e0e0] shadow-sm',
                  ].join(' ')}
                >
                  {item === '?' ? (selected ? current.answer : '?') : item}
                </div>
              ))}
            </div>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-3 gap-4">
            {displayChoices[index].map(choice => {
              const isSelected = selected === choice;
              const isCorrect = choice === current.answer;
              let cls =
                'py-5 rounded-[16px] text-4xl flex items-center justify-center transition-all duration-180 border-2 ';
              if (selected === null) {
                cls += 'bg-white border-[#e0e0e0] hover:bg-[#f5f7fa] hover:border-[#0070cc] hover:scale-110 cursor-pointer shadow-sm';
              } else if (isCorrect) {
                cls += 'bg-[#f0fdf4] border-[#22c55e]';
              } else if (isSelected) {
                cls += 'bg-[#fef2f2] border-[#ef4444]';
              } else {
                cls += 'bg-[#f5f5f5] border-[#e0e0e0] opacity-50';
              }
              return (
                <button key={choice} onClick={() => pick(choice)} className={cls}>
                  {choice}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-6 text-center">
              {selected === current.answer ? (
                <p className="text-[#16a34a] font-semibold mb-4">🎉 Correct! Great pattern skills!</p>
              ) : (
                <p className="text-[#dc2626] font-semibold mb-4">
                  The answer was <strong>{current.answer}</strong>. Keep practising!
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
