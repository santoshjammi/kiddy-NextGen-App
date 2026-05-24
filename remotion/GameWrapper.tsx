'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSubjectProgress } from '../components/useSubjectProgress';
import { useRewards } from '../components/useRewards';
import { useFirebase } from '../components/FirebaseProvider';
import { db } from '../firestore';
import { collection, addDoc } from 'firebase/firestore';
import AuthButton from '../components/AuthButton';
import eventBus, { EventPayload } from './eventBus';
import { SCENE_REGISTRY, SceneType } from './sceneRegistry';
import { Bunny } from './characters/Bunny';
import { Owl } from './characters/Owl';
import { audioEngine } from './audio/audioEngine';

// Import Sprint 2 Core Scene Components
import IntroScene from './scenes/IntroScene';
import CorrectScene from './scenes/CorrectScene';
import WrongScene from './scenes/WrongScene';
import RewardScene from './scenes/RewardScene';
import BadgeUnlockScene from './scenes/BadgeUnlockScene';

// Dynamically import Remotion Player to disable Server-Side Rendering (SSR)
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false }
);

interface GameWrapperProps {
  gameId: string;
  subject: 'math' | 'english';
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  title: string;
  subtitle: string;
  children: React.ReactNode;
  mascot?: 'bunny' | 'owl' | 'robot' | 'dino';
  onHintClick?: () => void;
}

// ── Remotion Composition Component ─────────────────────────────────
const KaeComposition: React.FC<{
  scene: SceneType;
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  isSpeaking: boolean;
  mascot?: 'bunny' | 'owl' | 'robot' | 'dino';
}> = ({ scene, world, isSpeaking, mascot = 'bunny' }) => {
  switch (scene) {
    case 'intro':
      return <IntroScene world={world} isSpeaking={isSpeaking} mascot={mascot === 'owl' ? 'owl' : 'bunny'} />;
    case 'correct_answer':
      return <CorrectScene world={world} mascot={mascot === 'owl' ? 'owl' : 'bunny'} />;
    case 'wrong_answer':
      return <WrongScene world={world} mascot={mascot === 'owl' ? 'owl' : 'bunny'} />;
    case 'reward_unlock':
      return <RewardScene world={world} mascot={mascot === 'owl' ? 'owl' : 'bunny'} />;
    case 'badge_unlock':
      return <BadgeUnlockScene world={world} mascot={mascot === 'owl' ? 'owl' : 'bunny'} />;
    default:
      return null;
  }
};

// ── Main GameWrapper component ─────────────────────────────────────
export const GameWrapper: React.FC<GameWrapperProps> = ({
  gameId,
  subject,
  world,
  title,
  subtitle,
  children,
  mascot = 'bunny',
  onHintClick,
}) => {
  const { progress } = useSubjectProgress(gameId);
  const { rewards } = useRewards();
  const { user } = useFirebase();

  const [activeScene, setActiveScene] = useState<SceneType>('intro');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(true);
  const [isMascotSpeaking, setIsMascotSpeaking] = useState(false);
  const [mascotCompanionExpression, setMascotCompanionExpression] = useState<'idle' | 'thinking' | 'happy'>('idle');
  const [mounted, setMounted] = useState(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get background gradients according to world theme
  const getBackgroundGradient = () => {
    switch (world) {
      case 'ocean':
        return 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#0c4a6e]';
      case 'farm':
        return 'bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#fbcfe8]';
      case 'jungle':
        return 'bg-gradient-to-b from-[#10b981] via-[#047857] to-[#064e3b]';
      case 'space':
        return 'bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#311042]';
      default:
        return 'bg-black';
    }
  };

  useEffect(() => {
    setMounted(true);
    // Play world music ambient
    audioEngine.playBackgroundMusic(world);

    // Initial Intro Sequence
    setIsPlayingAnimation(true);
    setActiveScene('intro');
    
    // Bunny voice welcome speech
    setIsMascotSpeaking(true);
    audioEngine.speak(
      `Welcome to ${title}! Let us play together.`,
      undefined,
      () => setIsMascotSpeaking(false)
    );

    // End intro composition after duration registered in sceneRegistry
    const durationMs = SCENE_REGISTRY.intro.durationSeconds * 1000;
    animationTimerRef.current = setTimeout(() => {
      setIsPlayingAnimation(false);
    }, durationMs);

    return () => {
      audioEngine.stopAll();
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [world, title]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bind EventBus listeners to catch game events and overlay Remotion comps
  useEffect(() => {
    const handleGameStart = () => {
      setIsPlayingAnimation(true);
      setActiveScene('intro');
      setTimeout(() => setIsPlayingAnimation(false), SCENE_REGISTRY.intro.durationSeconds * 1000);
    };

    const handleQuestionStart = () => {
      setIsPlayingAnimation(false);
      setMascotCompanionExpression('thinking');
      // Set to idle after a brief transition
      setTimeout(() => setMascotCompanionExpression('idle'), 1500);
    };

    const handleCorrectAnswer = () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      
      setIsPlayingAnimation(true);
      setActiveScene('correct_answer');
      
      // Chime + Mascot cheering speech
      audioEngine.playSFX('correct');
      setIsMascotSpeaking(true);
      
      audioEngine.playVoiceLine(
        'great_job',
        undefined,
        () => setIsMascotSpeaking(false)
      );

      if (gameId === 'letter-fishing') {
        const duration1Ms = SCENE_REGISTRY.correct_answer.durationSeconds * 1000;
        animationTimerRef.current = setTimeout(() => {
          setActiveScene('reward_unlock');
          audioEngine.playSFX('coin');
          const duration2Ms = SCENE_REGISTRY.reward_unlock.durationSeconds * 1000;
          animationTimerRef.current = setTimeout(() => {
            setIsPlayingAnimation(false);
          }, duration2Ms);
        }, duration1Ms);
      } else {
        const durationMs = SCENE_REGISTRY.correct_answer.durationSeconds * 1000;
        animationTimerRef.current = setTimeout(() => {
          setIsPlayingAnimation(false);
        }, durationMs);
      }
    };

    const handleWrongAnswer = () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

      setIsPlayingAnimation(true);
      setActiveScene('wrong_answer');

      // Frowny chime + encouraging speech
      audioEngine.playSFX('wrong');
      setIsMascotSpeaking(true);
      audioEngine.playVoiceLine(
        'try_again',
        undefined,
        () => setIsMascotSpeaking(false)
      );

      const durationMs = SCENE_REGISTRY.wrong_answer.durationSeconds * 1000;
      animationTimerRef.current = setTimeout(() => {
        setIsPlayingAnimation(false);
      }, durationMs);
    };

    const handleLevelComplete = () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

      setIsPlayingAnimation(true);
      setActiveScene('reward_unlock');

      audioEngine.playSFX('coin');
      setIsMascotSpeaking(true);
      audioEngine.speak(
        "Outstanding! You completed the level!",
        undefined,
        () => setIsMascotSpeaking(false)
      );

      setTimeout(() => setIsPlayingAnimation(false), SCENE_REGISTRY.reward_unlock.durationSeconds * 1000);
    };

    const handleBadgeUnlock = () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

      setIsPlayingAnimation(true);
      setActiveScene('badge_unlock');

      audioEngine.playSFX('badge');
      setIsMascotSpeaking(true);
      audioEngine.speak(
        "Congratulations! You unlocked a brand new badge!",
        undefined,
        () => setIsMascotSpeaking(false)
      );

      setTimeout(() => setIsPlayingAnimation(false), SCENE_REGISTRY.badge_unlock.durationSeconds * 1000);
    };

    const handleSessionComplete = async (payload: EventPayload) => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

      setIsPlayingAnimation(true);
      setActiveScene('reward_unlock');

      audioEngine.playSFX('coin');
      setIsMascotSpeaking(true);
      audioEngine.speak(
        "Outstanding! You completed the session!",
        undefined,
        () => setIsMascotSpeaking(false)
      );

      // Write session telemetry record to Firestore under users/{userId}/sessions
      if (user) {
        try {
          const telemetryData = {
            gameId,
            subject,
            totalQuestions: payload.payload?.totalCount ?? 0,
            correctAnswers: payload.payload?.correctCount ?? 0,
            wrongAnswers: (payload.payload?.totalCount ?? 0) - (payload.payload?.correctCount ?? 0),
            hintsUsed: payload.payload?.difficulty ?? 0,
            replays: payload.payload?.points ?? 0,
            averageQuestionTimeSeconds: payload.payload?.mastery ?? 0,
            struggles: payload.payload?.rewards ?? [],
            completed: payload.payload?.streak === 1,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().slice(0, 10)
          };

          const sessionsCol = collection(db, 'users', user.uid, 'sessions');
          await addDoc(sessionsCol, telemetryData);
          console.log("Telemetry session logged successfully:", telemetryData);
        } catch (err) {
          console.error("Error writing telemetry to Firestore:", err);
        }
      }

      const durationMs = SCENE_REGISTRY.reward_unlock.durationSeconds * 1000;
      animationTimerRef.current = setTimeout(() => {
        setIsPlayingAnimation(false);
      }, durationMs);
    };

    // Subscriptions
    const unsubStart = eventBus.on('GAME_START', handleGameStart);
    const unsubQStart = eventBus.on('QUESTION_START', handleQuestionStart);
    const unsubCorrect = eventBus.on('CORRECT_ANSWER', handleCorrectAnswer);
    const unsubWrong = eventBus.on('WRONG_ANSWER', handleWrongAnswer);
    const unsubLevel = eventBus.on('LEVEL_COMPLETE', handleLevelComplete);
    const unsubBadge = eventBus.on('BADGE_UNLOCK', handleBadgeUnlock);
    const unsubSessionComplete = eventBus.on('SESSION_COMPLETE', handleSessionComplete);

    return () => {
      unsubStart();
      unsubQStart();
      unsubCorrect();
      unsubWrong();
      unsubLevel();
      unsubBadge();
      unsubSessionComplete();
    };
  }, [gameId, subject, user]);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${getBackgroundGradient()} flex items-center justify-center`}>
        <div className="text-white font-medium text-lg animate-pulse">Loading engine...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} relative overflow-x-hidden flex flex-col`}>
      
      {/* ── App Shell Navigation Header ───────────────────────── */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => audioEngine.playSFX('click')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white text-sm font-semibold transition-all duration-150 active:scale-95"
          >
            ← Back
          </Link>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">{title}</h1>
            <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* ── Central Main Container ────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6 relative z-10">
        
        {/* Statistics and Score Tracker Progress bar */}
        <div className="flex items-center justify-between bg-black/25 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="bg-blue-500/90 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              Level {progress.difficulty_level || 1}
            </span>
            <span className="text-white/70 text-sm font-medium">
              Points: <strong className="text-yellow-300 font-bold">{rewards.points}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 font-semibold">{progress.mastery_score || 0}% Mastery</span>
              <div className="w-24 h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full transition-all duration-500"
                  style={{ width: `${progress.mastery_score || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game Stage Area */}
        <div className="relative min-h-[400px] flex flex-col">
          {/* Remotion Full-screen / Center Animation Overlays */}
          {isPlayingAnimation && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
              <div className="w-full max-w-[400px] h-[340px]">
                <Player
                  component={KaeComposition}
                  inputProps={{ scene: activeScene, world, isSpeaking: isMascotSpeaking, mascot }}
                  durationInFrames={Math.round(SCENE_REGISTRY[activeScene]?.durationSeconds * 30)}
                  fps={30}
                  compositionWidth={360}
                  compositionHeight={280}
                  style={{ width: '100%', height: '100%' }}
                  controls={false}
                  autoPlay
                  loop
                />
              </div>
            </div>
          )}

          {/* Actual Active Game screen content (Rendered underneath/as primary when idle) */}
          <div className={`flex-1 transition-opacity duration-300 ${isPlayingAnimation ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>
            {children}
          </div>
        </div>

        {/* Mascot Companion sticky bubble widget in question state */}
        {!isPlayingAnimation && (
          <div
            onClick={() => {
              setMascotCompanionExpression('happy');
              audioEngine.playSFX('click');
              audioEngine.speak("I am here to help you! You are doing amazing.");
              setTimeout(() => setMascotCompanionExpression('idle'), 3000);
              if (onHintClick) onHintClick();
            }}
            className="fixed bottom-6 right-6 z-40 bg-white/90 dark:bg-slate-900/90 border-2 border-blue-400/30 rounded-full p-2 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 group"
          >
            <div className="relative w-16 h-16">
              {mascot === 'owl' ? (
                <Owl expression={mascotCompanionExpression} width="100%" height="100%" />
              ) : (
                <Bunny expression={mascotCompanionExpression} width="100%" height="100%" />
              )}
              <div className="absolute -top-10 right-0 scale-0 group-hover:scale-100 bg-black text-white text-xs font-bold rounded-lg px-2 py-1 shadow-md transition-all duration-200 whitespace-nowrap">
                Tap me! {mascot === 'owl' ? '🦉' : '🐰'}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="w-full py-6 mt-8 text-center text-white/40 text-xs border-t border-white/5 bg-black/10">
        Powered by Kiddy Animation Engine (KAE) · Reusable Remotion Architecture
      </footer>

    </div>
  );
};

export default GameWrapper;
