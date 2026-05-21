'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import VisualBlocks from './VisualBlocks';
import ColumnGrid from './ColumnGrid';
import WordProblem from './WordProblem';
import { DifficultyLevel, Operation, ProblemState } from './types';
import { useSubjectProgress } from '../useSubjectProgress';
import { useRewards } from '../useRewards';

const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  1: '1-Digit',
  2: '2-Digit',
  3: '3-Digit',
  4: '4-Digit',
  5: '5-Digit',
};

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblemForLevel(level: DifficultyLevel): ProblemState {
  const ranges: Record<DifficultyLevel, [number, number]> = {
    1: [1, 9],
    2: [10, 99],
    3: [100, 999],
    4: [1000, 9999],
    5: [10000, 99999],
  };

  const [min, max] = ranges[level];

  // Level 3 occasionally introduces 1-digit multiplication
  if (level === 3 && Math.random() > 0.65) {
    const a = rand(100, 999);
    const b = rand(2, 9);
    return { operation: '*', operands: [a, b], difficultyLevel: level };
  }

  const ops: Operation[] = ['+', '-'];
  const operation = ops[Math.floor(Math.random() * ops.length)];

  let a = rand(min, max);
  let b = rand(min, max);
  // Ensure no negative results for subtraction
  if (operation === '-' && a < b) [a, b] = [b, a];

  return { operation, operands: [a, b], difficultyLevel: level };
}

export default function MathEngine() {
  const { progress, recordSolve } = useSubjectProgress('mathematics');
  const { logSession } = useRewards();
  const sessionStart = useRef(Date.now());
  const [problem, setProblem] = useState<ProblemState | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  // key forces sub-component remount when a new problem is generated
  const [problemKey, setProblemKey] = useState(0);

  // Log session duration on unmount
  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'mathematics', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const level = progress.difficulty_level as DifficultyLevel;

  const newProblem = useCallback(() => {
    setProblem(generateProblemForLevel(level));
    setProblemKey((k) => k + 1);
  }, [level]);

  useEffect(() => {
    newProblem();
  }, [newProblem]);

  const handleResult = async (correct: boolean) => {
    setSessionStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    await recordSolve(correct);
    setTimeout(newProblem, correct ? 1400 : 2200);
  };

  if (!problem) {
    return (
      <p className="text-center text-gray-400 animate-pulse py-12">
        Loading problem…
      </p>
    );
  }

  const { difficultyLevel: lvl, operation, operands } = problem;

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar: level badge + session score + mastery bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
            Level {lvl} · {LEVEL_LABELS[lvl]}
          </span>
          <span className="text-gray-500 text-sm">
            Session: {sessionStats.correct}/{sessionStats.total}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[160px] max-w-xs">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Mastery {progress.mastery_score}%
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${progress.mastery_score}%` }}
            />
          </div>
          {progress.mastery_score >= 88 && lvl < 5 && (
            <span className="text-xs text-green-600 font-bold whitespace-nowrap">
              🚀 Level up!
            </span>
          )}
        </div>
      </div>

      {/* Active sub-component determined by difficulty level */}
      <div className="flex justify-center py-4">
        {lvl === 1 && (
          <VisualBlocks
            key={problemKey}
            operation={operation as '+' | '-'}
            numbers={operands}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
        {(lvl === 2 || lvl === 3) && (
          <ColumnGrid
            key={problemKey}
            operation={operation}
            numbers={operands}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
        {(lvl === 4 || lvl === 5) && (
          <WordProblem
            key={problemKey}
            operation={operation}
            numbers={operands}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
      </div>

      <p className="text-center text-sm text-gray-400">
        Total solved: {progress.total_problems_solved} problems
      </p>
    </div>
  );
}
