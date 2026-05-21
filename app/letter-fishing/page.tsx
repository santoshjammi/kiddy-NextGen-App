'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSubjectProgress } from '../../components/useSubjectProgress';
import { useRewards } from '../../components/useRewards';
import { useGameTelemetry } from '../../components/useGameTelemetry';
import GameWrapper from '../../remotion/GameWrapper';
import eventBus from '../../remotion/eventBus';
import audioEngine from '../../remotion/audio/audioEngine';

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

  // Retrieve hook rect dynamically
  useEffect(() => {
    const el = document.getElementById('fishing-hook-zone');
    if (el) hookRef.current = el.getBoundingClientRect();
  });

  const getStyle = () => {
    if (feedback && isSelected) {
      return feedback === 'correct'
        ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/20'
        : 'bg-amber-400 border-amber-300 text-white scale-105 shadow-md shadow-amber-500/10';
    }
    if (feedback && isCorrect) {
      return 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200';
    }
    if (disabled && !isSelected) {
      return 'bg-white/5 border-white/10 text-white/30 opacity-40 cursor-not-allowed';
    }
    return 'bg-white/10 border-white/20 text-white hover:bg-sky-500/30 hover:border-sky-400 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing';
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

    // Highlight hook zone while hovering
    const hookEl = document.getElementById('fishing-hook-zone');
    if (hookEl) {
      const rect = hookEl.getBoundingClientRect();
      const over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      hookEl.classList.toggle('ring-4', over);
      hookEl.classList.toggle('ring-sky-400', over);
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
      hookEl.classList.remove('ring-4', 'ring-sky-400');
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
      data-testid="letter-tile"
      data-correct={isCorrect}
      className={`h-16 md:h-20 w-16 md:w-20 flex items-center justify-center text-[32px] md:text-[36px] font-bold rounded-[20px] border-2 transition-all duration-150 select-none touch-none ${getStyle()}`}
    >
      {letter}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function LetterFishingPage() {
  const { progress, recordSolve } = useSubjectProgress('letter-fishing');
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
  const telemetry = useGameTelemetry('letter-fishing', 'english');

  const [queue, setQueue] = useState<LetterItem[]>(() => getItemsForLevel(1));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const item = queue[index % queue.length];

  // Distractors generation
  useEffect(() => {
    if (item) {
      const distractors = getDistractors(item.letter, 5);
      setChoices(shuffle([item.letter, ...distractors]));
    }
  }, [item]);

  // Voice narration player
  const playAudio = useCallback(() => {
    if (sessionCompleted || !item) return;
    setIsSpeaking(true);
    // Explicitly record narration replay in telemetry
    telemetry.recordReplay();
    
    audioEngine.speak(
      `Find the letter ${item.letter}. ${item.letter} is for ${item.word}.`,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, [item, telemetry, sessionCompleted]);

  // Initial welcome auto play voice prompt
  useEffect(() => {
    if (sessionCompleted || !item) return;
    const t = setTimeout(() => {
      setIsSpeaking(true);
      audioEngine.speak(
        `Find the letter ${item.letter}. ${item.letter} is for ${item.word}.`,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }, 1800); // Wait for IntroScene welcoming animations to play

    return () => clearTimeout(t);
  }, [item?.letter, index, sessionCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start telemetry question timer immediately when index changes
  useEffect(() => {
    if (sessionCompleted || !item) return;
    telemetry.startQuestion(index);
  }, [index, sessionCompleted, item?.letter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Session start EventBus trigger
  useEffect(() => {
    eventBus.emit('GAME_START');
  }, []);

  const advance = useCallback(() => {
    const nextIdx = (index + 1) % queue.length;
    if (nextIdx === 0) {
      setQueue(getItemsForLevel(level));
      setIndex(0);
    } else {
      setIndex(nextIdx);
    }
    setSelected(null);
    setFeedback(null);
  }, [index, queue, level]);

  const handleDrop = async (letter: string) => {
    if (feedback || sessionCompleted) return;
    setSelected(letter);
    const correct = letter === item.letter;
    setFeedback(correct ? 'correct' : 'wrong');

    // Telemetry: record attempt and programmatically compute struggle tag
    const struggleTag = telemetry.recordAnswer(correct, item.letter, item.word, item.level);

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
    setQueue(getItemsForLevel(level));
    setIndex(0);
    setSelected(null);
    setFeedback(null);
    eventBus.emit('GAME_START');
  };

  return (
    <GameWrapper
      gameId="letter-fishing"
      subject="english"
      world="ocean"
      title="Letter Fishing"
      subtitle="Hear the letter — drag it to the hook!"
      mascot="bunny"
      onHintClick={telemetry.recordHint}
    >
      <div className="flex flex-col gap-6">
        
        {sessionCompleted ? (
          /* ── Celebration / Completed view ─────────────────────── */
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-2xl animate-fade-in">
            <div className="text-7xl animate-bounce">🏆</div>
            <h2 className="text-3xl font-extrabold text-white">Wonderful Session!</h2>
            <p className="text-white/80 max-w-md text-sm md:text-base leading-relaxed">
              Fantastic job! You caught all <strong className="text-yellow-300">5</strong> target letters. Your progress telemetry has been successfully compiled and stored.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-150"
              >
                Play Again 🎣
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
              {/* Animated backdrop bubbles */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />

              {/* Fishing hook drop zone */}
              <div className="flex flex-col items-center gap-1 select-none z-10">
                <div className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>🎣</div>
                <div className="w-[3px] h-8 bg-sky-200/50" />
                
                <div
                  id="fishing-hook-zone"
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-200 ${
                    feedback === 'correct'
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                      : feedback === 'wrong'
                      ? 'border-amber-400 bg-amber-400/25 shadow-md shadow-amber-500/20'
                      : 'border-dashed border-sky-400/50 bg-sky-500/10'
                  }`}
                >
                  {feedback === 'correct' ? (
                    <span className="text-4xl animate-bounce">🎉</span>
                  ) : feedback === 'wrong' ? (
                    <span className="text-4xl animate-pulse">🌟</span>
                  ) : selected ? (
                    <span className="text-4xl font-extrabold text-white">{selected}</span>
                  ) : (
                    <>
                      <span className="text-2xl">🪝</span>
                      <span className="text-[10px] text-sky-200/70 mt-1 text-center font-medium leading-tight px-3">
                        Drop tile here
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Emoji + Word hint */}
              {item && (
                <div className="flex flex-col items-center gap-3 z-10">
                  <div className="text-7xl md:text-8xl leading-none select-none drop-shadow-md transform hover:scale-105 transition-transform duration-200">
                    {item.emoji}
                  </div>
                  <p className="text-sky-100/90 text-xl font-bold tracking-widest uppercase bg-sky-950/40 px-6 py-2 rounded-full border border-sky-500/20">
                    {item.word}
                  </p>
                </div>
              )}

              {/* Audio narrative player button */}
              <button
                onClick={playAudio}
                className={`flex flex-col items-center gap-2 px-8 py-3 rounded-[24px] border-2 transition-all duration-200 z-10 ${
                  isSpeaking
                    ? 'bg-sky-500 border-sky-400 text-white scale-95 shadow-md shadow-sky-500/30'
                    : 'bg-white/5 border-sky-400/40 text-sky-200 hover:bg-sky-400/25 hover:border-sky-300 hover:scale-105'
                }`}
              >
                <span className="text-3xl">{isSpeaking ? '🔊' : '🔈'}</span>
                <span className="text-xs font-bold tracking-wide uppercase">
                  {isSpeaking ? 'Listening...' : 'Hear Letter'}
                </span>
              </button>

              {/* Warm, pediatric-compliant encouraging feedback text */}
              <div className="h-8 flex items-center justify-center z-10">
                {feedback === 'correct' && item && (
                  <p className="text-lg md:text-xl font-extrabold text-emerald-300 animate-pulse">
                    🌟 &quot;{item.letter}&quot; is for {item.word}!
                  </p>
                )}
                {feedback === 'wrong' && item && (
                  <p className="text-base md:text-lg font-bold text-amber-200 animate-pulse">
                    Let us try again! You are doing great! 🌟
                  </p>
                )}
              </div>

              {/* Draggable Letter tiles bank */}
              <div className="w-full z-10 border-t border-white/10 pt-6">
                <p className="text-center text-xs text-white/50 mb-4 font-medium tracking-wide">
                  Drag a tile to the hook, or simply tap it!
                </p>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6 max-w-xl mx-auto">
                  {choices.map(letter => (
                    <LetterTile
                      key={letter}
                      letter={letter}
                      onDrop={handleDrop}
                      feedback={feedback}
                      isCorrect={letter === item?.letter}
                      isSelected={selected === letter}
                      disabled={!!feedback}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="bg-sky-950/40 border border-sky-500/20 rounded-[20px] p-5 text-center shadow-inner z-10">
              <p className="text-sky-200/70 text-xs md:text-sm leading-relaxed">
                Click the 🔈 speaker button to hear the sound. Drag the matching tile into the 🪝 hook. 
                <br />
                <span className="text-teal-300/80 font-bold mt-1 inline-block">
                  Level 1: vowels · Level 2: consonants · Level 3: spelling blends
                </span>
              </p>
            </div>
          </div>
        )}

      </div>
    </GameWrapper>
  );
}
