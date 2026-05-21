import React from 'react';
import { spring, interpolate } from 'remotion';

interface BurstPrimitiveProps {
  type: 'star' | 'sparkle';
  frame: number;
  fps: number;
  count?: number;
  color?: string;
  stroke?: string;
  yOffset?: number;
}

export const BurstPrimitive: React.FC<BurstPrimitiveProps> = ({
  type,
  frame,
  fps,
  count = 8,
  color,
  stroke,
  yOffset = 0,
}) => {
  const burstSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: type === 'star' ? 90 : 85,
    },
  });

  const particles = Array.from({ length: count }).map((_, index) => {
    const angle = (index * 2 * Math.PI) / count;
    const maxDistance = type === 'star' ? 150 : 130;
    const distance = interpolate(burstSpring, [0, 1], [0, maxDistance]);
    
    const peakScale = type === 'star' ? 1.3 : 1.2;
    const peakFrame = type === 'star' ? 0.3 : 0.4;
    const scale = interpolate(burstSpring, [0, peakFrame, 1], [0, peakScale, 0]);
    
    const rotation = type === 'star' 
      ? interpolate(frame, [0, 30], [0, 180 + index * 45])
      : 0;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + yOffset;

    return { x, y, scale, rotation };
  });

  // Star SVG path (type === 'star')
  const starPath = "M 0 -8 L 2.5 -2.5 L 8 -2.5 L 3.5 1.5 L 5 7 L 0 3.5 L -5 7 L -3.5 1.5 L -8 -2.5 L -2.5 -2.5 Z";
  // Sparkle SVG path (type === 'sparkle')
  const sparklePath = "M 0 -6 L 1.8 -1.8 L 6 -1.8 L 2.6 1.1 L 3.8 5.3 L 0 2.7 L -3.8 5.3 L -2.6 1.1 L -6 -1.8 L -1.8 -1.8 Z";

  const pathD = type === 'star' ? starPath : sparklePath;
  const fillColor = color || (type === 'star' ? '#F59E0B' : '#22D3EE');
  const strokeColor = stroke || (type === 'star' ? '#FBBF24' : '#E0F2FE');
  const strokeWidthVal = type === 'star' ? '1' : '0.8';

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <g transform="translate(180, 120)">
        {particles.map((p, i) => (
          <path
            key={i}
            d={pathD}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidthVal}
            style={{
              transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </g>
    </svg>
  );
};

export default BurstPrimitive;
