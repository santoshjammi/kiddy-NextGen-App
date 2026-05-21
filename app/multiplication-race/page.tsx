'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';

// ── Config ────────────────────────────────────────────────────────
const ROUND_TIME = 20; // seconds per round
const QUESTIONS_PER_ROUND = 5;

// Level 1: ×1–×5 | Level 2: ×1–×10 | Level 3: ×6–×12 | Level 4+: mixed
function getTableRange(level: number): { min: number; max: number } {
  if (level <= 1) return { min: 1, max: 5 };
  if (level === 2) return { min: 1, max: 10 };
  if (level === 3) return { min: 6, max: 12 };
  return { min: 2, max: 12 };
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Problem {
  a: number;
  b: number;
  answer: number;
  choices: number[];
}

function generateProblem(level: number): Problem {
  const { min, max } = getTableRange(level);
  const a = rand(min, max);
  const b = rand(1, 12);
  const answer = a * b;

  // Build 4 unique wrong choices close to the answer
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const noise = rand(-12, 12);
    const w = answer + noise;
    if (w !== answer && w > 0) wrongs.add(w);
  }
  const choices = [answer, ...wrongs].sort(() => Math.random() - 0.5);
  return { a, b, answer, choices };
}

// Local high-score key
const HS_KEY = 'kiddy_mult_hs';

function getHighScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(HS_KEY) ?? '0', 10);
}
function setHighScore(s: number) {
  if (typeof window !== 'undefined') localStorage.setItem(HS_KEY, s.toString());
}

// ── Main component ────────────────────────────────────────────────
export default function MultiplicationRacePage() {
  const { progress, recordSolve } = useSubjectProgress('multiplication');
  const { recordCorrect, logSession } = useRewards();
  const level = progress.difficulty_level;
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'multiplication', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type Phase = 'idle' | 'playing' | 'summary';
  const [phase, setPhase] = useState<Phase>('idle');
  const [problem, setProblem] = useState<Problem>(() => generateProblem(1));
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundStats, setRoundStats] = useState({ correct: 0, total: 0, streak: 0 });
  const [highScore, setHighScoreState] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionCount = useRef(0);

  useEffect(() => {
    setHighScoreState(getHighScore());
  }, []);

  const endRound = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('summary');
  }, []);

  const startRound = useCallback(() => {
    questionCount.current = 0;
    setRoundStats({ correct: 0, total: 0, streak: 0 });
    setProblem(generateProblem(level));
    setSelected(null);
    setFeedback(null);
    setTimeLeft(ROUND_TIME);
    setPhase('playing');
  }, [level]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endRound(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, endRound]);

  // Update high score on round end
  useEffect(() => {
    if (phase !== 'summary') return;
    const hs = getHighScore();
    if (roundStats.correct > hs) {
      setHighScore(roundStats.correct);
      setHighScoreState(roundStats.correct);
    }
  }, [phase, roundStats.correct]);

  const nextProblem = useCallback(() => {
    questionCount.current += 1;
    if (questionCount.current >= QUESTIONS_PER_ROUND) {
      endRound();
      return;
    }
    setProblem(generateProblem(level));
    setSelected(null);
    setFeedback(null);
  }, [level, endRound]);

  const handleChoice = async (choice: number) => {
    if (feedback || phase !== 'playing') return;
    setSelected(choice);
    const correct = choice === problem.answer;
    setFeedback(correct ? 'correct' : 'wrong');

    setRoundStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      streak: correct ? s.streak + 1 : 0,
    }));

    await recordSolve(correct, correct ? undefined : `mult_table_${problem.a}`);
    if (correct) recordCorrect('math');

    setTimeout(nextProblem, correct ? 700 : 1200);
  };

  const timerPct = (timeLeft / ROUND_TIME) * 100;
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Multiplication Race</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Beat the clock — answer fast!</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-8">

        {/* ── Idle / Start screen ─────────────────────────── */}
        {phase === 'idle' && (
          <div
            className="bg-white rounded-[24px] p-10 flex flex-col items-center gap-6 text-center"
            style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
          >
            <div className="text-7xl">🏎️</div>
            <h2 className="text-[28px] font-light text-black">Multiplication Race</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Answer as many multiplication questions as you can in {ROUND_TIME} seconds!<br />
              Level {level} — {getTableRange(level).min}× to {getTableRange(level).max}×
            </p>
            {highScore > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-[12px] px-5 py-2">
                <span className="text-yellow-700 text-sm font-semibold">🏆 High Score: {highScore}</span>
              </div>
            )}
            <button onClick={startRound} className="ps-btn text-lg px-10 py-4 mt-2">
              Start Race! 🚀
            </button>
          </div>
        )}

        {/* ── Playing ─────────────────────────────────────── */}
        {phase === 'playing' && (
          <div className="flex flex-col gap-5">

            {/* Timer bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#6b6b6b] font-semibold">⏱️ {timeLeft}s left</span>
                <span className="text-[#6b6b6b]">{roundStats.correct} correct · streak {roundStats.streak}</span>
              </div>
              <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
                />
              </div>
            </div>

            {/* Problem card */}
            <div
              className="bg-white rounded-[24px] p-8 md:p-12 flex flex-col items-center gap-8"
              style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
            >
              {/* Equation */}
              <div className="flex items-center gap-4">
                <span className="text-[72px] font-light text-black leading-none">{problem.a}</span>
                <span className="text-[48px] text-[#0070cc] font-bold">×</span>
                <span className="text-[72px] font-light text-black leading-none">{problem.b}</span>
                <span className="text-[48px] text-[#6b6b6b]">=</span>
                <span className={`text-[72px] font-bold leading-none transition-colors ${
                  feedback === 'correct' ? 'text-green-500' : feedback === 'wrong' ? 'text-red-400' : 'text-gray-300'
                }`}>?</span>
              </div>

              {feedback === 'correct' && <p className="text-2xl font-bold text-green-500">⚡ Correct!</p>}
              {feedback === 'wrong' && <p className="text-xl font-bold text-red-500">Answer: {problem.answer}</p>}

              {/* Choice buttons */}
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
                    cls += 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-800 hover:bg-[#0070cc] hover:border-[#0070cc] hover:text-white hover:scale-105 active:scale-95';
                  }
                  return (
                    <button key={c} className={cls} onClick={() => handleChoice(c)} disabled={!!feedback}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Summary ─────────────────────────────────────── */}
        {phase === 'summary' && (
          <div
            className="bg-white rounded-[24px] p-10 flex flex-col items-center gap-6 text-center"
            style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
          >
            <div className="text-7xl">{roundStats.correct >= 4 ? '🏆' : roundStats.correct >= 2 ? '👍' : '💪'}</div>
            <h2 className="text-[28px] font-light text-black">Round Complete!</h2>

            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="bg-[#f5f7fa] rounded-[16px] p-4">
                <div className="text-3xl font-bold text-[#0070cc]">{roundStats.correct}</div>
                <div className="text-xs text-[#6b6b6b] mt-1">Correct</div>
              </div>
              <div className="bg-[#f5f7fa] rounded-[16px] p-4">
                <div className="text-3xl font-bold text-black">{roundStats.total}</div>
                <div className="text-xs text-[#6b6b6b] mt-1">Answered</div>
              </div>
              <div className="bg-[#f5f7fa] rounded-[16px] p-4">
                <div className="text-3xl font-bold text-yellow-500">{roundStats.streak}</div>
                <div className="text-xs text-[#6b6b6b] mt-1">Best Streak</div>
              </div>
            </div>

            {roundStats.correct === highScore && highScore > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-[12px] px-5 py-2">
                <span className="text-yellow-700 text-sm font-bold">🎉 New High Score!</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={startRound} className="ps-btn flex-1 py-4">
                Play Again 🔄
              </button>
              <Link href="/math" className="ps-btn-ghost-outer flex-1 py-4 text-center rounded-full border-2 border-[#0070cc] text-[#0070cc] font-semibold hover:bg-[#0070cc] hover:text-white transition-colors">
                Full Math Engine →
              </Link>
            </div>
          </div>
        )}

        {/* ── Mastery footer ───────────────────────────────── */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#6b6b6b]">
          <span>Level {level} mastery: {progress.mastery_score}%</span>
          <span>Solved: {progress.total_problems_solved}</span>
        </div>

      </div>
    </div>
  );
}
