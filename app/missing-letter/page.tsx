'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';

// ── Word bank ──────────────────────────────────────────────────────
// Each entry: word + emoji + which index is the blank + level
interface WordItem {
  word: string;
  emoji: string;
  blankIndex: number;
  level: number;
}

const WORDS: WordItem[] = [
  // Level 1 — single vowel, 3-letter CVC
  { word: 'cat', emoji: '🐱', blankIndex: 1, level: 1 },
  { word: 'dog', emoji: '🐶', blankIndex: 1, level: 1 },
  { word: 'sun', emoji: '☀️', blankIndex: 1, level: 1 },
  { word: 'hat', emoji: '🎩', blankIndex: 1, level: 1 },
  { word: 'pig', emoji: '🐷', blankIndex: 1, level: 1 },
  { word: 'bug', emoji: '🐛', blankIndex: 1, level: 1 },
  { word: 'cup', emoji: '☕', blankIndex: 1, level: 1 },
  { word: 'hen', emoji: '🐓', blankIndex: 1, level: 1 },
  { word: 'fox', emoji: '🦊', blankIndex: 1, level: 1 },
  { word: 'log', emoji: '🪵', blankIndex: 1, level: 1 },
  { word: 'bat', emoji: '🦇', blankIndex: 1, level: 1 },
  { word: 'map', emoji: '🗺️', blankIndex: 1, level: 1 },
  // Level 2 — 4-letter words, varied blank position
  { word: 'bird', emoji: '🐦', blankIndex: 2, level: 2 },
  { word: 'frog', emoji: '🐸', blankIndex: 1, level: 2 },
  { word: 'cake', emoji: '🎂', blankIndex: 1, level: 2 },
  { word: 'fish', emoji: '🐟', blankIndex: 1, level: 2 },
  { word: 'moon', emoji: '🌙', blankIndex: 1, level: 2 },
  { word: 'book', emoji: '📚', blankIndex: 2, level: 2 },
  { word: 'rain', emoji: '🌧️', blankIndex: 2, level: 2 },
  { word: 'play', emoji: '🎮', blankIndex: 2, level: 2 },
  { word: 'star', emoji: '⭐', blankIndex: 1, level: 2 },
  { word: 'tree', emoji: '🌳', blankIndex: 1, level: 2 },
  { word: 'ship', emoji: '🚢', blankIndex: 2, level: 2 },
  { word: 'jump', emoji: '🏃', blankIndex: 1, level: 2 },
  // Level 3 — 5-letter words
  { word: 'apple', emoji: '🍎', blankIndex: 0, level: 3 },
  { word: 'train', emoji: '🚂', blankIndex: 3, level: 3 },
  { word: 'clock', emoji: '🕐', blankIndex: 2, level: 3 },
  { word: 'brush', emoji: '🪥', blankIndex: 3, level: 3 },
  { word: 'storm', emoji: '⛈️', blankIndex: 2, level: 3 },
  { word: 'plant', emoji: '🌿', blankIndex: 2, level: 3 },
  { word: 'cloud', emoji: '☁️', blankIndex: 3, level: 3 },
  { word: 'flame', emoji: '🔥', blankIndex: 2, level: 3 },
  { word: 'bread', emoji: '🍞', blankIndex: 2, level: 3 },
  { word: 'tiger', emoji: '🐯', blankIndex: 1, level: 3 },
  { word: 'ocean', emoji: '🌊', blankIndex: 2, level: 3 },
  { word: 'space', emoji: '🚀', blankIndex: 3, level: 3 },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getChoices(word: string, blankIndex: number, level: number): string[] {
  const correct = word[blankIndex].toUpperCase();
  // Level 1 = CVC words with a missing vowel: always show A E I O U
  // This is pedagogically correct and teaches vowel recognition explicitly.
  if (level === 1) return ['A', 'E', 'I', 'O', 'U'];
  // Level 2+ = any letter blank: show 5 choices including the correct one
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const wrong = shuffle(alphabet.filter(c => c !== correct)).slice(0, 4);
  return shuffle([correct, ...wrong]);
}

function getWordsForLevel(level: number): WordItem[] {
  const lvl = Math.min(3, Math.max(1, level));
  return shuffle(WORDS.filter(w => w.level === lvl));
}

export default function MissingLetterPage() {
  const { progress, recordSolve } = useSubjectProgress('missing-letter');
  const { recordCorrect, logSession } = useRewards();
  const sessionStart = useRef(Date.now());
  const level = Math.min(3, progress.difficulty_level);

  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'english', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialise queue and choices together so choices always match queue[0]
  const [queue, setQueue] = useState<WordItem[]>(() => getWordsForLevel(1));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>(() => {
    const q = getWordsForLevel(1);
    return getChoices(q[0].word, q[0].blankIndex, 1);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const item = queue[index % queue.length];

  const advance = useCallback(() => {
    const nextIdx = (index + 1) % queue.length;
    // Refill when cycling
    if (nextIdx === 0) {
      const lvl = Math.min(3, progress.difficulty_level);
      const newQueue = getWordsForLevel(lvl);
      setQueue(newQueue);
      setChoices(getChoices(newQueue[0].word, newQueue[0].blankIndex, lvl));
    } else {
      setChoices(getChoices(queue[nextIdx].word, queue[nextIdx].blankIndex, level));
    }
    setIndex(nextIdx);
    setSelected(null);
    setFeedback(null);
  }, [index, queue, progress.difficulty_level, level]);

  const handleChoice = async (letter: string) => {
    if (feedback) return;
    setSelected(letter);
    const correct = letter === item.word[item.blankIndex].toUpperCase();
    setFeedback(correct ? 'correct' : 'wrong');
    setStreak(s => correct ? s + 1 : 0);
    setSession(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

    await recordSolve(correct, correct ? undefined : `missing_letter_level${level}`);
    if (correct) recordCorrect('english');

    setTimeout(advance, correct ? 1000 : 1600);
  };

  // Build the display with the blank slot
  const wordDisplay = item.word.toUpperCase().split('').map((ch, i) => ({
    char: i === item.blankIndex ? (selected ?? '_') : ch,
    isBlank: i === item.blankIndex,
    revealed: feedback !== null && i === item.blankIndex,
  }));

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Missing Letter</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Fill in the blank to complete the word</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Stats ───────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#0070cc] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              Level {level}
            </span>
            <span className="text-[#6b6b6b] text-sm">{session.correct}/{session.total} correct</span>
          </div>
          <div className="flex items-center gap-3">
            {streak >= 2 && <span className="text-orange-400 text-sm font-bold">🔥 {streak}</span>}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6b6b6b]">{progress.mastery_score}%</span>
              <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#0070cc] rounded-full" style={{ width: `${progress.mastery_score}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main card ───────────────────────────────────── */}
        <div
          className="bg-white rounded-[24px] p-8 md:p-14 flex flex-col items-center gap-10"
          style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
        >
          {/* Emoji */}
          <div className="text-[96px] leading-none select-none">{item.emoji}</div>

          {/* Word with blank */}
          <div className="flex items-center gap-3 md:gap-5">
            {wordDisplay.map((slot, i) => (
              <div
                key={i}
                className={`
                  w-14 h-16 md:w-16 md:h-20 flex items-center justify-center
                  text-[36px] md:text-[44px] font-bold rounded-[12px] select-none
                  transition-all duration-200
                  ${slot.isBlank
                    ? feedback === 'correct'
                      ? 'bg-green-100 border-2 border-green-400 text-green-700 scale-110'
                      : feedback === 'wrong'
                      ? 'bg-red-100 border-2 border-red-400 text-red-600'
                      : 'bg-[#0070cc]/10 border-2 border-dashed border-[#0070cc] text-[#0070cc]'
                    : 'bg-[#f5f7fa] text-gray-800'
                  }
                `}
              >
                {slot.isBlank && feedback === 'wrong'
                  ? item.word[item.blankIndex].toUpperCase()
                  : slot.char}
              </div>
            ))}
          </div>

          {/* Feedback message */}
          {feedback === 'correct' && (
            <p className="text-2xl font-bold text-green-500">🎉 {item.word.toUpperCase()}!</p>
          )}
          {feedback === 'wrong' && (
            <p className="text-xl font-bold text-red-500">
              The letter was &quot;{item.word[item.blankIndex].toUpperCase()}&quot;
            </p>
          )}

          {/* Choice buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            {choices.map(letter => {
              const isSelected = selected === letter;
              const isCorrect = letter === item.word[item.blankIndex].toUpperCase();
              let cls = 'w-16 h-16 md:w-20 md:h-20 text-[32px] md:text-[40px] font-bold rounded-[16px] border-2 transition-all duration-150 select-none ';
              if (feedback && isSelected) {
                cls += feedback === 'correct'
                  ? 'bg-green-400 border-green-500 text-white scale-110 shadow-lg'
                  : 'bg-red-400 border-red-500 text-white';
              } else if (feedback && isCorrect) {
                cls += 'bg-green-100 border-green-400 text-green-700';
              } else if (!feedback) {
                cls += 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-800 hover:bg-[#0070cc] hover:border-[#0070cc] hover:text-white hover:scale-105 cursor-pointer';
              } else {
                cls += 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-400 opacity-50';
              }
              return (
                <button key={letter} className={cls} onClick={() => handleChoice(letter)} disabled={!!feedback}>
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Hint strip ───────────────────────────────────── */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-4 text-center">
          <p className="text-[#6b6b6b] text-sm">
            Look at the picture, then pick the correct letter to fill the blank. Work through 3 difficulty levels!
          </p>
        </div>

      </div>
    </div>
  );
}
