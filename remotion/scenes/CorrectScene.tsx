import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import MascotPrimitive from '../primitives/MascotPrimitive';
import SpeechBubblePrimitive from '../primitives/SpeechBubblePrimitive';
import GlowPrimitive from '../primitives/GlowPrimitive';
import BurstPrimitive from '../primitives/BurstPrimitive';
import ConfettiPrimitive from '../primitives/ConfettiPrimitive';

interface CorrectSceneProps {
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  mascot?: 'bunny' | 'owl';
}

export const CorrectScene: React.FC<CorrectSceneProps> = ({
  mascot = 'bunny',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      {/* Background radial shine pulse */}
      <GlowPrimitive type="shine" frame={frame} />

      {/* Confetti Rain (falls behind character) */}
      <ConfettiPrimitive frame={frame} />

      {/* Bursting Stars */}
      <BurstPrimitive type="star" frame={frame} fps={fps} />

      {/* Mascot character with excited jump bounce */}
      <MascotPrimitive
        mascot={mascot}
        expression="excited"
        motion="jump"
        frame={frame}
        fps={fps}
        width={180}
        height={180}
      />

      {/* Congratulatory Text Banner with bouncy scaling */}
      <SpeechBubblePrimitive
        type="banner"
        title="GREAT JOB! 🌟"
        frame={frame}
        fps={fps}
      />
    </div>
  );
};

export default CorrectScene;
