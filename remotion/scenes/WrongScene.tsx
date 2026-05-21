import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import MascotPrimitive from '../primitives/MascotPrimitive';
import SpeechBubblePrimitive from '../primitives/SpeechBubblePrimitive';
import GlowPrimitive from '../primitives/GlowPrimitive';

interface WrongSceneProps {
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  mascot?: 'bunny' | 'owl';
}

export const WrongScene: React.FC<WrongSceneProps> = ({
  world,
  mascot = 'bunny',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character expression transition matching original timing
  const expression = frame >= 12 ? 'thinking' : 'sad';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      {/* Visual Ambient: Soothing glow (No red!) */}
      <GlowPrimitive type="soothing" frame={frame} />

      {/* Mascot with shake motion */}
      <MascotPrimitive
        mascot={mascot}
        expression={expression}
        motion="shake"
        frame={frame}
        fps={fps}
        width={170}
        height={170}
      />

      {/* Comforting & Soothing Speech Bubble */}
      <SpeechBubblePrimitive
        type="bubble"
        title="Nice try! 💪"
        text="Let's think together! 💡"
        frame={frame}
        fps={fps}
        isWrongScene={true}
        className="mt-3"
      />
    </div>
  );
};

export default WrongScene;
