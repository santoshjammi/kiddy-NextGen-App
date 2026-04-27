'use client';

import { useState, useCallback } from 'react';
import { useSubjectProgress } from '../useSubjectProgress';

// ─── Word data ────────────────────────────────────────────────────────────────

const LEVEL1_WORDS = [
  { word: 'at', emoji: '🏠', hint: 'The cat is AT home' },
  { word: 'in', emoji: '🎁', hint: 'The gift is IN the box' },
  { word: 'on', emoji: '🍽️', hint: 'The cup is ON the table' },
  { word: 'up', emoji: '⬆️', hint: 'The balloon goes UP' },
  { word: 'go', emoji: '🚀', hint: 'Ready, set, GO!' },
  { word: 'do', emoji: '✅', hint: "Let's DO it!" },
  { word: 'me', emoji: '😊', hint: 'Look at ME!' },
  { word: 'we', emoji: '🤝', hint: 'WE are friends' },
  { word: 'it', emoji: '❓', hint: 'What is IT?' },
  { word: 'no', emoji: '🚫', hint: 'Say NO to bad things' },
];

const LEVEL2_WORDS = [
  { word: 'cat', vowelIndex: 1, emoji: '🐱' },
  { word: 'dog', vowelIndex: 1, emoji: '🐶' },
  { word: 'sun', vowelIndex: 1, emoji: '☀️' },
  { word: 'hat', vowelIndex: 1, emoji: '🎩' },
  { word: 'pig', vowelIndex: 1, emoji: '🐷' },
  { word: 'bug', vowelIndex: 1, emoji: '🐛' },
  { word: 'cup', vowelIndex: 1, emoji: '☕' },
  { word: 'hen', vowelIndex: 1, emoji: '🐓' },
  { word: 'fox', vowelIndex: 1, emoji: '🦊' },
  { word: 'log', vowelIndex: 1, emoji: '🪵' },
];

const LEVEL3_WORDS = [
  { word: 'play', emoji: '🎮' },
  { word: 'frog', emoji: '🐸' },
  { word: 'ship', emoji: '🚢' },
  { word: 'flag', emoji: '🚩' },
  { word: 'step', emoji: '👣' },
  { word: 'swim', emoji: '🏊' },
  { word: 'bird', emoji: '🐦' },
  { word: 'fish', emoji: '🐟' },
  { word: 'cake', emoji: '🎂' },
  { word: 'book', emoji: '📚' },
];

const LEVEL4_WORDS = [
  'apple', 'train', 'clock', 'plant', 'space',
  'cloud', 'bread', 'chair', 'flame', 'heart',
  'magic', 'night', 'ocean', 'peace', 'river',
  'storm', 'tiger', 'water', 'lunch', 'grape',
];

// ─── Level 1: Letter Blocks ───────────────────────────────────────────────────

type L1Data = { word: string; emoji: string; hint: string };

function LetterBlocks({ data, onCorrect, onWrong }: { data: L1Data; onCorrect: () => void; onWrong: () => void }) {
  const letters = data.word.toLowerCase().split('');
  // Provide the correct letters plus 2 random distractors
  const [shuffled] = useState<string[]>(() => {
    const pool = [...letters];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    while (pool.length < letters.length + 2) {
      const extra = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!pool.includes(extra)) pool.push(extra);
    }
    return pool.sort(() => Math.random() - 0.5);
  });
  const [typed, setTyped] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleLetter = (letter: string) => {
    if (feedback || typed.length >= letters.length) return;
    const next = [...typed, letter];
    setTyped(next);
    if (next.length === letters.length) {
      if (next.join('') === data.word) {
        setFeedback('correct');
        setTimeout(onCorrect, 900);
      } else {
        setFeedback('wrong');
        setTimeout(() => { setTyped([]); setFeedback(null); }, 1000);
        onWrong();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl">{data.emoji}</div>
      <p className="text-lg text-gray-600 italic">{data.hint}</p>

      {/* Answer slots */}
      <div className="flex gap-3">
        {letters.map((_, i) => (
          <div
            key={i}
            className={`w-14 h-14 flex items-center justify-center text-3xl font-bold rounded-xl border-2 transition-colors ${
              typed[i]
                ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                : 'bg-gray-50 border-dashed border-gray-300 text-gray-300'
            }`}
          >
            {typed[i]?.toUpperCase() ?? '_'}
          </div>
        ))}
      </div>

      {feedback === 'correct' && (
        <p className="text-xl font-bold text-green-500">🎉 &quot;{data.word.toUpperCase()}&quot; — Correct!</p>
      )}
      {feedback === 'wrong' && (
        <p className="text-xl font-bold text-red-500">❌ Oops! Try again!</p>
      )}

      {/* Draggable letter buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {shuffled.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetter(letter)}
            disabled={!!feedback}
            className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 text-white text-2xl font-bold rounded-xl shadow-md hover:scale-110 transition-all disabled:opacity-50"
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {typed.length > 0 && !feedback && (
        <button onClick={() => setTyped([])} className="text-sm text-gray-400 underline">
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Level 2: Missing Vowel ───────────────────────────────────────────────────

type L2Data = { word: string; vowelIndex: number; emoji: string };
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

function MissingVowel({ data, onCorrect, onWrong }: { data: L2Data; onCorrect: () => void; onWrong: () => void }) {
  const correctVowel = data.word[data.vowelIndex].toUpperCase();
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const wordDisplay = data.word
    .split('')
    .map((ch, i) => (i === data.vowelIndex ? '_' : ch))
    .join(' ')
    .toUpperCase();

  const handleVowel = (v: string) => {
    if (feedback) return;
    setSelected(v);
    if (v === correctVowel) {
      setFeedback('correct');
      setTimeout(onCorrect, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setSelected(null); setFeedback(null); }, 1000);
      onWrong();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl">{data.emoji}</div>
      <div className="text-5xl font-bold tracking-[0.35em] text-gray-700">{wordDisplay}</div>
      <p className="text-gray-500">Fill in the missing vowel!</p>

      <div className="flex gap-4">
        {VOWELS.map((v) => {
          let cls = 'w-14 h-14 text-2xl font-bold rounded-xl border-2 transition-all ';
          if (selected === v) {
            cls += feedback === 'correct'
              ? 'bg-green-400 border-green-500 text-white scale-110'
              : 'bg-red-400 border-red-500 text-white';
          } else {
            cls += 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100 hover:scale-105';
          }
          return (
            <button key={v} className={cls} onClick={() => handleVowel(v)}>
              {v}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && <p className="text-xl font-bold text-green-500">🌟 {data.word.toUpperCase()}!</p>}
      {feedback === 'wrong' && <p className="text-xl font-bold text-red-500">Try another vowel!</p>}
    </div>
  );
}

// ─── Level 3: Word Scramble ───────────────────────────────────────────────────

type L3Data = { word: string; emoji: string };

function WordScramble({ data, onCorrect, onWrong }: { data: L3Data; onCorrect: () => void; onWrong: () => void }) {
  const [scrambled] = useState<string[]>(() =>
    data.word.split('').sort(() => Math.random() - 0.5)
  );
  // Track usage by index so duplicate letters work correctly
  const [typed, setTyped] = useState<Array<{ letter: string; idx: number }>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const usedIndices = new Set(typed.map((t) => t.idx));

  const handleLetter = (letter: string, idx: number) => {
    if (feedback || usedIndices.has(idx)) return;
    const next = [...typed, { letter, idx }];
    setTyped(next);
    if (next.length === data.word.length) {
      const answer = next.map((t) => t.letter).join('');
      if (answer === data.word) {
        setFeedback('correct');
        setTimeout(onCorrect, 900);
      } else {
        setFeedback('wrong');
        setTimeout(() => { setTyped([]); setFeedback(null); }, 1200);
        onWrong();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl">{data.emoji}</div>
      <p className="text-gray-500 text-lg">Unscramble the letters!</p>

      {/* Built word preview */}
      <div className="flex gap-2">
        {data.word.split('').map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-lg border-2 transition-colors ${
              typed[i]
                ? 'bg-teal-100 border-teal-400 text-teal-700'
                : 'border-dashed border-gray-300 text-gray-300'
            }`}
          >
            {typed[i] ? typed[i].letter.toUpperCase() : '_'}
          </div>
        ))}
      </div>

      {feedback === 'correct' && <p className="text-xl font-bold text-green-500">🎉 {data.word.toUpperCase()}!</p>}
      {feedback === 'wrong' && <p className="text-xl font-bold text-red-500">❌ Not quite! Try again!</p>}

      {/* Scrambled letter buttons */}
      <div className="flex gap-3">
        {scrambled.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetter(letter, i)}
            disabled={usedIndices.has(i) || !!feedback}
            className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 text-white text-xl font-bold rounded-lg shadow-md hover:scale-110 transition-all disabled:opacity-20 disabled:scale-100"
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      {typed.length > 0 && !feedback && (
        <button onClick={() => setTyped([])} className="text-sm text-gray-400 underline">
          Clear
        </button>
      )}
    </div>
  );
}

// ─── Level 4: Wordle-style ────────────────────────────────────────────────────

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

const CELL_COLORS: Record<LetterState, string> = {
  correct: 'bg-green-500 text-white border-green-600',
  present: 'bg-yellow-400 text-white border-yellow-500',
  absent: 'bg-gray-400 text-white border-gray-500',
  empty: 'bg-white text-gray-700 border-gray-300',
};

function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent');
  const ansArr = answer.split('');
  const guessArr = guess.split('');

  // Pass 1: exact matches
  guessArr.forEach((ch, i) => {
    if (ch === ansArr[i]) {
      result[i] = 'correct';
      ansArr[i] = '';
      guessArr[i] = '';
    }
  });
  // Pass 2: present but wrong position
  guessArr.forEach((ch, i) => {
    if (ch) {
      const j = ansArr.indexOf(ch);
      if (j !== -1) {
        result[i] = 'present';
        ansArr[j] = '';
      }
    }
  });
  return result;
}

function WordleGame({ word, onCorrect, onWrong }: { word: string; onCorrect: () => void; onWrong: () => void }) {
  const MAX = 6;
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const submit = () => {
    if (current.length !== 5 || gameOver) return;
    const next = [...guesses, current];
    setGuesses(next);
    setCurrent('');
    if (current === word) {
      setGameOver(true);
      setTimeout(onCorrect, 1200);
    } else if (next.length >= MAX) {
      setGameOver(true);
      setTimeout(onWrong, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-500">Guess the 5-letter word in 6 tries!</p>

      {/* Grid */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: MAX }).map((_, row) => {
          const guess = guesses[row] ?? '';
          const states = row < guesses.length ? evaluateGuess(guess, word) : null;
          return (
            <div key={row} className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, col) => {
                const letter =
                  guess[col] ??
                  (row === guesses.length ? current[col] ?? '' : '');
                const state: LetterState = states ? states[col] : 'empty';
                return (
                  <div
                    key={col}
                    className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded border-2 ${CELL_COLORS[state]}`}
                  >
                    {letter.toUpperCase()}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {!gameOver && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            maxLength={5}
            value={current}
            onChange={(e) =>
              setCurrent(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())
            }
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="border-2 border-indigo-300 rounded-xl px-4 py-2 text-xl font-bold text-center w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="guess"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={current.length !== 5}
            className="bg-indigo-500 disabled:opacity-40 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
          >
            Enter
          </button>
        </div>
      )}

      {gameOver && (
        <p
          className={`text-xl font-bold ${
            guesses[guesses.length - 1] === word ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {guesses[guesses.length - 1] === word
            ? '🎉 Brilliant!'
            : `The word was \u201c${word.toUpperCase()}\u201d`}
        </p>
      )}
    </div>
  );
}

// ─── Main EnglishEngine ───────────────────────────────────────────────────────

const LEVEL_LABELS: Record<number, string> = {
  1: '2-Letter Words',
  2: '3-Letter CVC',
  3: '4-Letter Scramble',
  4: '5-Letter Wordle',
};

export default function EnglishEngine() {
  const { progress, recordSolve } = useSubjectProgress('english');
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * 10));
  // key forces remount of level component to reset state on new word
  const [key, setKey] = useState(0);

  const level = progress.difficulty_level;

  const nextWord = useCallback(() => {
    setWordIndex((i) => (i + 1) % 10);
    setKey((k) => k + 1);
  }, []);

  const handleResult = async (correct: boolean) => {
    await recordSolve(correct);
    setTimeout(nextWord, correct ? 1400 : 2200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-bold">
            Level {level} · {LEVEL_LABELS[level] ?? ''}
          </span>
          <span className="text-gray-500 text-sm">
            Solved: {progress.total_problems_solved}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[160px] max-w-xs">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Mastery {progress.mastery_score}%
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${progress.mastery_score}%` }}
            />
          </div>
          {progress.mastery_score >= 88 && level < 5 && (
            <span className="text-xs text-green-600 font-bold whitespace-nowrap">
              🚀 Level up!
            </span>
          )}
        </div>
      </div>

      {/* Active level component */}
      <div className="flex justify-center py-4">
        {level === 1 && (
          <LetterBlocks
            key={key}
            data={LEVEL1_WORDS[wordIndex % LEVEL1_WORDS.length]}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
        {level === 2 && (
          <MissingVowel
            key={key}
            data={LEVEL2_WORDS[wordIndex % LEVEL2_WORDS.length]}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
        {level === 3 && (
          <WordScramble
            key={key}
            data={LEVEL3_WORDS[wordIndex % LEVEL3_WORDS.length]}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
        {level === 4 && (
          <WordleGame
            key={key}
            word={LEVEL4_WORDS[wordIndex % LEVEL4_WORDS.length]}
            onCorrect={() => handleResult(true)}
            onWrong={() => handleResult(false)}
          />
        )}
      </div>

      <p className="text-center text-sm text-gray-400">
        Total solved: {progress.total_problems_solved} words
      </p>
    </div>
  );
}
