import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import MascotPrimitive from '../primitives/MascotPrimitive';
import GlowPrimitive from '../primitives/GlowPrimitive';
import BurstPrimitive from '../primitives/BurstPrimitive';
import RewardOverlayPrimitive from '../primitives/RewardOverlayPrimitive';

interface BadgeUnlockSceneProps {
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  mascot?: 'bunny' | 'owl';
}

export const BadgeUnlockScene: React.FC<BadgeUnlockSceneProps> = ({
  world,
  mascot = 'bunny',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      {/* Background radial glowing cyan circles */}
      <GlowPrimitive type="cyan" frame={frame} />

      {/* Bursting cyan sparkles */}
      <BurstPrimitive
        type="sparkle"
        frame={frame}
        fps={fps}
        yOffset={-35}
      />

      {/* Scaled Medal Overlay */}
      <RewardOverlayPrimitive
        type="badge"
        badgeType="medal"
        badgeText="NEW BADGE!"
        frame={frame}
        fps={fps}
      />

      {/* Mascot character with happy jump bounce (delayed by 10 frames) */}
      <MascotPrimitive
        mascot={mascot}
        expression="happy"
        motion="jump"
        frame={frame}
        fps={fps}
        delay={10}
        width={170}
        height={170}
        className="mt-14"
      />
    </div>
  );
};

export default BadgeUnlockScene;
