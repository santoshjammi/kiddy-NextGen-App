'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';

// ── Types ─────────────────────────────────────────────────────────
type GameLevel = 1 | 2 | 3 | 4 | 5;
type GameOp = '+' | '-';

interface Problem {
  a: number;
  b: number;
  op: GameOp;
  answer: number;
  width: number;
}

// ── Level config ─────────────────────────────────────────────────
const LEVEL_INFO: Record<GameLevel, { label: string; desc: string; badge: string }> = {
  1: { badge: '🌱', label: 'Starter',  desc: '2-Digit Addition — No Carry'        },
  2: { badge: '📦', label: 'Carry',    desc: '2-Digit Addition with Carry'        },
  3: { badge: '🔄', label: 'Borrow',   desc: '2-Digit Subtraction with Borrow'   },
  4: { badge: '⚡', label: 'Expert',   desc: '3-Digit Addition with Carry'        },
  5: { badge: '🏆', label: 'Master',   desc: '3-Digit Subtraction with Borrow'   },
};

const COL_LABELS: Record<number, string[]> = {
  2: ['T', 'U'],
  3: ['H', 'T', 'U'],
  4: ['Th', 'H', 'T', 'U'],
};

// ── Helpers ──────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getDigits(n: number, width: number): string[] {
  return n.toString().padStart(width, '0').split('');
}

// ── Problem generator ─────────────────────────────────────────────
function generateProblem(level: GameLevel): Problem {
  let a: number, b: number, op: GameOp;

  switch (level) {
    case 1: {
      // 2-digit addition, NO carry in units
      const au = rand(0, 4), bu = rand(0, Math.min(4, 9 - au));
      const at = rand(1, 4), bt = rand(1, 9 - at);
      a = at * 10 + au; b = bt * 10 + bu; op = '+';
      break;
    }
    case 2: {
      // 2-digit addition WITH carry: units sum ≥ 10
      const bu = rand(1, 9);
      const au = rand(Math.max(1, 10 - bu), 9);
      const at = rand(1, 8), bt = rand(1, 9 - at);
      a = at * 10 + au; b = bt * 10 + bu; op = '+';
      break;
    }
    case 3: {
      // 2-digit subtraction WITH borrow: units of a < units of b
      const bu = rand(2, 9);
      const au = rand(0, bu - 1);
      const at = rand(2, 9), bt = rand(1, at - 1);
      a = at * 10 + au; b = bt * 10 + bu; op = '-';
      break;
    }
    case 4: {
      // 3-digit addition WITH carry in both units and tens
      const au = rand(5, 9), bu = rand(10 - au, 9);
      const at = rand(4, 9), bt = rand(10 - at, 9);
      const ah = rand(1, 4), bh = rand(1, 9 - ah);
      a = ah * 100 + at * 10 + au;
      b = bh * 100 + bt * 10 + bu;
      op = '+';
      break;
    }
    case 5: {
      // 3-digit subtraction WITH borrow
      const bu = rand(2, 9), au = rand(0, bu - 1);
      const at = rand(2, 9), bt = rand(1, at - 1);
      const ah = rand(2, 9), bh = rand(1, ah - 1);
      a = ah * 100 + at * 10 + au;
      b = bh * 100 + bt * 10 + bu;
      op = '-';
      break;
    }
    default: { a = 47; b = 35; op = '+'; }
  }

  const answer = op === '+' ? a + b : a - b;
  const width = Math.max(
    a.toString().length,
    b.toString().length,
    answer.toString().length,
  );
  return { a, b, op, answer, width };
}

// ── Component ─────────────────────────────────────────────────────
export default function CarryBorrowPage() {
  const { progress, recordSolve } = useSubjectProgress('carry-borrow');
  const level = (Math.min(5, progress.difficulty_level) as GameLevel);

  const [problem, setProblem]       = useState<Problem>(() => generateProblem(1));
  const [problemKey, setProblemKey] = useState(0);
  const [carryInputs, setCarryInputs] = useState<string[]>([]);
  const [answerInputs, setAnswerInputs] = useState<string[]>([]);
  const [feedback, setFeedback]     = useState<'correct' | 'wrong' | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [streak, setStreak]         = useState(0);
  const [session, setSession]       = useState({ correct: 0, total: 0 });

  // Reset inputs whenever the problem changes
  useEffect(() => {
    setCarryInputs(Array(problem.width).fill(''));
    setAnswerInputs(Array(problem.width).fill(''));
    setFeedback(null);
    setShowSolution(false);
  }, [problem]);

  // Sync level when progress updates
  const nextProblem = useCallback(() => {
    const newLevel = (Math.min(5, progress.difficulty_level) as GameLevel);
    setProblem(generateProblem(newLevel));
    setProblemKey(k => k + 1);
  }, [progress.difficulty_level]);

  const handleCheck = async () => {
    const studentAnswer = parseInt(answerInputs.join(''), 10);
    const correct = !isNaN(studentAnswer) && studentAnswer === problem.answer;

    setFeedback(correct ? 'correct' : 'wrong');
    setStreak(s => correct ? s + 1 : 0);
    setSession(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

    await recordSolve(
      correct,
      correct ? undefined : `level_${level}_${problem.op === '+' ? 'carry' : 'borrow'}`,
    );

    if (correct) {
      setTimeout(nextProblem, 1400);
    } else {
      setShowSolution(true);
      setTimeout(nextProblem, 3200);
    }
  };

  const { a, b, op, answer, width } = problem;
  const aDigits   = getDigits(a, width);
  const bDigits   = getDigits(b, width);
  const ansDigits = getDigits(answer, width);
  const colLabels = COL_LABELS[width] ?? Array.from({ length: width }, (_, i) => String(width - i));
  const opSymbol  = op === '+' ? '+' : '−';
  const isAdd     = op === '+';
  const info      = LEVEL_INFO[level];

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Carry &amp; Borrow Grid</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">{info.desc}</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Stats strip ─────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#0070cc] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              {info.badge} Level {level} · {info.label}
            </span>
            <span className="text-[#6b6b6b] text-sm">
              {session.correct}/{session.total} correct
            </span>
          </div>
          <div className="flex items-center gap-4">
            {streak >= 2 && (
              <span className="text-orange-400 font-bold text-sm">🔥 {streak} streak!</span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b6b6b]">Mastery {progress.mastery_score}%</span>
              <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0070cc] rounded-full transition-all duration-700"
                  style={{ width: `${progress.mastery_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main game card ───────────────────────────────── */}
        <div
          className="bg-white rounded-[24px] p-8 md:p-14 flex flex-col items-center gap-8"
          style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
        >
          {/* Teaching hint */}
          <p className="text-[#6b6b6b] text-sm text-center max-w-md">
            {isAdd
              ? 'Work right to left. When a column adds up to 10 or more, write the carry digit in the orange box above the next column.'
              : 'Work right to left. When the top digit is smaller, borrow 10 from the next column and reduce it by 1.'}
          </p>

          {/* Grid */}
          <div className="flex flex-col items-center gap-0 select-none" key={problemKey}>

            {/* Column labels */}
            <div className="flex">
              <div className="w-14" />
              {colLabels.map((lbl, i) => (
                <div key={i} className="w-14 text-center text-xs font-bold text-[#0070cc] uppercase tracking-widest pb-1">
                  {lbl}
                </div>
              ))}
            </div>

            {/* Carry row — addition only */}
            {isAdd && (
              <>
                <div className="flex mb-1">
                  <div className="w-14" />
                  {carryInputs.map((val, i) => (
                    <div key={i} className="w-14 flex justify-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={e => {
                          const next = [...carryInputs];
                          next[i] = e.target.value.replace(/\D/, '').slice(-1);
                          setCarryInputs(next);
                        }}
                        disabled={!!feedback}
                        placeholder="·"
                        aria-label={`Carry in ${colLabels[i]} column`}
                        className="w-8 h-7 text-center text-xs bg-orange-50 border-2 border-dashed border-orange-300 rounded text-orange-600 font-bold focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-orange-400 self-end pr-2 mb-2">↑ carry boxes (optional)</p>
              </>
            )}

            {/* Number A */}
            <div className="flex items-center">
              <div className="w-14" />
              {aDigits.map((d, i) => {
                const leading = d === '0' && i < width - a.toString().length;
                return (
                  <div key={i} className="w-14 text-center text-[42px] font-bold text-gray-900 leading-none py-1">
                    {leading ? '' : d}
                  </div>
                );
              })}
            </div>

            {/* Number B with op symbol */}
            <div className="flex items-center">
              <div className="w-14 text-[42px] font-bold text-[#0070cc] text-right pr-2 leading-none py-1">
                {opSymbol}
              </div>
              {bDigits.map((d, i) => {
                const leading = d === '0' && i < width - b.toString().length;
                return (
                  <div key={i} className="w-14 text-center text-[42px] font-bold text-gray-900 leading-none py-1">
                    {leading ? '' : d}
                  </div>
                );
              })}
            </div>

            {/* Vinculum */}
            <div className="flex mt-1 mb-3">
              <div className="w-14" />
              {Array(width).fill(null).map((_, i) => (
                <div key={i} className="w-14 border-t-[3px] border-gray-800" />
              ))}
            </div>

            {/* Answer inputs */}
            <div className="flex">
              <div className="w-14" />
              {answerInputs.map((val, i) => {
                const solved = showSolution;
                const cls = solved
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : feedback === 'correct'
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : feedback === 'wrong'
                  ? 'border-red-400 bg-red-50 text-red-500'
                  : 'border-[#0070cc] bg-blue-50 text-[#0070cc] focus:ring-2 focus:ring-[#0070cc]/20';
                return (
                  <div key={i} className="w-14 flex justify-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={solved ? ansDigits[i] : val}
                      onChange={e => {
                        if (feedback) return;
                        const next = [...answerInputs];
                        next[i] = e.target.value.replace(/\D/, '').slice(-1);
                        setAnswerInputs(next);
                      }}
                      disabled={!!feedback}
                      aria-label={`Answer ${colLabels[i]}`}
                      className={`w-12 h-16 text-center text-[38px] font-bold border-2 rounded-xl focus:outline-none transition-all duration-200 ${cls}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Solution label */}
            {showSolution && (
              <p className="text-amber-600 text-sm font-medium mt-3">
                ✏️ The answer is <strong>{answer.toLocaleString()}</strong> — shown above
              </p>
            )}
          </div>

          {/* Feedback + action */}
          <div className="flex flex-col items-center gap-3 w-full">
            {feedback === 'correct' && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">🎉 Correct!</p>
                <p className="text-green-600 text-sm mt-1">
                  {a.toLocaleString()} {opSymbol} {b.toLocaleString()} = {answer.toLocaleString()}
                </p>
              </div>
            )}
            {feedback === 'wrong' && (
              <p className="text-xl font-bold text-red-500">❌ Not quite — study the answer above</p>
            )}

            {!feedback && (
              <>
                <button
                  onClick={handleCheck}
                  disabled={answerInputs.some(v => v === '')}
                  className="ps-btn text-lg px-12 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Check Answer ✓
                </button>
                <button
                  onClick={nextProblem}
                  className="text-sm text-[#6b6b6b] hover:text-[#0070cc] transition-colors"
                >
                  Skip →
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── How it works ────────────────────────────────── */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-6">
          <h3 className="text-white font-semibold mb-4 text-sm">How column math works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#6b6b6b] text-sm leading-relaxed">
            <div>
              <p className="text-white text-xs font-semibold mb-2">➕ Addition — Carrying</p>
              <p>
                Start from the Units column. If two digits add up to 10 or more,
                write the ones digit in the answer and carry the 1 to the next column to the left.
              </p>
              <div className="mt-3 bg-[#1a1a1a] rounded-lg p-3 font-mono text-xs text-orange-300">
                <div>&nbsp;&nbsp;&nbsp;¹</div>
                <div>&nbsp;&nbsp;4 7</div>
                <div>+ 3 5</div>
                <div className="border-t border-[#333] mt-1 pt-1 text-white">= 8 2</div>
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-semibold mb-2">➖ Subtraction — Borrowing</p>
              <p>
                If the top digit is smaller than the bottom, borrow 10 from the next
                column to the left — reduce that digit by 1 and add 10 to your current column.
              </p>
              <div className="mt-3 bg-[#1a1a1a] rounded-lg p-3 font-mono text-xs text-cyan-300">
                <div>&nbsp;&nbsp;⁶¹²</div>
                <div>&nbsp;&nbsp;7 2</div>
                <div>− 4 7</div>
                <div className="border-t border-[#333] mt-1 pt-1 text-white">= 2 5</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
