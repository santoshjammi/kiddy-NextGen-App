'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import AuthButton from '../../components/AuthButton';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';


// ── Letter data ────────────────────────────────────────────────────
interface LetterItem {
  letter: string;
  word: string;
  emoji: string;
  level: number;
}

const LETTERS: LetterItem[] = [
  { letter: 'A', word: 'apple',     emoji: '🍎', level: 1 },
  { letter: 'E', word: 'egg',       emoji: '🥚', level: 1 },
  { letter: 'I', word: 'igloo',     emoji: '🏔️', level: 1 },
  { letter: 'O', word: 'octopus',   emoji: '🐙', level: 1 },
  { letter: 'U', word: 'umbrella',  emoji: '☂️', level: 1 },
  { letter: 'B', word: 'ball',      emoji: '⚽', level: 2 },
  { letter: 'C', word: 'cat',       emoji: '🐱', level: 2 },
  { letter: 'D', word: 'dog',       emoji: '🐶', level: 2 },
  { letter: 'F', word: 'fish',      emoji: '🐟', level: 2 },
  { letter: 'G', word: 'goat',      emoji: '🐐', level: 2 },
  { letter: 'H', word: 'hat',       emoji: '🎩', level: 2 },
  { letter: 'J', word: 'jar',       emoji: '🫙', level: 2 },
  { letter: 'K', word: 'kite',      emoji: '🪁', level: 2 },
  { letter: 'L', word: 'lion',      emoji: '🦁', level: 2 },
  { letter: 'M', word: 'moon',      emoji: '🌙', level: 2 },
  { letter: 'N', word: 'nest',      emoji: '🪺', level: 2 },
  { letter: 'P', word: 'pig',       emoji: '🐷', level: 2 },
  { letter: 'R', word: 'rain',      emoji: '🌧️', level: 2 },
  { letter: 'S', word: 'sun',       emoji: '☀️', level: 2 },
  { letter: 'T', word: 'tree',      emoji: '🌳', level: 2 },
  { letter: 'V', word: 'van',       emoji: '🚐', level: 2 },
  { letter: 'W', word: 'wolf',      emoji: '🐺', level: 2 },
  { letter: 'Y', word: 'yak',       emoji: '🐂', level: 2 },
  { letter: 'Z', word: 'zebra',     emoji: '🦓', level: 2 },
  { letter: 'B', word: 'butterfly', emoji: '🦋', level: 3 },
  { letter: 'D', word: 'dolphin',   emoji: '🐬', level: 3 },
  { letter: 'E', word: 'elephant',  emoji: '🐘', level: 3 },
  { letter: 'F', word: 'flamingo',  emoji: '🦩', level: 3 },
  { letter: 'G', word: 'giraffe',   emoji: '🦒', level: 3 },
  { letter: 'P', word: 'penguin',   emoji: '🐧', level: 3 },
  { letter: 'R', word: 'rainbow',   emoji: '🌈', level: 3 },
  { letter: 'S', word: 'snowflake', emoji: '❄️', level: 3 },
  { letter: 'T', word: 'turtle',    emoji: '🐢', level: 3 },
  { letter: 'V', word: 'volcano',   emoji: '🌋', level: 3 },
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
  const utt = new SpeechSynthesisUtterance(`The letter ${letter}. ${letter} is for ${word}.`);
  utt.rate = 0.85;
  utt.pitch = 1.2;
  window.speechSynthesis.speak(utt);
}

// ── Tile component with pointer-event drag ────────────────────────
interface TileProps {
  letter: string;
  onDrop: (letter: string) => void;
  feedback: 'correct' | 'wrong' | null;
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
}

function LetterTile({ letter, onDrop, feedback, isCorrect, isSelected, disabled }: TileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const hookRef = useRef<DOMRect | null>(null);

  // Each tile needs access to the hook zone rect — passed via a global ref trick
  useEffect(() => {
    const el = document.getElementById('fishing-hook-zone');
    if (el) hookRef.current = el.getBoundingClientRect();
  });

  const getStyle = () => {
    if (feedback && isSelected) {
      return feedback === 'correct'
        ? 'bg-green-400 border-green-500 text-white scale-110 shadow-lg'
        : 'bg-red-400 border-red-500 text-white';
    }
    if (feedback && isCorrect) return 'bg-green-100 border-green-400 text-green-700';
    if (disabled && !isSelected) return 'bg-[#f5f7fa] border-[#e0e0e0] text-gray-400 opacity-40 cursor-not-allowed';
    return 'bg-[#f5f7fa] border-[#cccccc] text-gray-800 hover:bg-[#0070cc] hover:border-[#0070cc] hover:text-white hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95';
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    const el = tileRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    el.style.transition = 'none';
    el.style.zIndex = '999';
    el.style.position = 'relative';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const el = tileRef.current;
    if (!el) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;

    // Highlight hook zone while hovering over it
    const hookEl = document.getElementById('fishing-hook-zone');
    if (hookEl) {
      const rect = hookEl.getBoundingClientRect();
      const over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      hookEl.classList.toggle('ring-4', over);
      hookEl.classList.toggle('ring-[#0070cc]', over);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const el = tileRef.current;
    if (el) {
      el.style.transform = '';
      el.style.transition = '';
      el.style.zIndex = '';
    }
    // Remove hook highlight
    const hookEl = document.getElementById('fishing-hook-zone');
    if (hookEl) {
      hookEl.classList.remove('ring-4', 'ring-[#0070cc]');
    }
    // Check if dropped onto hook zone
    const rect = hookEl?.getBoundingClientRect();
    if (rect) {
      const overHook = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (overHook) { onDrop(letter); return; }
    }
  };

  return (
    <div
      ref={tileRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => !disabled && !feedback && onDrop(letter)}
      className={`h-16 md:h-20 w-16 md:w-20 flex items-center justify-center text-[32px] md:text-[36px] font-bold rounded-[16px] border-2 transition-all duration-150 select-none touch-none ${getStyle()}`}
    >
      {letter}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function LetterFishingPage() {
  const { progress, recordSolve } = useSubjectProgress('letter-fishing');
  const { recordCorrect, logSession } = useRewards();
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'english', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

  useEffect(() => {
    const distractors = getDistractors(item.letter, 5);
    setChoices(shuffle([item.letter, ...distractors]));
  }, [item]);

  const playAudio = useCallback(() => {
    setIsSpeaking(true);
    speakLetter(item.letter, item.word);
    setTimeout(() => setIsSpeaking(false), 2400);
  }, [item]);

  useEffect(() => {
    const t = setTimeout(playAudio, 400);
    return () => clearTimeout(t);
  }, [item.letter]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    const nextIdx = (index + 1) % queue.length;
    if (nextIdx === 0) {
      setQueue(getItemsForLevel(Math.min(3, progress.difficulty_level)));
      setIndex(0);
    } else {
      setIndex(nextIdx);
    }
    setSelected(null);
    setFeedback(null);
  }, [index, queue, progress.difficulty_level]);

  const handleDrop = async (letter: string) => {
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
            <p className="text-[#6b6b6b] text-xs mt-0.5">Hear the letter — drag it to the hook!</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Stats bar ──────────────────────────────────────── */}
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

        {/* ── Main fishing card ───────────────────────────────── */}
        <div
          className="bg-white rounded-[24px] p-6 md:p-10 flex flex-col items-center gap-8"
          style={{ boxShadow: 'rgba(0,0,0,0.12) 0 8px 24px 0' }}
        >
          {/* Fishing rod + hook drop zone */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl">🎣</div>
            {/* Fishing line */}
            <div className="w-[2px] h-8 bg-gray-300" />
            {/* Hook / drop zone */}
            <div
              id="fishing-hook-zone"
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-200 ${
                feedback === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : feedback === 'wrong'
                  ? 'border-red-400 bg-red-50'
                  : 'border-dashed border-[#0070cc]/50 bg-[#f0f7ff]'
              }`}
            >
              {feedback === 'correct' ? (
                <span className="text-4xl">🎉</span>
              ) : feedback === 'wrong' ? (
                <span className="text-4xl">❌</span>
              ) : selected ? (
                <span className="text-4xl font-bold text-[#0070cc]">{selected}</span>
              ) : (
                <>
                  <span className="text-2xl">🪝</span>
                  <span className="text-xs text-[#6b6b6b] mt-1 text-center leading-tight px-2">Drop letter here</span>
                </>
              )}
            </div>
          </div>

          {/* Emoji + word hint */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-[80px] leading-none select-none">{item.emoji}</div>
            <p className="text-gray-400 text-lg font-medium tracking-wide uppercase">{item.word}</p>
          </div>

          {/* Audio button */}
          <button
            onClick={playAudio}
            className={`flex flex-col items-center gap-2 px-8 py-4 rounded-[20px] border-2 transition-all duration-200 ${
              isSpeaking
                ? 'bg-[#0070cc] border-[#0070cc] text-white scale-95'
                : 'bg-[#f0f7ff] border-[#0070cc]/40 text-[#0070cc] hover:bg-[#0070cc] hover:text-white hover:border-[#0070cc]'
            }`}
          >
            <span className="text-[36px]">{isSpeaking ? '🔊' : '🔈'}</span>
            <span className="text-sm font-semibold">{isSpeaking ? 'Playing...' : 'Tap to Hear'}</span>
          </button>

          {/* Feedback text */}
          {feedback === 'correct' && (
            <p className="text-xl font-bold text-green-500">🎉 &quot;{item.letter}&quot; is for {item.word}!</p>
          )}
          {feedback === 'wrong' && (
            <p className="text-lg font-bold text-red-500">The letter was &quot;{item.letter}&quot; — for {item.word}!</p>
          )}

          {/* Draggable letter tiles */}
          <div className="w-full">
            <p className="text-center text-xs text-gray-400 mb-3">
              Drag a tile to the hook above, or just tap it
            </p>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {choices.map(letter => (
                <LetterTile
                  key={letter}
                  letter={letter}
                  onDrop={handleDrop}
                  feedback={feedback}
                  isCorrect={letter === item.letter}
                  isSelected={selected === letter}
                  disabled={!!feedback}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Tip ─────────────────────────────────────────────── */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[16px] p-4 text-center">
          <p className="text-[#6b6b6b] text-sm">
            Tap 🔈 to hear the letter, then drag the matching tile to the 🪝 hook — or just tap it. Level 1: vowels · Level 2: consonants · Level 3: longer words.
          </p>
        </div>

      </div>
    </div>
  );
}

