'use client';

import { useState, useEffect } from 'react';

interface VisualBlocksProps {
  operation: '+' | '-';
  numbers: number[];
  onCorrect: () => void;
  onWrong: () => void;
}

function DotGrid({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-[160px]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`w-7 h-7 rounded-full ${color} shadow-sm`} />
      ))}
    </div>
  );
}

export default function VisualBlocks({ operation, numbers, onCorrect, onWrong }: VisualBlocksProps) {
  const [a, b] = numbers;
  const correctAnswer = operation === '+' ? a + b : a - b;
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const wrong = new Set<number>();
    let attempts = 0;
    while (wrong.size < 3 && attempts < 50) {
      attempts++;
      const offset = Math.floor(Math.random() * 4) + 1;
      const candidate = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
      if (candidate !== correctAnswer && candidate >= 0 && candidate <= 18) wrong.add(candidate);
    }
    setOptions([...wrong, correctAnswer].sort(() => Math.random() - 0.5));
    setSelected(null);
    setFeedback(null);
  }, [a, b, operation, correctAnswer]);

  const handleSelect = (opt: number) => {
    if (feedback) return;
    setSelected(opt);
    if (opt === correctAnswer) {
      setFeedback('correct');
      setTimeout(onCorrect, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setSelected(null); setFeedback(null); }, 1000);
      onWrong();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Visual dot representation */}
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <div className="text-center">
          <DotGrid count={a} color="bg-indigo-400" />
          <span className="text-3xl font-bold text-indigo-600 mt-2 block">{a}</span>
        </div>
        <span className="text-5xl font-bold text-gray-400">{operation}</span>
        <div className="text-center">
          <DotGrid count={b} color="bg-pink-400" />
          <span className="text-3xl font-bold text-pink-600 mt-2 block">{b}</span>
        </div>
        <span className="text-5xl font-bold text-gray-400">=</span>
        <span className="text-6xl font-bold text-gray-200">?</span>
      </div>

      <p className="text-gray-500 font-medium">Pick the correct answer!</p>

      {/* Multiple choice options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => {
          let cls =
            'w-24 h-24 text-4xl font-bold rounded-2xl border-2 transition-all shadow-md ';
          if (selected === opt) {
            cls +=
              feedback === 'correct'
                ? 'bg-green-400 border-green-500 text-white scale-110'
                : 'bg-red-400 border-red-500 text-white scale-95';
          } else {
            cls +=
              'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:scale-105 hover:border-indigo-400';
          }
          return (
            <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <p className="text-2xl font-bold text-green-500">🎉 Brilliant!</p>
      )}
      {feedback === 'wrong' && (
        <p className="text-2xl font-bold text-red-500">Try again! 💪</p>
      )}
    </div>
  );
}
