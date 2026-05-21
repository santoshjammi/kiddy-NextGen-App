'use client';

import { useState, useEffect } from 'react';
import { Operation } from './types';

interface ColumnGridProps {
  operation: Operation;
  numbers: number[];
  onCorrect: () => void;
  onWrong: () => void;
}

/** Zero-pad `num` to `width` digits, returned as an array of character strings. */
function getDigits(num: number, width: number): string[] {
  return num.toString().padStart(width, '0').split('');
}

/** Returns true when the digit at `index` is a leading zero for `num`. */
function isLeading(index: number, numWidth: number, displayWidth: number): boolean {
  return index < displayWidth - numWidth;
}

const OP_SYMBOLS: Record<Operation, string> = { '+': '+', '-': '−', '*': '×' };

const COLUMN_LABELS: Record<number, string[]> = {
  2: ['T', 'U'],
  3: ['H', 'T', 'U'],
  4: ['Th', 'H', 'T', 'U'],
  5: ['TTh', 'Th', 'H', 'T', 'U'],
  6: ['HTh', 'TTh', 'Th', 'H', 'T', 'U'],
};

export default function ColumnGrid({ operation, numbers, onCorrect, onWrong }: ColumnGridProps) {
  const [a, b] = numbers;
  const correctResult =
    operation === '+' ? a + b : operation === '-' ? a - b : a * b;

  const displayWidth = Math.max(
    a.toString().length,
    b.toString().length,
    correctResult.toString().length
  );

  const aDigits = getDigits(a, displayWidth);
  const bDigits = getDigits(b, displayWidth);
  const columnLabels =
    COLUMN_LABELS[displayWidth] ??
    Array.from({ length: displayWidth }, (_, i) => String(displayWidth - i));

  const [carryInputs, setCarryInputs] = useState<string[]>(
    Array(displayWidth).fill('')
  );
  const [answerInputs, setAnswerInputs] = useState<string[]>(
    Array(displayWidth).fill('')
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    setCarryInputs(Array(displayWidth).fill(''));
    setAnswerInputs(Array(displayWidth).fill(''));
    setFeedback(null);
  }, [a, b, displayWidth]);

  const verify = () => {
    const studentAnswer = parseInt(answerInputs.join(''), 10);
    if (!isNaN(studentAnswer) && studentAnswer === correctResult) {
      setFeedback('correct');
      setTimeout(onCorrect, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1800);
      onWrong();
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {/* Column header labels */}
      <div className="flex">
        <div className="w-10" />
        {columnLabels.map((label, i) => (
          <div
            key={i}
            className="w-12 text-center text-xs font-bold text-indigo-400 uppercase tracking-wider"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Carry row — hidden for multiplication (different algorithm) */}
      {operation !== '*' && (
        <div className="flex">
          <div className="w-10" />
          {carryInputs.map((val, i) => (
            <div key={i} className="w-12 flex justify-center">
              <input
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => {
                  const next = [...carryInputs];
                  next[i] = e.target.value.replace(/\D/, '');
                  setCarryInputs(next);
                }}
                className="w-7 h-6 text-center text-xs bg-yellow-50 border border-dashed border-yellow-400 rounded text-orange-600 font-bold focus:outline-none"
                placeholder="·"
                aria-label={`Carry digit for column ${columnLabels[i]}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* First operand */}
      <div className="flex">
        <div className="w-10" />
        {aDigits.map((d, i) => (
          <div key={i} className="w-12 text-center text-3xl font-bold text-gray-800">
            {isLeading(i, a.toString().length, displayWidth) ? '' : d}
          </div>
        ))}
      </div>

      {/* Second operand with operation symbol */}
      <div className="flex items-center">
        <div className="w-10 text-3xl font-bold text-indigo-500 text-right pr-1">
          {OP_SYMBOLS[operation]}
        </div>
        {bDigits.map((d, i) => (
          <div key={i} className="w-12 text-center text-3xl font-bold text-gray-800">
            {isLeading(i, b.toString().length, displayWidth) ? '' : d}
          </div>
        ))}
      </div>

      {/* Horizontal vinculum */}
      <div className="flex">
        <div className="w-10" />
        {Array(displayWidth)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="w-12 border-t-2 border-gray-700" />
          ))}
      </div>

      {/* Answer input row */}
      <div className="flex mt-1">
        <div className="w-10" />
        {answerInputs.map((val, i) => (
          <div key={i} className="w-12 flex justify-center">
            <input
              type="text"
              maxLength={1}
              inputMode="numeric"
              value={val}
              onChange={(e) => {
                const next = [...answerInputs];
                next[i] = e.target.value.replace(/\D/, '');
                setAnswerInputs(next);
              }}
              className={`w-10 h-12 text-center text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                feedback === 'correct'
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : feedback === 'wrong'
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-indigo-300 bg-indigo-50 text-indigo-700 focus:ring-indigo-300'
              }`}
              aria-label={`Answer digit for column ${columnLabels[i]}`}
            />
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <p className="text-xl font-bold text-green-500 mt-3">
          🎉 Correct! = {correctResult.toLocaleString()}
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="text-xl font-bold text-red-500 mt-3">
          ❌ Not quite! Answer: {correctResult.toLocaleString()}
        </p>
      )}

      {!feedback && (
        <button
          onClick={verify}
          className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-md"
        >
          Check ✓
        </button>
      )}
    </div>
  );
}
