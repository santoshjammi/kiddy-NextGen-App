import React from 'react';
import { spring, interpolate } from 'remotion';

interface RewardOverlayPrimitiveProps {
  type: 'badge' | 'coins';
  badgeType?: 'gold_cup' | 'medal';
  badgeText?: string;
  showSunburst?: boolean;
  frame: number;
  fps: number;
  delay?: number;
  className?: string;
}

export const RewardOverlayPrimitive: React.FC<RewardOverlayPrimitiveProps> = ({
  type,
  badgeType = 'gold_cup',
  badgeText = 'LEVEL UP!',
  showSunburst = false,
  frame,
  fps,
  delay = 0,
  className = '',
}) => {
  const activeFrame = Math.max(0, frame - delay);

  // 1. Sunburst component
  const renderSunburst = () => {
    const rayRotate = interpolate(activeFrame, [0, 60], [0, 90]);
    return (
      <svg 
        className="absolute w-[360px] h-[360px] pointer-events-none opacity-20 z-0 text-yellow-300"
        style={{
          transform: `rotate(${rayRotate}deg)`,
          transformOrigin: 'center center',
        }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M 50 50 L 42 0 L 58 0 Z"
            fill="currentColor"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </svg>
    );
  };

  // 2. Badge Overlay render
  if (type === 'badge') {
    const isMedal = badgeType === 'medal';
    const badgeSpring = spring({
      frame: activeFrame,
      fps,
      config: isMedal
        ? { damping: 10, stiffness: 90, mass: 0.95 }
        : { damping: 11, stiffness: 100, mass: 0.9 },
    });

    const badgeScale = interpolate(badgeSpring, [0, 1], [0, isMedal ? 1.35 : 1.3]);
    const badgeY = interpolate(badgeSpring, [0, 1], [-80, -35]);
    const badgeRotate = interpolate(activeFrame, [0, 60], isMedal ? [10, -10] : [-10, 15]);

    const emoji = isMedal ? '🏅' : '🏆';
    const textBorderColor = isMedal 
      ? 'text-cyan-200 border-cyan-400/30' 
      : 'text-yellow-300 border-yellow-400/30';

    return (
      <div
        style={{
          transform: `translateY(${badgeY}px) scale(${badgeScale}) rotate(${badgeRotate}deg)`,
          transformOrigin: 'center center',
        }}
        className={`absolute z-20 flex flex-col items-center justify-center pointer-events-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.32)] ${className}`}
      >
        <span className="text-6xl select-none">{emoji}</span>
        <h2 className={`text-2xl font-black tracking-wider bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border mt-2 text-center shadow-lg ${textBorderColor}`}>
          {badgeText}
        </h2>
      </div>
    );
  }

  // 3. Falling Coins Overlay render
  // Deterministic coin positions and sizes
  const numCoins = 18;
  const coins = Array.from({ length: numCoins }).map((_, index) => {
    const startX = 35 + (index * 17.5) % 290;
    const speedY = 5 + (index % 4);
    const coinDelay = 12 + ((index * 3) % 15);
    const size = 12 + (index % 6);
    
    const currentFrame = Math.max(0, activeFrame - coinDelay);
    const y = -20 + currentFrame * speedY;
    const xOffset = Math.sin((currentFrame + index) / 3.5) * 20;
    const x = startX + xOffset;
    const rotate = currentFrame * (speedY * 2) + index * 15;

    return { x, y, size, rotate };
  });

  const coinsOpacity = interpolate(activeFrame, [45, 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {showSunburst && renderSunburst()}
      <svg className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}>
        {coins.map((c, i) => (
          <g
            key={i}
            style={{
              transform: `translate(${c.x}px, ${c.y}px) rotate(${c.rotate}deg)`,
              transformOrigin: 'center center',
            }}
            opacity={coinsOpacity}
          >
            {/* Golden Circle Coin */}
            <circle cx="0" cy="0" r={c.size / 2} fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
            <circle cx="0" cy="0" r={c.size / 3} fill="#F59E0B" />
            {/* Dollar sign or emblem */}
            <text 
              x="0" 
              y={c.size / 7} 
              textAnchor="middle" 
              fontSize={c.size / 1.5} 
              fontWeight="black" 
              fill="#FFF" 
              fontFamily="monospace"
            >
              $
            </text>
          </g>
        ))}
      </svg>
    </>
  );
};

export default RewardOverlayPrimitive;
