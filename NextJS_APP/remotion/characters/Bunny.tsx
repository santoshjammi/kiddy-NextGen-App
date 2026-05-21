import React from 'react';

export interface BunnyProps {
  expression: 'happy' | 'excited' | 'thinking' | 'sad' | 'wave' | 'jump' | 'idle';
  isSpeaking?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Bunny: React.FC<BunnyProps> = ({
  expression,
  isSpeaking = false,
  width = 240,
  height = 240,
  className = '',
}) => {
  // Determine CSS classes for animations based on the current state/expression
  const isJumping = expression === 'jump';
  const isWaving = expression === 'wave';
  const isExcited = expression === 'excited';
  const isSad = expression === 'sad';
  const isThinking = expression === 'thinking';
  const isHappy = expression === 'happy';

  // Build the inline SVG styles for rich keyframe animations
  const styles = `
    .bunny-container {
      transform-box: fill-box;
      transform-origin: center bottom;
    }
    
    /* Breathing animation */
    .bunny-body-group {
      animation: bunny-breathe 3s ease-in-out infinite;
      transform-origin: center bottom;
    }
    
    @keyframes bunny-breathe {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.01, 1.03) translateY(-2px); }
    }

    /* Head sub-breathing to lag slightly */
    .bunny-head-group {
      animation: bunny-head-bob 3s ease-in-out infinite;
      transform-origin: center 120px;
    }
    
    @keyframes bunny-head-bob {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-1.5px) rotate(0.5deg); }
    }

    /* Jumping animation */
    .bunny-jump {
      animation: bunny-hop 0.8s ease-in-out infinite;
    }
    
    @keyframes bunny-hop {
      0%, 100% { transform: translateY(0) scaleY(1); }
      40% { transform: translateY(-45px) scaleY(1.05) scaleX(0.95); }
      50% { transform: translateY(-50px) scaleY(1) scaleX(1); }
      60% { transform: translateY(-40px) scaleY(0.98) scaleX(1.02); }
      90% { transform: translateY(0) scaleY(0.95) scaleX(1.05); }
    }

    /* Ear Wiggling */
    .bunny-ear-left {
      transform-origin: 100px 105px;
      animation: bunny-ear-wig-l 4s ease-in-out infinite;
    }
    .bunny-ear-right {
      transform-origin: 140px 105px;
      animation: bunny-ear-wig-r 4.2s ease-in-out infinite;
    }
    
    @keyframes bunny-ear-wig-l {
      0%, 90%, 100% { transform: rotate(0deg); }
      95% { transform: rotate(-7deg); }
    }
    
    @keyframes bunny-ear-wig-r {
      0%, 90%, 100% { transform: rotate(0deg); }
      93% { transform: rotate(8deg); }
    }

    /* Sad drooping ears */
    .bunny-ear-left-sad {
      transform-origin: 100px 105px;
      transform: rotate(-25deg) translateY(5px);
      transition: transform 0.5s ease;
    }
    
    .bunny-ear-right-sad {
      transform-origin: 140px 105px;
      transform: rotate(25deg) translateY(5px);
      transition: transform 0.5s ease;
    }

    /* Waving animation */
    .bunny-arm-right-wave {
      animation: bunny-wave-arm 0.6s ease-in-out infinite;
      transform-origin: 165px 165px;
    }
    
    @keyframes bunny-wave-arm {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(45deg); }
    }

    /* Blinking eyes */
    .bunny-eye {
      animation: bunny-blink 4s ease-in-out infinite;
      transform-origin: center;
    }
    
    @keyframes bunny-blink {
      0%, 90%, 100% { transform: scaleY(1); }
      95% { transform: scaleY(0.05); }
    }

    /* Talking mouth */
    .bunny-mouth-talk {
      animation: bunny-talk 0.25s ease-in-out infinite alternate;
      transform-origin: 120px 142px;
    }
    
    @keyframes bunny-talk {
      0% { transform: scaleY(0.4); }
      100% { transform: scaleY(1.4); }
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
        className={isJumping ? 'bunny-jump' : ''}
      >
        <style>{styles}</style>

        {/* Shadow under Bunny */}
        {!isJumping && (
          <ellipse
            cx="120"
            cy="225"
            rx="55"
            ry="8"
            fill="#CBD5E1"
            opacity="0.5"
          />
        )}

        <g className="bunny-container">
          <g className="bunny-body-group">
            {/* Left Arm (Normal position) */}
            <path
              d="M 68 170 Q 55 180 65 195 Q 75 200 80 185 Z"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2.5"
            />

            {/* Right Arm (Waving or Normal) */}
            <g className={isWaving ? 'bunny-arm-right-wave' : ''}>
              <path
                d="M 172 170 Q 185 180 175 195 Q 165 200 160 185 Z"
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth="2.5"
              />
            </g>

            {/* Left Foot */}
            <ellipse
              cx="95"
              cy="218"
              rx="18"
              ry="10"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2.5"
            />
            <ellipse cx="95" cy="214" rx="10" ry="5" fill="#FFE4E6" />

            {/* Right Foot */}
            <ellipse
              cx="145"
              cy="218"
              rx="18"
              ry="10"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2.5"
            />
            <ellipse cx="145" cy="214" rx="10" ry="5" fill="#FFE4E6" />

            {/* Body */}
            <path
              d="M 85 160 Q 65 205 90 215 Q 120 220 150 215 Q 175 205 155 160 Z"
              fill="#F1F5F9"
              stroke="#E2E8F0"
              strokeWidth="2.5"
            />
            {/* Belly Patch */}
            <path
              d="M 98 175 Q 85 205 120 208 Q 155 205 142 175 Q 120 168 98 175 Z"
              fill="#FFF1F2"
            />

            {/* Fluffy tail (showing slightly behind left) */}
            <circle
              cx="72"
              cy="200"
              r="14"
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2"
            />

            {/* Head & Ears Group */}
            <g className="bunny-head-group">
              {/* Ears */}
              <g className={isSad ? 'bunny-ear-left-sad' : 'bunny-ear-left'}>
                {/* Left Outer Ear */}
                <path
                  d="M 90 110 Q 70 20 98 20 Q 110 50 106 110 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="2.5"
                />
                {/* Left Inner Ear */}
                <path
                  d="M 92 100 Q 80 32 96 32 Q 104 55 101 100 Z"
                  fill="#FECDD3"
                />
              </g>

              <g className={isSad ? 'bunny-ear-right-sad' : 'bunny-ear-right'}>
                {/* Right Outer Ear */}
                <path
                  d="M 134 110 Q 130 50 142 20 Q 170 20 150 110 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="2.5"
                />
                {/* Right Inner Ear */}
                <path
                  d="M 139 100 Q 136 55 144 32 Q 160 32 148 100 Z"
                  fill="#FECDD3"
                />
              </g>

              {/* Head Base */}
              <ellipse
                cx="120"
                cy="140"
                rx="48"
                ry="38"
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth="2.5"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="84" cy="150" rx="9" ry="5.5" fill="#FFA3B1" opacity="0.65" />
              <ellipse cx="156" cy="150" rx="9" ry="5.5" fill="#FFA3B1" opacity="0.65" />

              {/* EYES */}
              <g>
                {isSad && (
                  <>
                    {/* Sad downcast curved eyes */}
                    <path
                      d="M 90 140 Q 98 148 106 140"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 134 140 Q 142 148 150 140"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Tiny teardrop */}
                    <path
                      d="M 85 148 Q 83 158 87 158 Q 91 158 89 148 Z"
                      fill="#38BDF8"
                    />
                  </>
                )}

                {isHappy && (
                  <>
                    {/* Happy laughing closed eyes (curved arches) */}
                    <path
                      d="M 90 142 Q 98 132 106 142"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 134 142 Q 142 132 150 142"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {isExcited && (
                  <>
                    {/* Excited Sparkle Star Eyes! */}
                    {/* Star Left */}
                    <path
                      d="M 98 128 L 101 135 L 108 135 L 103 140 L 105 147 L 98 143 L 91 147 L 93 140 L 88 135 L 95 135 Z"
                      fill="#FBBF24"
                    />
                    {/* Star Right */}
                    <path
                      d="M 142 128 L 145 135 L 152 135 L 147 140 L 149 147 L 142 143 L 135 147 L 137 140 L 132 135 L 139 135 Z"
                      fill="#FBBF24"
                    />
                  </>
                )}

                {isThinking && (
                  <>
                    {/* Thinking eyes looking upwards */}
                    <g className="bunny-eye">
                      <circle cx="98" cy="138" r="7.5" fill="#334155" />
                      <circle cx="101" cy="134" r="2.8" fill="#FFFFFF" />
                      <circle cx="96" cy="140" r="1.2" fill="#FFFFFF" />
                    </g>
                    <g className="bunny-eye">
                      <circle cx="142" cy="138" r="7.5" fill="#334155" />
                      <circle cx="145" cy="134" r="2.8" fill="#FFFFFF" />
                      <circle cx="140" cy="140" r="1.2" fill="#FFFFFF" />
                    </g>
                    {/* Thinking eyebrow */}
                    <path
                      d="M 90 126 Q 98 123 104 128"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 136 128 Q 142 123 150 126"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Normal/Idle/Waving/Jumping Default Big Shiny Eyes */}
                {!isSad && !isHappy && !isExcited && !isThinking && (
                  <>
                    <g className="bunny-eye">
                      <circle cx="98" cy="140" r="7.5" fill="#334155" />
                      <circle cx="95.5" cy="136.5" r="2.8" fill="#FFFFFF" />
                      <circle cx="100.5" cy="142.5" r="1.2" fill="#FFFFFF" />
                    </g>
                    <g className="bunny-eye">
                      <circle cx="142" cy="140" r="7.5" fill="#334155" />
                      <circle cx="139.5" cy="136.5" r="2.8" fill="#FFFFFF" />
                      <circle cx="144.5" cy="142.5" r="1.2" fill="#FFFFFF" />
                    </g>
                  </>
                )}
              </g>

              {/* Nose */}
              <polygon
                points="116,146 124,146 120,150"
                fill="#FF647C"
                stroke="#FF647C"
                strokeWidth="1"
                strokeLinejoin="round"
              />

              {/* MOUTH */}
              <g>
                {isSpeaking ? (
                  /* Animated speaking mouth shape */
                  <ellipse
                    cx="120"
                    cy="157"
                    rx="6.5"
                    ry="6"
                    fill="#991B1B"
                    className="bunny-mouth-talk"
                  />
                ) : isSad ? (
                  /* Sad frowning mouth */
                  <path
                    d="M 114 159 Q 120 153 126 159"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                ) : isExcited ? (
                  /* Excited wide open smile mouth with pink tongue */
                  <g>
                    <path
                      d="M 112 153 Q 120 167 128 153 Z"
                      fill="#991B1B"
                    />
                    <path
                      d="M 116 160 Q 120 157 124 160 Q 120 164 116 160 Z"
                      fill="#FDA4AF"
                    />
                  </g>
                ) : isHappy ? (
                  /* Big simple smile */
                  <path
                    d="M 112 153 Q 120 162 128 153"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ) : (
                  /* Neutral little w-shaped kitty mouth */
                  <path
                    d="M 114 153 Q 117 156 120 153 Q 123 156 126 153"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Bunny;
