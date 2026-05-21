import React from 'react';
import { spring, interpolate } from 'remotion';

interface SpeechBubblePrimitiveProps {
  type: 'bubble' | 'banner';
  title: string;
  text?: string;
  frame: number;
  fps: number;
  delay?: number;
  world?: 'ocean' | 'farm' | 'jungle' | 'space';
  isWrongScene?: boolean;
  className?: string;
}

export const SpeechBubblePrimitive: React.FC<SpeechBubblePrimitiveProps> = ({
  type,
  title,
  text,
  frame,
  fps,
  delay = 0,
  world,
  isWrongScene = false,
  className = '',
}) => {
  const activeFrame = Math.max(0, frame - delay);

  // 1. Spring-driven or Interpolated scale/opacity calculations
  if (type === 'banner') {
    const scale = interpolate(activeFrame, [0, 10], [0.5, 1], {
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(activeFrame, [0, 5, 25, 30], [0, 1, 1, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
        className={`mt-3 relative z-30 ${className}`}
      >
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-wider text-center">
          {title}
        </h2>
      </div>
    );
  }

  // Bubble Spring Configuration
  const bubbleSpring = spring({
    frame: activeFrame,
    fps,
    config: isWrongScene
      ? { damping: 14, stiffness: 95 }
      : { damping: 15, stiffness: 110 },
  });

  const scale = interpolate(bubbleSpring, [0, 1], [isWrongScene ? 0.3 : 0, 1]);
  const opacity = interpolate(bubbleSpring, [0, 1], [isWrongScene ? 0.2 : 0, 1]);

  // Floating Micro-animation (slow wave motion)
  const floatOffset = Math.sin(activeFrame / (isWrongScene ? 5 : 6)) * (isWrongScene ? 4 : 8);

  // Curated themes for the speech bubble
  const getThemeStyles = () => {
    if (isWrongScene) {
      return {
        bubbleBg: 'bg-gradient-to-r from-sky-400/90 to-indigo-500/90 border-sky-200/35 text-white',
        glowColor: 'shadow-xl',
        arrowColor: 'border-b-sky-400/90',
        maxW: 'max-w-[260px]',
      };
    }

    switch (world) {
      case 'ocean':
        return {
          bubbleBg: 'bg-sky-500/90 border-sky-400/40 text-white',
          glowColor: 'shadow-2xl shadow-cyan-400/30',
          arrowColor: 'border-b-sky-500/90',
          maxW: 'max-w-[280px]',
        };
      case 'farm':
        return {
          bubbleBg: 'bg-amber-400/95 border-amber-300/40 text-slate-800',
          glowColor: 'shadow-2xl shadow-amber-400/30',
          arrowColor: 'border-b-amber-400/95',
          maxW: 'max-w-[280px]',
        };
      case 'jungle':
        return {
          bubbleBg: 'bg-emerald-600/90 border-emerald-500/40 text-white',
          glowColor: 'shadow-2xl shadow-emerald-400/30',
          arrowColor: 'border-b-emerald-600/90',
          maxW: 'max-w-[280px]',
        };
      case 'space':
        return {
          bubbleBg: 'bg-indigo-650/90 border-indigo-500/40 text-white',
          glowColor: 'shadow-2xl shadow-indigo-500/30',
          arrowColor: 'border-b-indigo-650/90',
          maxW: 'max-w-[280px]',
        };
      default:
        return {
          bubbleBg: 'bg-blue-600/95 border-blue-500/40 text-white',
          glowColor: 'shadow-2xl shadow-blue-500/30',
          arrowColor: 'border-b-blue-600/95',
          maxW: 'max-w-[280px]',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${floatOffset}px)`,
        opacity,
        transformOrigin: 'top center',
      }}
      className={`mt-4 px-6 py-3.5 rounded-3xl border-2 shadow-2xl flex flex-col items-center gap-1.5 backdrop-blur-sm relative z-20 ${theme.bubbleBg} ${theme.glowColor} ${theme.maxW} ${className}`}
    >
      {/* Trianglular arrow pointing upwards to the mascot */}
      <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] ${theme.arrowColor} opacity-90`} />

      <h2 className={isWrongScene ? 'text-base font-black tracking-wide text-center' : 'text-xl font-black tracking-wide text-center'}>
        {title}
      </h2>
      {text && (
        <p className={isWrongScene 
          ? 'text-[10px] font-bold text-center text-sky-100 uppercase tracking-widest leading-relaxed'
          : 'text-[11px] font-semibold text-center opacity-90 leading-relaxed uppercase tracking-wider'
        }>
          {text}
        </p>
      )}
    </div>
  );
};

export default SpeechBubblePrimitive;
