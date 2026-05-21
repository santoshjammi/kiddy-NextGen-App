import React from 'react';

export interface OwlProps {
  expression: 'happy' | 'excited' | 'thinking' | 'sad' | 'wave' | 'jump' | 'idle';
  isSpeaking?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Owl: React.FC<OwlProps> = ({
  expression,
  isSpeaking = false,
  width = 240,
  height = 240,
  className = '',
}) => {
  const isJumping = expression === 'jump';
  const isWaving = expression === 'wave';
  const isExcited = expression === 'excited';
  const isSad = expression === 'sad';
  const isThinking = expression === 'thinking';
  const isHappy = expression === 'happy';

  // Build the inline SVG styles for rich keyframe animations
  const styles = `
    .owl-container {
      transform-box: fill-box;
      transform-origin: center bottom;
    }
    
    /* Breathing animation */
    .owl-body-group {
      animation: owl-breathe 3.2s ease-in-out infinite;
      transform-origin: center bottom;
    }
    
    @keyframes owl-breathe {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.02, 1.04) translateY(-3px); }
    }
    
    /* Head breathing lag */
    .owl-head-group {
      animation: owl-head-bob 3.2s ease-in-out infinite;
      transform-origin: center 110px;
    }
    
    @keyframes owl-head-bob {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-2px) rotate(0.8deg); }
    }

    /* Jumping animation */
    .owl-jump {
      animation: owl-hop 0.8s ease-in-out infinite;
    }
    
    @keyframes owl-hop {
      0%, 100% { transform: translateY(0) scaleY(1); }
      40% { transform: translateY(-40px) scaleY(1.04) scaleX(0.96); }
      50% { transform: translateY(-45px) scaleY(1) scaleX(1); }
      60% { transform: translateY(-35px) scaleY(0.98) scaleX(1.02); }
      90% { transform: translateY(0) scaleY(0.96) scaleX(1.04); }
    }

    /* Left wing flap / wave */
    .owl-wing-left {
      transform-origin: 65px 145px;
      animation: owl-wing-l-wiggle 5s ease-in-out infinite;
    }
    
    @keyframes owl-wing-l-wiggle {
      0%, 90%, 100% { transform: rotate(0deg); }
      95% { transform: rotate(-8deg); }
    }

    /* Right wing wave */
    .owl-wing-right-wave {
      animation: owl-wave-wing 0.6s ease-in-out infinite;
      transform-origin: 175px 145px;
    }
    
    @keyframes owl-wave-wing {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(35deg); }
    }

    /* Normal right wing */
    .owl-wing-right {
      transform-origin: 175px 145px;
      animation: owl-wing-r-wiggle 5.2s ease-in-out infinite;
    }
    
    @keyframes owl-wing-r-wiggle {
      0%, 90%, 100% { transform: rotate(0deg); }
      93% { transform: rotate(8deg); }
    }

    /* Blinking eyes */
    .owl-eye {
      animation: owl-blink 4.5s ease-in-out infinite;
      transform-origin: center;
    }
    
    @keyframes owl-blink {
      0%, 90%, 100% { transform: scaleY(1); }
      95% { transform: scaleY(0.05); }
    }

    /* Talking beak */
    .owl-beak-talk {
      animation: owl-talk 0.25s ease-in-out infinite alternate;
      transform-origin: 120px 145px;
    }
    
    @keyframes owl-talk {
      0% { transform: scaleY(0.6); }
      100% { transform: scaleY(1.3); }
    }
  `;

  return (
    <div
      className={`flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 240 240"
        width="100%"
        height="100%"
        className={isJumping ? 'owl-jump' : ''}
      >
        <style>{styles}</style>

        {/* Shadow */}
        {!isJumping && (
          <ellipse
            cx="120"
            cy="225"
            rx="52"
            ry="7.5"
            fill="#475569"
            opacity="0.3"
          />
        )}

        <g className="owl-container">
          <g className="owl-body-group">
            {/* Left Wing */}
            <g className="owl-wing-left">
              <path
                d="M 65 140 Q 30 150 45 190 Q 65 200 70 170 Z"
                fill="#475569"
                stroke="#334155"
                strokeWidth="2.5"
              />
              <path d="M 46 165 Q 38 175 48 185" fill="none" stroke="#64748B" strokeWidth="1.5" />
            </g>

            {/* Right Wing */}
            <g className={isWaving ? 'owl-wing-right-wave' : 'owl-wing-right'}>
              <path
                d="M 175 140 Q 210 150 195 190 Q 175 200 170 170 Z"
                fill="#475569"
                stroke="#334155"
                strokeWidth="2.5"
              />
              <path d="M 194 165 Q 202 175 192 185" fill="none" stroke="#64748B" strokeWidth="1.5" />
            </g>

            {/* Left Claw */}
            <ellipse cx="98" cy="220" rx="10" ry="6" fill="#F59E0B" />
            <circle cx="92" cy="223" r="3.5" fill="#D97706" />
            <circle cx="98" cy="224" r="3.5" fill="#D97706" />
            <circle cx="104" cy="223" r="3.5" fill="#D97706" />

            {/* Right Claw */}
            <ellipse cx="142" cy="220" rx="10" ry="6" fill="#F59E0B" />
            <circle cx="136" cy="223" r="3.5" fill="#D97706" />
            <circle cx="142" cy="224" r="3.5" fill="#D97706" />
            <circle cx="148" cy="223" r="3.5" fill="#D97706" />

            {/* Body */}
            <path
              d="M 80 140 Q 60 215 120 218 Q 180 215 160 140 Z"
              fill="#64748B"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Belly patch with spotted pattern */}
            <path
              d="M 94 155 Q 75 205 120 210 Q 165 205 146 155 Z"
              fill="#F8FAFC"
            />
            {/* Spotted feather details */}
            <path d="M 112 170 Q 120 176 128 170" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 104 185 Q 112 191 120 185" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 120 185 Q 128 191 136 185" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 112 200 Q 120 206 128 200" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Head group */}
            <g className="owl-head-group">
              {/* Left Ear Tuft */}
              <path
                d="M 75 100 Q 55 60 85 75 Z"
                fill="#475569"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Right Ear Tuft */}
              <path
                d="M 165 100 Q 185 60 155 75 Z"
                fill="#475569"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Head Base */}
              <ellipse
                cx="120"
                cy="115"
                rx="48"
                ry="40"
                fill="#64748B"
                stroke="#475569"
                strokeWidth="2.5"
              />

              {/* White Eye Patches */}
              <circle cx="95" cy="115" r="18" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
              <circle cx="145" cy="115" r="18" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />

              {/* Eyes */}
              <g>
                {isSad && (
                  <>
                    <path
                      d="M 87 118 Q 95 125 103 118"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 137 118 Q 145 125 153 118"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {isHappy && (
                  <>
                    <path
                      d="M 87 118 Q 95 110 103 118"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 137 118 Q 145 110 153 118"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {isExcited && (
                  <>
                    <circle cx="95" cy="115" r="8" fill="#F59E0B" />
                    <circle cx="95" cy="115" r="4" fill="#1E293B" />
                    <circle cx="93" cy="112" r="1.5" fill="#F8FAFC" />

                    <circle cx="145" cy="115" r="8" fill="#F59E0B" />
                    <circle cx="145" cy="115" r="4" fill="#1E293B" />
                    <circle cx="143" cy="112" r="1.5" fill="#F8FAFC" />
                  </>
                )}

                {isThinking && (
                  <>
                    <g className="owl-eye">
                      <circle cx="95" cy="112" r="7.5" fill="#1E293B" />
                      <circle cx="97" cy="109" r="2.5" fill="#F8FAFC" />
                    </g>
                    <g className="owl-eye">
                      <circle cx="145" cy="112" r="7.5" fill="#1E293B" />
                      <circle cx="147" cy="109" r="2.5" fill="#F8FAFC" />
                    </g>
                  </>
                )}

                {!isSad && !isHappy && !isExcited && !isThinking && (
                  <>
                    <g className="owl-eye">
                      <circle cx="95" cy="115" r="7.5" fill="#1E293B" />
                      <circle cx="93.2" cy="112.2" r="2.5" fill="#F8FAFC" />
                      <circle cx="97.2" cy="117.8" r="1" fill="#F8FAFC" />
                    </g>
                    <g className="owl-eye">
                      <circle cx="145" cy="115" r="7.5" fill="#1E293B" />
                      <circle cx="143.2" cy="112.2" r="2.5" fill="#F8FAFC" />
                      <circle cx="147.2" cy="117.8" r="1" fill="#F8FAFC" />
                    </g>
                  </>
                )}
              </g>

              {/* Rosy cheek accents */}
              <ellipse cx="76" cy="126" rx="6.5" ry="3.5" fill="#FFA3B1" opacity="0.5" />
              <ellipse cx="164" cy="126" rx="6.5" ry="3.5" fill="#FFA3B1" opacity="0.5" />

              {/* Beak */}
              <polygon
                points="115,124 125,124 120,135"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="1"
                className={isSpeaking ? 'owl-beak-talk' : ''}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Owl;
