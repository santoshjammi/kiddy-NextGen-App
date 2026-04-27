'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';

// ── Letter data ────────────────────────────────────────────────────
interface LetterItem {
  letter: string;
  word: string;     // word that starts with/contains this letter
  emoji: string;
  level: number;    // 1 = vowel sounds, 2 = consonant sounds, 3 = initial letter of word
}

const LETTERS: LetterItem[] = [
  // Level 1 — vowel sounds (letter + a word containing it)
  { letter: 'A', word: 'apple', emoji: '🍎', level: 1 },
  { letter: 'E', word: 'egg', emoji: '🥚', level: 1 },
  { letter: 'I', word: 'igloo', emoji: '🏔️', level: 1 },
  { letter: 'O', word: 'octopus', emoji: '🐙', level: 1 },
  { letter: 'U', word: 'umbrella', emoji: '☂️', level: 1 },
  // Level 2 — consonant initial sounds
  { letter: 'B', word: 'ball', emoji: '⚽', level: 2 },
  { letter: 'C', word: 'cat', emoji: '🐱', level: 2 },
  { letter: 'D', word: 'dog', emoji: '🐶', level: 2 },
  { letter: 'F', word: 'fish', emoji: '🐟', level: 2 },
  { letter: 'G', word: 'goat', emoji: '🐐', level: 2 },
  { letter: 'H', word: 'hat', emoji: '🎩', level: 2 },
  { letter: 'J', word: 'jar', emoji: '🫙', level: 2 },
  { letter: 'K', word: 'kite', emoji: '🪁', level: 2 },
  { letter: 'L', word: 'lion', emoji: '🦁', level: 2 },
  { letter: 'M', word: 'moon', emoji: '🌙', level: 2 },
  { letter: 'N', word: 'nest', emoji: '🪺', level: 2 },
  { letter: 'P', word: 'pig', emoji: '🐷', level: 2 },
  { letter: 'R', word: 'rain', emoji: '🌧️', level: 2 },
  { letter: 'S', word: 'sun', emoji: '☀️', level: 2 },
  { letter: 'T', word: 'tree', emoji: '🌳', level: 2 },
  { letter: 'V', word: 'van', emoji: '🚐', level: 2 },
  { letter: 'W', word: 'wolf', emoji: '🐺', level: 2 },
  { letter: 'Y', word: 'yak', emoji: '🐂', level: 2 },
  { letter: 'Z', word: 'zebra', emoji: '🦓', level: 2 },
  // Level 3 — longer words, initial letter still
  { letter: 'B', word: 'butterfly', emoji: '🦋', level: 3 },
  { letter: 'D', word: 'dolphin', emoji: '🐬', level: 3 },
  { letter: 'E', word: 'elephant', emoji: '🐘', level: 3 },
  { letter: 'F', word: 'flamingo', emoji: '🦩', level: 3 },
  { letter: 'G', word: 'giraffe', emoji: '🦒', level: 3 },
  { letter: 'P', word: 'penguin', emoji: '🐧', level: 3 },
  { letter: 'R', word: 'rainbow', emoji: '🌈', level: 3 },
  { letter: 'S', word: 'snowflake', emoji: '❄️', level: 3 },
  { letter: 'T', word: 'turtle', emoji: '🐢', level: 3 },
  { letter: 'V', word: 'volcano', emoji: '🌋', level: 3 },
];

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getDistractors(correct: string, count = 5): string[] {
  const pool = ALL_LETTERS.filter(l => l !== correct);
  return shuffle(pool).slice(0, count);
}

function getItemsForLevel(level: number): LetterItem[] {
  const lvl = Math.min(3, Math.max(1, level));
  return shuffle(LETTERS.filter(l => l.level === lvl));
}

function speakLetter(letter: string, word: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const phrase = `The letter ${letter}. ${letter} is for ${word}.`;
  const utt = new SpeechSynthesisUtterance(phrase);
  utt.rate = 0.85;
  utt.pitch = 1.2;
  window.speechSynthesis.speak(utt);
}

export default function LetterFishingPage() {
  const { progress, recordSolve } = useSubjectProgress('letter-fishing');
  const { recordCorrect } = useRewards();
  const level = Math.min(3, progress.difficulty_level);

  const [queue, setQueue] = useState<LetterItem[]>(() => getItemsForLevel(1));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const item = queue[index % queue.length];

  // Build choices on item change
  useEffect(() => {
    const distractors = getDistractors(item.letter, 5);
    setChoices(shuffle([item.letter, ...distractors]));
  }, [item]);

  const playAudio = useCallback(() => {
    setIsSpeaking(true);
    speakLetter(item.letter, item.word);
    setTimeout(() => setIsSpeaking(false), 2400);
  }, [item]);

  // Auto-play on each new item
  useEffect(() => {
    const t = setTimeout(playAudio, 400);
    return () => clearTimeout(t);
  }, [item.letter]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    const nextIdx = (index + 1) % queue.length;
    if (nextIdx === 0) {
      const newQueue = getItemsForLevel(Math.min(3, progress.difficulty_level));
      setQueue(newQueue);
      setIndex(0);
    } else {
      setIndex(nextIdx);
    }
    setSelected(null);
    setFeedback(null);
  }, [index, queue, progress.difficulty_level]);

  const handleChoice = async (letter: string) => {
    if (feedback) return;
    setSelected(letter);
    const correct = letter === item.letter;
    setFeedback(correct ? 'correct' : 'wrong');
    setStreak(s => correct ? s + 1 : 0);
    setSession(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

    await recordSolve(correct, correct ? undefined : `letter_fishing_level${level}`);
    if (correct) recordCorrect('english');

    setTimeout(advance, correct ? 1000 : 1600);
  };

  return (
    <div className="min-h-screen bg-black">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
          <div className="text-center">
            <h1 className="text-[20px] font-light text-white">Letter Fishing</h1>
            <p className="text-[#6b6b6b] text-xs mt-0.5">Listen, then tap the letter you hear</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#0070cc] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              Level {level}
            </span>
            <span className="text-[#6b6b6b] text-sm">{session.correct}/{session.total}</span>
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

        {/* ── Main card ──────────────────────────────────────── */}
        <div
          className="bg-white rounded-[24px] p-8 md:p-14 flex flex-col items-center gap-10"
          style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
        >
          {/* Emoji + word hint */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-[96px] leading-none select-none">{item.emoji}</div>
            <p className="text-gray-400 text-lg font-medium tracking-wide uppercase">
              {item.word}
            </p>
          </div>

          {/* Play button */}
          <button
            onClick={playAudio}
            className={`
              flex flex-col items-center gap-3 px-10 py-6 rounded-[20px] border-2 transition-all duration-200
              ${isSpeaking
                ? 'bg-[#0070cc] border-[#0070cc] text-white scale-95 shadow-lg'
                : 'bg-[#f0f7ff] border-[#0070cc]/40 text-[#0070cc] hover:bg-[#0070cc] hover:text-white hover:scale-105 hover:border-[#0070cc]'
              }
            `}
          >
            <span className="text-[48px]">{isSpeaking ? '🔊' : '🔈'}</span>
            <span className="text-base font-semibold">{isSpeaking ? 'Playing...' : 'Tap to Hear'}</span>
          </button>

          {/* Feedback message */}
          {feedback === 'correct' && (
            <p className="text-2xl font-bold text-green-500">🎉 Correct! &quot;{item.letter}&quot; is for {item.word}!</p>
          )}
          {feedback === 'wrong' && (
            <p className="text-xl font-bold text-red-500">
              The letter was &quot;{item.letter}&quot; — for {item.word}!
            </p>
          )}

          {/* Letter choices — 6 buttons in a grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs md:grid-cols-6 md:max-w-none">
            {choices.map(letter => {
              const isSelected = selected === letter;
              const isCorrect = letter === item.letter;
              let cls = 'h-16 md:h-20 text-[32px] md:text-[36px] font-bold rounded-[16px] border-2 transition-all duration-150 select-none ';
              if (feedback && isSelected) {
                cls += feedback === 'correct'
                  ? 'bg-green-400 border-green-500 text-white scale-110 shadow-lg'
                  : 'bg-red-400 border-red-500 text-white';
              } else if (feedback && isCorrect) {
                cls += 'bg-green-100 border-green-400 text-green-700';
              } else if (!feedback) {
                cls += 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-800 hover:bg-[#0070cc] hover:border-[#0070cc] hover:text-white hover:scale-105 cursor-pointer active:scale-95';
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

        {/* ── Tip ───────────────────────────────────────────── */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-4 text-center">
          <p className="text-[#6b6b6b] text-sm">
            Tap &quot;Tap to Hear&quot; to hear the letter, then find it in the grid. Progresses from vowels → consonants → longer words.
          </p>
        </div>

      </div>
    </div>
  );
}
