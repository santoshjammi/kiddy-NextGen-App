"use client";

import { useState, useRef, useEffect } from 'react';
import eventBus from '../remotion/eventBus';

export interface GameSessionTelemetry {
  gameId: string;
  subject: 'math' | 'english';
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hintsUsed: number;
  replays: number;
  averageQuestionTimeSeconds: number;
  struggles: string[];
  completed: boolean;
  dropoffQuestionIndex?: number;
  timestamp: string;
}

export function useGameTelemetry(gameId: string, subject: 'math' | 'english') {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [replays, setReplays] = useState(0);
  const [struggles, setStruggles] = useState<string[]>([]);
  
  const questionStartTimeRef = useRef<number>(Date.now());
  const questionTimesRef = useRef<number[]>([]);
  const currentQuestionIndexRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);

  // Synchronous ref counters to ensure exact counts regardless of React state batching
  const totalQuestionsRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const wrongAnswersRef = useRef(0);
  const hintsUsedRef = useRef(0);
  const replaysRef = useRef(0);
  const strugglesRef = useRef<string[]>([]);

  // Start a new question
  const startQuestion = (index: number) => {
    questionStartTimeRef.current = Date.now();
    currentQuestionIndexRef.current = index;
  };

  // Record hint usage
  const recordHint = () => {
    setHintsUsed(prev => prev + 1);
    hintsUsedRef.current += 1;
  };

  // Record narration replay
  const recordReplay = () => {
    setReplays(prev => prev + 1);
    replaysRef.current += 1;
  };

  // Record answer attempt and dynamically compute struggle tag if wrong
  const recordAnswer = (
    correct: boolean,
    targetChar: string,
    word?: string,
    level?: number
  ): string | undefined => {
    // Calculate elapsed time
    const elapsedSeconds = Math.max(0.5, (Date.now() - questionStartTimeRef.current) / 1000);
    questionTimesRef.current.push(elapsedSeconds);

    setTotalQuestions(prev => prev + 1);
    totalQuestionsRef.current += 1;

    let struggleTag: string | undefined;

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      correctAnswersRef.current += 1;
    } else {
      setWrongAnswers(prev => prev + 1);
      wrongAnswersRef.current += 1;

      // Programmatic Struggle Tag Logic
      const charUpper = targetChar.toUpperCase();
      const isVowel = ['A', 'E', 'I', 'O', 'U'].includes(charUpper);

      if (isVowel) {
        struggleTag = 'vowel_confusion';
      } else {
        struggleTag = 'letter_recognition';
      }

      // Check for multi-syllable spelling struggles
      const isLevel3 = level === 3;
      const isLongWord = word && word.length >= 6;
      if (isLevel3 || isLongWord) {
        struggleTag = 'spelling_struggle';
      }

      if (struggleTag) {
        if (!strugglesRef.current.includes(struggleTag)) {
          strugglesRef.current.push(struggleTag);
          setStruggles([...strugglesRef.current]);
        }
      }
    }

    return struggleTag;
  };

  // Complete session successfully
  const completeSession = () => {
    completedRef.current = true;
    const finalTimes = questionTimesRef.current;
    const averageQuestionTime = finalTimes.length > 0 
      ? finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length 
      : 0;

    const telemetryPayload = {
      totalCount: totalQuestionsRef.current,
      correctCount: correctAnswersRef.current,
      points: replaysRef.current,
      rewards: [...strugglesRef.current],
      streak: 1,
      mastery: Number(averageQuestionTime.toFixed(1)),
      difficulty: hintsUsedRef.current
    };

    // Emit the complete session telemetry via the EventBus
    eventBus.emit('SESSION_COMPLETE', {
      payload: telemetryPayload,
      subject,
    });

    return {
      gameId,
      subject,
      totalQuestions: totalQuestionsRef.current,
      correctAnswers: correctAnswersRef.current,
      wrongAnswers: wrongAnswersRef.current,
      hintsUsed: hintsUsedRef.current,
      replays: replaysRef.current,
      averageQuestionTimeSeconds: Number(averageQuestionTime.toFixed(1)),
      struggles: [...strugglesRef.current],
      completed: true,
      timestamp: new Date().toISOString()
    };
  };

  // Handle unload and unmount drop-offs synchronously
  useEffect(() => {
    const handleUnload = () => {
      if (!completedRef.current && totalQuestionsRef.current > 0) {
        const finalTimes = questionTimesRef.current;
        const averageQuestionTime = finalTimes.length > 0 
          ? finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length 
          : 0;

        const telemetryPayload = {
          totalCount: totalQuestionsRef.current,
          correctCount: correctAnswersRef.current,
          points: replaysRef.current,
          rewards: [...strugglesRef.current],
          streak: 0,
          mastery: Number(averageQuestionTime.toFixed(1)),
          difficulty: currentQuestionIndexRef.current
        };

        // Emit dropoff telemetry synchronously so listeners capture it before page hides
        eventBus.emit('SESSION_COMPLETE', {
          payload: telemetryPayload,
          subject
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      handleUnload(); // Fallback on React unmount
    };
  }, [gameId, subject]);

  return {
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    hintsUsed,
    replays,
    struggles,
    startQuestion,
    recordHint,
    recordReplay,
    recordAnswer,
    completeSession
  };
}

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__LAST_TELEMETRY__ = null;
  eventBus.on('SESSION_COMPLETE', (payload) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__LAST_TELEMETRY__ = payload;
  });
}
