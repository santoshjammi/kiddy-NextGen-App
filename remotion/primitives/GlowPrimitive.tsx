import React from 'react';
import { interpolate } from 'remotion';

interface GlowPrimitiveProps {
  type: 'pulse' | 'shine' | 'soothing' | 'cyan';
  frame: number;
  color?: string;
}

export const GlowPrimitive: React.FC<GlowPrimitiveProps> = ({ type, frame, color }) => {
  let scale = 1;
  let opacity = 0;
  let colorClass = 'bg-yellow-400/25';

  switch (type) {
    case 'pulse':
      scale = interpolate(frame, [0, 30], [0.8, 1.2]);
      opacity = interpolate(frame, [0, 10, 25, 30], [0, 0.6, 0.6, 0]);
      colorClass = color === 'current' ? 'bg-current/15' : 'bg-blue-400/15';
      break;
    case 'shine':
      scale = interpolate(frame, [0, 15, 30], [0.6, 1.4, 0.9]);
      opacity = interpolate(frame, [0, 10, 30], [0, 0.8, 0]);
      colorClass = color || 'bg-yellow-400/25';
      break;
    case 'soothing':
      scale = interpolate(frame, [0, 30], [0.8, 1.2]);
      opacity = interpolate(frame, [0, 10, 25, 30], [0, 0.6, 0.6, 0]);
      colorClass = color || 'bg-sky-300/15';
      break;
    case 'cyan':
      scale = interpolate(frame, [0, 30], [0.7, 1.3]);
      opacity = interpolate(frame, [0, 15, 60], [0, 0.7, 0]);
      colorClass = color || 'bg-cyan-400/20';
      break;
  }

  return (
    <div
      className={`absolute w-[220px] h-[220px] rounded-full filter blur-3xl pointer-events-none ${colorClass}`}
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

export default GlowPrimitive;
