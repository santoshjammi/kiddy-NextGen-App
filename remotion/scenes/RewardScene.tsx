import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import MascotPrimitive from '../primitives/MascotPrimitive';
import RewardOverlayPrimitive from '../primitives/RewardOverlayPrimitive';

interface RewardSceneProps {
  world: 'ocean' | 'farm' | 'jungle' | 'space';
  mascot?: 'bunny' | 'owl';
}

export const RewardScene: React.FC<RewardSceneProps> = ({
  world,
  mascot = 'bunny',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      {/* Background Sunburst and Shower of Golden Coins */}
      <RewardOverlayPrimitive
        type="coins"
        showSunburst={true}
        frame={frame}
        fps={fps}
      />

      {/* Celebratory Trophy Badge Overlay */}
      <RewardOverlayPrimitive
        type="badge"
        badgeType="gold_cup"
        badgeText="LEVEL UP!"
        frame={frame}
        fps={fps}
      />

      {/* Mascot character with excited jump bounce (delayed by 10 frames) */}
      <MascotPrimitive
        mascot={mascot}
        expression="excited"
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

export default RewardScene;
