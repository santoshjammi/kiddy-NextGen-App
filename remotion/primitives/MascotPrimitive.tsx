import React from 'react';
import { spring, interpolate } from 'remotion';
import Bunny from '../characters/Bunny';
import Owl from '../characters/Owl';

interface MascotPrimitiveProps {
  mascot?: 'bunny' | 'owl';
  expression: 'wave' | 'excited' | 'happy' | 'sad' | 'thinking' | 'idle';
  motion: 'enter' | 'jump' | 'shake' | 'float' | 'none';
  frame: number;
  fps: number;
  delay?: number;
  isSpeaking?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const MascotPrimitive: React.FC<MascotPrimitiveProps> = ({
  mascot = 'bunny',
  expression,
  motion,
  frame,
  fps,
  delay = 0,
  isSpeaking = false,
  width = 180,
  height = 180,
  className = '',
}) => {
  const activeFrame = Math.max(0, frame - delay);

  let mascotY = 0;
  let mascotX = 0;
  let scaleX = 1;
  let scaleY = 1;

  switch (motion) {
    case 'enter': {
      const enterSpring = spring({
        frame: activeFrame,
        fps,
        config: {
          damping: 12,
          stiffness: 100,
          mass: 0.8,
        },
      });
      mascotY = interpolate(enterSpring, [0, 1], [300, 0]);
      scaleX = interpolate(enterSpring, [0, 1], [0.5, 1]);
      scaleY = interpolate(enterSpring, [0, 1], [0.5, 1]);
      break;
    }
    case 'jump': {
      const jumpSpring = spring({
        frame: activeFrame,
        fps,
        config: {
          damping: 9,
          stiffness: 125,
          mass: 0.65,
        },
      });
      // Crouch (0 to 0.15), jump up (0.4), peak (0.7), land (1)
      mascotY = interpolate(jumpSpring, [0, 0.4, 0.7, 1], [0, -60, -80, 0]);
      scaleX = interpolate(jumpSpring, [0, 0.15, 0.4, 0.8, 1], [1, 1.15, 0.88, 1.05, 1]);
      scaleY = interpolate(jumpSpring, [0, 0.15, 0.4, 0.8, 1], [1, 0.85, 1.15, 0.95, 1]);
      break;
    }
    case 'shake': {
      const shakeAmplitude = interpolate(activeFrame, [0, 15], [8, 0], {
        extrapolateRight: 'clamp',
      });
      mascotX = Math.sin(activeFrame * (2 * Math.PI / 4.5)) * shakeAmplitude;
      break;
    }
    case 'float': {
      mascotY = Math.sin(activeFrame / 6) * 4;
      break;
    }
    case 'none':
    default:
      break;
  }

  const dropShadowClass = motion === 'shake' 
    ? 'filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]' 
    : 'filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]';

  return (
    <div
      style={{
        transform: `translate(${mascotX}px, ${mascotY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'bottom center',
      }}
      className={`flex flex-col items-center justify-center relative z-20 ${className}`}
    >
      {mascot === 'owl' ? (
        <Owl
          expression={expression}
          isSpeaking={isSpeaking}
          width={width}
          height={height}
          className={dropShadowClass}
        />
      ) : (
        <Bunny
          expression={expression}
          isSpeaking={isSpeaking}
          width={width}
          height={height}
          className={dropShadowClass}
        />
      )}
    </div>
  );
};

export default MascotPrimitive;
