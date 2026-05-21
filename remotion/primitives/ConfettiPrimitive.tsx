import React from 'react';
import { interpolate } from 'remotion';

interface ConfettiPrimitiveProps {
  frame: number;
  count?: number;
  colors?: string[];
}

const DEFAULT_CONFETTI_COLORS = ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#fb7185'];

export const ConfettiPrimitive: React.FC<ConfettiPrimitiveProps> = ({
  frame,
  count = 20,
  colors = DEFAULT_CONFETTI_COLORS,
}) => {
  const confetti = Array.from({ length: count }).map((_, index) => {
    // Deterministic placements based on index
    const startX = (index * 18.5) % 360;
    const speedY = 4 + (index % 3);
    const delay = (index * 2) % 10;
    const size = 6 + (index % 4);
    const color = colors[index % colors.length];

    const currentFrame = Math.max(0, frame - delay);
    const y = -10 + currentFrame * speedY;
    const xOffset = Math.sin((currentFrame + index) / 4) * 15;
    const x = startX + xOffset;
    const rotate = currentFrame * (speedY * 1.5) + index * 10;

    return { x, y, size, color, rotate };
  });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {confetti.map((c, i) => {
        const isCircle = i % 2 === 0;
        const opacity = interpolate(frame, [20, 30], [1, 0], { extrapolateLeft: 'clamp' });
        return isCircle ? (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.size / 2}
            fill={c.color}
            opacity={opacity}
          />
        ) : (
          <rect
            key={i}
            x={c.x - c.size / 2}
            y={c.y - c.size / 2}
            width={c.size}
            height={c.size * 1.5}
            fill={c.color}
            rx={1.5}
            opacity={opacity}
            style={{
              transform: `rotate(${c.rotate}deg)`,
              transformOrigin: `${c.x}px ${c.y}px`,
            }}
          />
        );
      })}
    </svg>
  );
};

export default ConfettiPrimitive;
