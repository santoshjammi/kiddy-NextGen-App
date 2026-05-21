'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';
import { useGameTelemetry } from '../../components/useGameTelemetry';
import GameWrapper from '../../remotion/GameWrapper';
import eventBus from '../../remotion/eventBus';
import audioEngine from '../../remotion/audio/audioEngine';

// ── Word bank ──────────────────────────────────────────────────────
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
  if (level === 1) return ['A', 'E', 'I', 'O', 'U'];
  // Level 2+ = any letter blank: show 5 choices including correct letter
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const wrong = shuffle(alphabet.filter(c => c !== correct)).slice(0, 4);
  return shuffle([correct, ...wrong]);
}

function getWordsForLevel(level: number): WordItem[] {
  const lvl = Math.min(3, Math.max(1, level));
  return shuffle(WORDS.filter(w => w.level === lvl));
}

// ── Choice tile component with pointer-event drag ─────────────────
interface ChoiceTileProps {
  letter: string;
  onDrop: (letter: string) => void;
  feedback: 'correct' | 'wrong' | null;
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
}

function ChoiceTile({ letter, onDrop, feedback, isCorrect, isSelected, disabled }: ChoiceTileProps) {
  const tileRef = useRef<HTMLButtonElement>(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const getStyle = () => {
    if (feedback && isSelected) {
      return feedback === 'correct'
        ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/20'
        : 'bg-amber-400 border-amber-300 text-white scale-105 shadow-md shadow-amber-500/10 animate-shake';
    }
    if (feedback && isCorrect) {
      return 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200';
    }
    if (disabled && !isSelected) {
      return 'bg-white/5 border-white/10 text-white/30 opacity-40 cursor-not-allowed';
    }
    return 'bg-white/10 border-white/20 text-white hover:bg-emerald-500/30 hover:border-emerald-400 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing';
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
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

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    const el = tileRef.current;
    if (!el) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;

    // Highlight blank slot while hovering
    const blankEl = document.getElementById('missing-letter-blank-slot');
    if (blankEl) {
      const rect = blankEl.getBoundingClientRect();
      const over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      blankEl.classList.toggle('ring-4', over);
      blankEl.classList.toggle('ring-emerald-400', over);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    const el = tileRef.current;
    if (el) {
      el.style.transform = '';
      el.style.transition = '';
      el.style.zIndex = '';
    }
    // Remove blank highlight
    const blankEl = document.getElementById('missing-letter-blank-slot');
    if (blankEl) {
      blankEl.classList.remove('ring-4', 'ring-emerald-400');
    }
    // Check if dropped onto blank slot
    const rect = blankEl?.getBoundingClientRect();
    if (rect) {
      const overBlank = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (overBlank) {
        onDrop(letter);
        return;
      }
    }
  };

  return (
    <button
      ref={tileRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => !disabled && !feedback && onDrop(letter)}
      disabled={disabled}
      data-testid="choice-button"
      data-correct={isCorrect ? 'true' : 'false'}
      className={`h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 flex items-center justify-center text-[26px] sm:text-[32px] md:text-[36px] font-bold rounded-[20px] border-2 transition-all duration-150 select-none touch-none shadow-sm ${getStyle()}`}
    >
      {letter}
    </button>
  );
}

export default function MissingLetterPage() {
  const { progress, recordSolve } = useSubjectProgress('missing-letter');
  const { recordCorrect, logSession } = useRewards();

  const level = Math.min(3, progress.difficulty_level);
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    sessionStart.current = Date.now();
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      logSession({ subject: 'english', durationMinutes: mins, completedModules: 1 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Telemetry custom hook initialization
  const telemetry = useGameTelemetry('missing-letter', 'english');

  // Initialise queue and choices together so choices always match queue[0]
  const [queue, setQueue] = useState<WordItem[]>(() => getWordsForLevel(1));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>(() => {
    const q = getWordsForLevel(1);
    return getChoices(q[0].word, q[0].blankIndex, 1);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const item = queue[index % queue.length];

  const advance = useCallback(() => {
    const nextIdx = (index + 1) % queue.length;
    // Refill when cycling
    if (nextIdx === 0) {
      const newQueue = getWordsForLevel(level);
      setQueue(newQueue);
      setChoices(getChoices(newQueue[0].word, newQueue[0].blankIndex, level));
    } else {
      setChoices(getChoices(queue[nextIdx].word, queue[nextIdx].blankIndex, level));
    }
    setIndex(nextIdx);
    setSelected(null);
    setFeedback(null);
  }, [index, queue, level]);

  // Voice narration player
  const playAudio = useCallback(() => {
    if (sessionCompleted || !item) return;
    setIsSpeaking(true);
    // Explicitly record narration replay in telemetry
    telemetry.recordReplay();

    const spelledWord = item.word.toUpperCase().split('').map((c, i) => i === item.blankIndex ? 'blank' : c).join(' ');
    audioEngine.speak(
      `Spell the word ${item.word}. It is written as ${spelledWord}. What is the missing letter?`,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, [item, telemetry, sessionCompleted]);

  // Initial welcome auto play voice prompt
  useEffect(() => {
    if (sessionCompleted || !item) return;
    const t = setTimeout(() => {
      setIsSpeaking(true);
      const spelledWord = item.word.toUpperCase().split('').map((c, i) => i === item.blankIndex ? 'blank' : c).join(' ');
      audioEngine.speak(
        `Spell the word ${item.word}. It is written as ${spelledWord}. What is the missing letter?`,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }, 1800); // Wait for IntroScene animations

    return () => clearTimeout(t);
  }, [item?.word, index, sessionCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start telemetry question timer immediately when index changes
  useEffect(() => {
    if (sessionCompleted || !item) return;
    telemetry.startQuestion(index);
  }, [index, sessionCompleted, item?.word]); // eslint-disable-line react-hooks/exhaustive-deps

  // Session start EventBus trigger
  useEffect(() => {
    eventBus.emit('GAME_START');
  }, []);

  const handleChoice = async (letter: string) => {
    if (feedback || sessionCompleted) return;
    setSelected(letter);
    const correct = letter === item.word[item.blankIndex].toUpperCase();
    setFeedback(correct ? 'correct' : 'wrong');

    // Telemetry: record attempt and programmatically compute struggle tag
    const targetChar = item.word[item.blankIndex];
    const struggleTag = telemetry.recordAnswer(correct, targetChar, item.word, item.level);

    // Save solve outcome to progression db
    await recordSolve(correct, struggleTag);

    if (correct) {
      recordCorrect('english');
      // Fire CORRECT_ANSWER EventBus sequence
      eventBus.emit('CORRECT_ANSWER');

      // Check if session completed target questions (5 questions target)
      const nextCorrectCount = telemetry.correctAnswers + 1;
      if (nextCorrectCount >= 5) {
        setSessionCompleted(true);
        // Triggers SESSION_COMPLETE celebration and Firestore telemetry write inside GameWrapper
        telemetry.completeSession();
        return;
      }
    } else {
      // Fire WRONG_ANSWER EventBus sequence
      eventBus.emit('WRONG_ANSWER');
    }

    setTimeout(advance, correct ? 1200 : 1800);
  };

  const handlePlayAgain = () => {
    // Reset state to play another round
    setSessionCompleted(false);
    const newQueue = getWordsForLevel(level);
    setQueue(newQueue);
    setChoices(getChoices(newQueue[0].word, newQueue[0].blankIndex, level));
    setIndex(0);
    setSelected(null);
    setFeedback(null);
    eventBus.emit('GAME_START');
  };

  // Build the display with the blank slot
  const wordDisplay = item ? item.word.toUpperCase().split('').map((ch, i) => ({
    char: i === item.blankIndex ? (selected ?? '\u00a0') : ch,
    isBlank: i === item.blankIndex,
    revealed: feedback !== null && i === item.blankIndex,
  })) : [];

  return (
    <GameWrapper
      gameId="missing-letter"
      subject="english"
      world="jungle"
      title="Missing Letter"
      subtitle="Fill in the blank to complete the word"
      mascot="owl"
      onHintClick={telemetry.recordHint}
    >
      <div className="flex flex-col gap-6">
        
        {sessionCompleted ? (
          /* ── Celebration / Completed view ─────────────────────── */
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-2xl animate-fade-in">
            <div className="text-7xl animate-bounce">🏆</div>
            <h2 className="text-3xl font-extrabold text-white">Wonderful Session!</h2>
            <p className="text-white/80 max-w-md text-sm md:text-base leading-relaxed">
              Super spelling work! You solved all <strong className="text-yellow-300">5</strong> missing letters. Your progress telemetry has been successfully compiled and stored.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-150"
              >
                Play Again 🦉
              </button>
              <Link
                href="/learning-path"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-full font-bold active:scale-95 transition-all duration-150"
              >
                Learning Path →
              </Link>
            </div>
          </div>
        ) : (
          /* ── Active Gameplay view ──────────────────────────────── */
          <div className="flex flex-col gap-6">
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-6 md:p-10 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden"
            >
              {/* Animated backdrop jungle foliage circles */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-400/10 rounded-full blur-2xl animate-pulse" />

              {/* Emoji illustration */}
              {item && (
                <div className="text-7xl md:text-8xl leading-none select-none drop-shadow-md z-10 transform hover:scale-105 transition-transform duration-200">
                  {item.emoji}
                </div>
              )}

              {/* Word characters with blank tile */}
              <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 z-10">
                {wordDisplay.map((slot, i) => (
                  <div
                    key={i}
                    id={slot.isBlank ? 'missing-letter-blank-slot' : undefined}
                    className={`
                      w-12 h-14 sm:w-16 sm:h-20 flex items-center justify-center
                      text-[28px] sm:text-[44px] font-bold rounded-[20px] select-none
                      border-2 shadow-sm transition-all duration-200
                      ${slot.isBlank
                        ? feedback === 'correct'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-110 shadow-lg shadow-emerald-500/20'
                          : feedback === 'wrong'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-shake'
                          : 'bg-emerald-950/40 border-dashed border-2 border-emerald-400/70 text-emerald-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] animate-pulse scale-105'
                        : 'bg-white/10 border-white/10 text-white'
                      }
                    `}
                  >
                    {slot.char}
                  </div>
                ))}
              </div>

              {/* Audio narrative player button */}
              <button
                onClick={playAudio}
                className={`flex flex-col items-center gap-2 px-8 py-3 rounded-[24px] border-2 transition-all duration-200 z-10 ${
                  isSpeaking
                    ? 'bg-emerald-600 border-emerald-500 text-white scale-95 shadow-md shadow-emerald-500/30'
                    : 'bg-white/5 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/25 hover:border-emerald-300 hover:scale-105'
                }`}
              >
                <span className="text-3xl">{isSpeaking ? '🔊' : '🔈'}</span>
                <span className="text-xs font-bold tracking-wide uppercase">
                  {isSpeaking ? 'Listening...' : 'Hear Word'}
                </span>
              </button>

              {/* Encouragement message */}
              <div className="h-8 flex items-center justify-center z-10">
                {feedback === 'correct' && item && (
                  <p className="text-lg md:text-xl font-extrabold text-emerald-300 animate-pulse">
                    🎉 Excellent! {item.word.toUpperCase()}!
                  </p>
                )}
                {feedback === 'wrong' && (
                  <p className="text-base md:text-lg font-bold text-amber-200 animate-pulse">
                    We can do it! Let us try again! 🌟
                  </p>
                )}
              </div>

              {/* Choice character buttons bank */}
              <div className="w-full border-t border-white/10 pt-6 z-10">
                <p className="text-center text-xs text-white/50 mb-4 font-medium tracking-wide">
                  Drag a letter to the blank slot, or tap it! 🌟
                </p>
                <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-lg mx-auto justify-items-center">
                  {choices.map(letter => {
                    const isSelected = selected === letter;
                    const isCorrect = item && letter === item.word[item.blankIndex].toUpperCase();
                    
                    return (
                      <ChoiceTile
                        key={letter}
                        letter={letter}
                        onDrop={handleChoice}
                        feedback={feedback}
                        isCorrect={!!isCorrect}
                        isSelected={isSelected}
                        disabled={!!feedback}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-[20px] p-5 text-center shadow-inner z-10">
              <p className="text-emerald-200/70 text-xs md:text-sm leading-relaxed">
                Look at the picture above, then drag or tap the correct letter to fill the blank. Work through 3 spelling levels!
                <br />
                <span className="text-lime-300/80 font-bold mt-1 inline-block">
                  Level 1: CVC vowels · Level 2: 4-letter blends · Level 3: 5-letter structures
                </span>
              </p>
            </div>
          </div>
        )}

      </div>
    </GameWrapper>
  );
}
