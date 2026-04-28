'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';

// ── Config ────────────────────────────────────────────────────────
// Level 1: divide into 2–3 equal groups (÷2, ÷3)
// Level 2: divide into 2–5 equal groups
// Level 3: divide into 2–9 equal groups (÷2–÷9, no remainders)
// Level 4+: larger dividends, ÷2–÷12

function getDivisorRange(level: number): { min: number; max: number } {
  if (level <= 1) return { min: 2, max: 3 };
  if (level === 2) return { min: 2, max: 5 };
  if (level === 3) return { min: 2, max: 9 };
  return { min: 2, max: 12 };
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Problem {
  dividend: number;
  divisor: number;
  answer: number;    // quotient
  choices: number[];
  items: string;     // emoji used for visual groups
}

const EMOJIS = ['🍎', '⭐', '🐱', '🎈', '🍕', '🌸', '🐶', '🎮', '🦋', '🍭'];

function generateProblem(level: number): Problem {
  const { min, max } = getDivisorRange(level);
  const divisor = rand(min, max);
  // Pick a clean quotient (no remainders)
  const maxQ = level <= 2 ? 5 : level <= 3 ? 9 : 12;
  const answer = rand(1, maxQ);
  const dividend = divisor * answer;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  // 4 unique choices near the answer
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = answer + rand(-3, 3);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const choices = [answer, ...wrongs].sort(() => Math.random() - 0.5);
  return { dividend, divisor, answer, choices, items: emoji };
}

// ── Visual groups: render dividend items split into divisor groups ─
function VisualGroups({ dividend, divisor, answer, emoji, revealed }: {
  dividend: number; divisor: number; answer: number; emoji: string; revealed: boolean;
}) {
  const groups = Array.from({ length: divisor }, (_, g) => (
    <div
      key={g}
      className="flex flex-wrap gap-1 justify-center items-center bg-[#f5f7fa] border-2 border-dashed border-[#cccccc] rounded-[16px] p-3 min-w-[80px] min-h-[80px]"
    >
      {revealed
        ? Array.from({ length: answer }).map((_, i) => (
            <span key={i} className="text-2xl select-none">{emoji}</span>
          ))
        : <span className="text-[#cccccc] text-3xl">?</span>
      }
    </div>
  ));
  return (
    <div className="flex flex-wrap gap-3 justify-center items-start">
      {groups}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function DivisionSplitterPage() {
  const { progress, recordSolve } = useSubjectProgress('division');
  const { recordCorrect, logSession } = useRewards();
  const level = progress.difficulty_level;
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'division', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [problem, setProblem] = useState<Problem>(() => generateProblem(1));
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const next = useCallback(() => {
    setProblem(generateProblem(level));
    setSelected(null);
    setFeedback(null);
  }, [level]);

  const handleChoice = async (choice: number) => {
    if (feedback) return;
    setSelected(choice);
    const correct = choice === problem.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setStreak(s => correct ? s + 1 : 0);
    setSession(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    await recordSolve(correct, correct ? undefined : `division_÷${problem.divisor}`);
    if (correct) recordCorrect('math');
    setTimeout(next, correct ? 1200 : 1800);
  };

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Division Splitter</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Share items equally into groups</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Stats bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#7c3aed] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              Level {level}
            </span>
            <span className="text-[#6b6b6b] text-sm">{session.correct}/{session.total}</span>
          </div>
          <div className="flex items-center gap-3">
            {streak >= 2 && <span className="text-orange-400 text-sm font-bold">🔥 {streak}</span>}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b6b6b]">{progress.mastery_score}%</span>
              <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: `${progress.mastery_score}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Problem card ────────────────────────────────────── */}
        <div
          className="bg-white rounded-[24px] p-6 md:p-10 flex flex-col items-center gap-8"
          style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
        >

          {/* Equation */}
          <div className="flex items-center gap-4">
            <span className="text-[64px] font-light text-black leading-none">{problem.dividend}</span>
            <span className="text-[44px] text-[#7c3aed] font-bold">÷</span>
            <span className="text-[64px] font-light text-black leading-none">{problem.divisor}</span>
            <span className="text-[44px] text-[#6b6b6b]">=</span>
            <span className={`text-[64px] font-bold leading-none transition-colors ${
              feedback === 'correct' ? 'text-green-500' : feedback === 'wrong' ? 'text-red-400' : 'text-gray-300'
            }`}>
              {feedback ? problem.answer : '?'}
            </span>
          </div>

          {/* Word story */}
          <p className="text-center text-gray-500 text-sm">
            Share <strong>{problem.dividend}</strong> {problem.items} equally into{' '}
            <strong>{problem.divisor}</strong> groups. How many in each group?
          </p>

          {/* Visual groups */}
          <VisualGroups
            dividend={problem.dividend}
            divisor={problem.divisor}
            answer={problem.answer}
            emoji={problem.items}
            revealed={feedback === 'correct'}
          />

          {feedback === 'correct' && (
            <p className="text-2xl font-bold text-green-500">
              🎉 {problem.answer} in each group!
            </p>
          )}
          {feedback === 'wrong' && (
            <p className="text-xl font-bold text-red-500">
              The answer is {problem.answer} — {problem.dividend} ÷ {problem.divisor} = {problem.answer}
            </p>
          )}

          {/* Choices */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {problem.choices.map(c => {
              const isSelected = selected === c;
              let cls = 'py-5 text-[32px] font-bold rounded-[20px] border-2 transition-all duration-150 ';
              if (feedback && isSelected) {
                cls += feedback === 'correct'
                  ? 'bg-green-400 border-green-500 text-white scale-105 shadow-lg'
                  : 'bg-red-400 border-red-500 text-white';
              } else if (feedback && c === problem.answer) {
                cls += 'bg-green-100 border-green-400 text-green-700';
              } else {
                cls += 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-800 hover:bg-[#7c3aed] hover:border-[#7c3aed] hover:text-white hover:scale-105 active:scale-95';
              }
              return (
                <button key={c} className={cls} onClick={() => handleChoice(c)} disabled={!!feedback}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tip ───────────────────────────────────────────── */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-4 text-center">
          <p className="text-[#6b6b6b] text-sm">
            Division = sharing equally. {problem.dividend} items shared into {problem.divisor} groups.
            The groups reveal when you answer correctly!
          </p>
        </div>

      </div>
    </div>
  );
}
