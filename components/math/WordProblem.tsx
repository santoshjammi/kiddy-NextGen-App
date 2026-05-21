'use client';

import { useState, useEffect } from 'react';
import { Operation } from './types';

interface WordProblemProps {
  operation: Operation;
  numbers: number[];
  onCorrect: () => void;
  onWrong: () => void;
}

type TemplateFn = (a: number, b: number) => string;

const TEMPLATES: Record<string, TemplateFn[]> = {
  '+': [
    (a, b) =>
      `A space explorer found ${a.toLocaleString()} stars in one galaxy and ${b.toLocaleString()} stars in another. How many stars are there in total?`,
    (a, b) =>
      `A toy factory made ${a.toLocaleString()} robots on Monday and ${b.toLocaleString()} on Tuesday. How many robots were made altogether?`,
    (a, b) =>
      `There are ${a.toLocaleString()} fish in the Pacific Ocean and ${b.toLocaleString()} in the Atlantic. How many fish are there in total?`,
    (a, b) =>
      `A baker sold ${a.toLocaleString()} cupcakes in the morning and ${b.toLocaleString()} in the afternoon. How many were sold in all?`,
  ],
  '-': [
    (a, b) =>
      `A spaceship started with ${a.toLocaleString()} fuel pods. It used ${b.toLocaleString()} pods to reach the moon. How many pods are left?`,
    (a, b) =>
      `A library had ${a.toLocaleString()} books. Students borrowed ${b.toLocaleString()} books. How many books are still on the shelves?`,
    (a, b) =>
      `A farmer harvested ${a.toLocaleString()} apples. She sold ${b.toLocaleString()} at the market. How many apples remain?`,
    (a, b) =>
      `A city had a population of ${a.toLocaleString()} people. ${b.toLocaleString()} people moved away. How many people are left?`,
  ],
  '*': [
    (a, b) =>
      `A school has ${b} classrooms. Each classroom has ${a} students. How many students are there in total?`,
    (a, b) =>
      `A baker makes ${a} cookies every day for ${b} days. How many cookies does she make in total?`,
    (a, b) =>
      `A rocket travels ${a.toLocaleString()} km per hour for ${b} hours. How far does it travel in total?`,
  ],
};

function generateText(operation: Operation, a: number, b: number): string {
  const list = TEMPLATES[operation] ?? TEMPLATES['+'];
  return list[Math.floor(Math.random() * list.length)](a, b);
}

export default function WordProblem({
  operation,
  numbers,
  onCorrect,
  onWrong,
}: WordProblemProps) {
  const [a, b] = numbers;
  const correctAnswer =
    operation === '+' ? a + b : operation === '-' ? a - b : a * b;

  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    setText(generateText(operation, a, b));
    setAnswer('');
    setFeedback(null);
  }, [a, b, operation]);

  const verify = () => {
    const student = parseInt(answer, 10);
    if (!isNaN(student) && student === correctAnswer) {
      setFeedback('correct');
      setTimeout(onCorrect, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1800);
      onWrong();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl w-full">
      {/* Problem text */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-2xl">
        <p className="text-xl text-gray-800 leading-relaxed">{text}</p>
      </div>

      {/* Answer input */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-semibold text-gray-700 whitespace-nowrap">
          Your answer:
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && !feedback && verify()}
          disabled={!!feedback}
          className={`flex-1 text-center text-3xl font-bold border-2 rounded-xl p-3 focus:outline-none focus:ring-2 transition-colors ${
            feedback === 'correct'
              ? 'border-green-400 bg-green-50 text-green-700'
              : feedback === 'wrong'
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-indigo-300 bg-white focus:ring-indigo-300 text-indigo-700'
          }`}
          placeholder="Type your answer…"
        />
      </div>

      {feedback === 'correct' && (
        <p className="text-xl font-bold text-center text-green-500">
          🎉 Amazing! That&apos;s correct!
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="text-xl font-bold text-center text-red-500">
          ❌ Not quite! The answer is {correctAnswer.toLocaleString()}.
        </p>
      )}

      {!feedback && (
        <button
          onClick={verify}
          disabled={!answer}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white px-10 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-md mx-auto"
        >
          Submit Answer ✓
        </button>
      )}
    </div>
  );
}
