import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import MascotPrimitive from '../primitives/MascotPrimitive';
import SpeechBubblePrimitive from '../primitives/SpeechBubblePrimitive';
import GlowPrimitive from '../primitives/GlowPrimitive';

interface IntroSceneProps {
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  isSpeaking?: boolean;
  mascot?: 'bunny' | 'owl';
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  world,
  isSpeaking = false,
  mascot = 'bunny',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wave expression sequence matching the original timing
  let expression: 'wave' | 'idle' | 'happy' = 'idle';
  if (frame >= 15 && frame < 45) {
    expression = 'wave';
  } else if (frame >= 45) {
    expression = 'happy';
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      {/* Visual Ambient: Subtle rotating ray pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent scale-150 animate-pulse"
        style={{
          transform: `rotate(${frame * 0.5}deg)`,
        }}
      />

      {/* Background soft glow pulse */}
      <GlowPrimitive type="pulse" frame={frame} color="current" />

      {/* Mascot entry spring animation */}
      <MascotPrimitive
        mascot={mascot}
        expression={expression}
        motion="enter"
        frame={frame}
        fps={fps}
        isSpeaking={isSpeaking}
        width={190}
        height={190}
      />

      {/* Dialogue Speech Bubble scaling in with floating animation */}
      <SpeechBubblePrimitive
        type="bubble"
        title="Ready to Play! 🎮"
        text="Let's play together!"
        frame={frame}
        fps={fps}
        delay={12}
        world={world}
      />
    </div>
  );
};

export default IntroScene;
