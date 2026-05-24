"use client";

import { useCallback, useState } from "react";

interface IndiaMapProps {
  onStateClick: (stateId: string) => void;
  discoveredStates: Set<string>;
  glowingState: string | null;
  selectedState: string | null;
  zoomedState: string | null;
  showCapital: string | null;
  stage: number;
}

interface StatePath {
  id: string;
  d: string;
  capital?: string;
  capitalPos?: { x: number; y: number };
}

interface StateData {
  id: string;
  d: string;
  capital: string;
  capitalPos: { x: number; y: number };
  center: { x: number; y: number };
}

const STATES: StateData[] = [
  { id: "jammu-kashmir", d: "M 120,20 Q 150,15 180,25 Q 190,40 170,50 Q 150,45 120,50 Z", capital: "Srinagar", capitalPos: { x: 148, y: 30 }, center: { x: 150, y: 35 } },
  { id: "himachal-pradesh", d: "M 160,50 Q 175,48 185,55 Q 180,65 165,62 Z", capital: "Shimla", capitalPos: { x: 172, y: 55 }, center: { x: 172, y: 56 } },
  { id: "punjab", d: "M 140,55 Q 155,50 165,58 Q 160,68 145,65 Z", capital: "Chandigarh", capitalPos: { x: 155, y: 58 }, center: { x: 152, y: 60 } },
  { id: "uttarakhand", d: "M 180,55 Q 195,52 205,60 Q 195,70 185,68 Z", capital: "Dehradun", capitalPos: { x: 190, y: 60 }, center: { x: 192, y: 62 } },
  { id: "haryana", d: "M 155,65 Q 170,62 180,70 Q 170,78 158,75 Z", capital: "Chandigarh", capitalPos: { x: 165, y: 68 }, center: { x: 166, y: 70 } },
  { id: "delhi", d: "M 165,70 Q 175,68 178,75 Q 172,80 165,78 Z", capital: "New Delhi", capitalPos: { x: 170, y: 74 }, center: { x: 170, y: 74 } },

  { id: "rajasthan", d: "M 120,65 Q 145,60 160,68 Q 158,85 140,95 Q 125,90 118,78 Z", capital: "Jaipur", capitalPos: { x: 140, y: 78 }, center: { x: 138, y: 78 } },
  { id: "gujarat", d: "M 110,95 Q 130,90 145,100 Q 140,115 125,118 Q 110,110 108,102 Z", capital: "Gandhinagar", capitalPos: { x: 125, y: 105 }, center: { x: 126, y: 106 } },
  { id: "maharashtra", d: "M 130,115 Q 155,110 175,115 Q 180,130 165,145 Q 145,142 130,135 Z", capital: "Mumbai", capitalPos: { x: 140, y: 130 }, center: { x: 152, y: 128 } },
  { id: "goa", d: "M 165,140 Q 175,138 178,145 Q 172,150 165,148 Z", capital: "Panaji", capitalPos: { x: 170, y: 144 }, center: { x: 170, y: 144 } },

  { id: "madhya-pradesh", d: "M 155,100 Q 180,95 200,100 Q 205,115 190,125 Q 170,122 155,118 Z", capital: "Bhopal", capitalPos: { x: 175, y: 110 }, center: { x: 177, y: 110 } },
  { id: "uttar-pradesh", d: "M 180,65 Q 210,60 235,65 Q 240,80 225,90 Q 205,88 185,82 Z", capital: "Lucknow", capitalPos: { x: 210, y: 78 }, center: { x: 208, y: 77 } },
  { id: "chhattisgarh", d: "M 200,110 Q 220,105 230,115 Q 225,130 210,132 Q 200,125 198,118 Z", capital: "Raipur", capitalPos: { x: 215, y: 118 }, center: { x: 214, y: 118 } },

  { id: "bihar", d: "M 210,80 Q 230,75 240,82 Q 238,92 222,95 Q 212,92 210,85 Z", capital: "Patna", capitalPos: { x: 224, y: 86 }, center: { x: 224, y: 87 } },
  { id: "jharkhand", d: "M 215,92 Q 235,88 248,95 Q 245,108 230,110 Q 218,106 215,100 Z", capital: "Ranchi", capitalPos: { x: 228, y: 100 }, center: { x: 228, y: 100 } },
  { id: "west-bengal", d: "M 240,80 Q 255,75 265,85 Q 260,100 245,105 Q 238,98 240,88 Z", capital: "Kolkata", capitalPos: { x: 252, y: 92 }, center: { x: 250, y: 92 } },
  { id: "odisha", d: "M 220,110 Q 240,105 255,115 Q 250,130 235,135 Q 220,130 218,118 Z", capital: "Bhubaneswar", capitalPos: { x: 235, y: 122 }, center: { x: 236, y: 122 } },
  { id: "sikkim", d: "M 252,72 Q 262,70 265,76 Q 258,80 252,78 Z", capital: "Gangtok", capitalPos: { x: 258, y: 75 }, center: { x: 258, y: 75 } },
  { id: "assam", d: "M 255,72 Q 275,65 290,72 Q 288,82 272,85 Q 260,82 255,78 Z", capital: "Dispur", capitalPos: { x: 272, y: 78 }, center: { x: 272, y: 78 } },
  { id: "arunachal-pradesh", d: "M 290,65 Q 310,60 320,70 Q 315,80 300,78 Z", capital: "Itanagar", capitalPos: { x: 305, y: 72 }, center: { x: 305, y: 72 } },
  { id: "nagaland", d: "M 285,78 Q 295,75 300,82 Q 295,88 285,85 Z", capital: "Kohima", capitalPos: { x: 292, y: 82 }, center: { x: 292, y: 82 } },
  { id: "manipur", d: "M 290,82 Q 300,80 305,88 Q 298,94 288,90 Z", capital: "Imphal", capitalPos: { x: 296, y: 86 }, center: { x: 296, y: 86 } },
  { id: "mizoram", d: "M 280,88 Q 292,85 295,94 Q 285,100 278,95 Z", capital: "Aizawl", capitalPos: { x: 286, y: 92 }, center: { x: 286, y: 92 } },
  { id: "tripura", d: "M 272,82 Q 282,80 285,88 Q 278,92 272,88 Z", capital: "Agartala", capitalPos: { x: 278, y: 86 }, center: { x: 278, y: 86 } },
  { id: "meghalaya", d: "M 268,75 Q 280,72 283,78 Q 275,82 268,80 Z", capital: "Shillong", capitalPos: { x: 274, y: 77 }, center: { x: 274, y: 77 } },

  { id: "telangana", d: "M 165,145 Q 185,140 200,148 Q 195,160 178,162 Q 168,158 165,150 Z", capital: "Hyderabad", capitalPos: { x: 182, y: 152 }, center: { x: 182, y: 152 } },
  { id: "andhra-pradesh", d: "M 185,148 Q 210,142 225,152 Q 220,168 200,172 Q 185,168 182,158 Z", capital: "Amaravati", capitalPos: { x: 205, y: 158 }, center: { x: 205, y: 158 } },
  { id: "karnataka", d: "M 140,145 Q 165,142 175,152 Q 170,170 152,178 Q 138,172 135,160 Z", capital: "Bengaluru", capitalPos: { x: 156, y: 160 }, center: { x: 155, y: 160 } },
  { id: "kerala", d: "M 135,175 Q 148,172 155,182 Q 148,195 138,196 Q 132,188 133,180 Z", capital: "Thiruvananthapuram", capitalPos: { x: 144, y: 186 }, center: { x: 144, y: 186 } },
  { id: "tamil-nadu", d: "M 160,172 Q 185,168 200,178 Q 195,195 175,200 Q 158,195 155,185 Z", capital: "Chennai", capitalPos: { x: 178, y: 184 }, center: { x: 178, y: 184 } },

  { id: "chandigarh", d: "M 162,58 Q 168,56 170,60 Q 166,64 162,62 Z", capital: "Chandigarh", capitalPos: { x: 166, y: 60 }, center: { x: 166, y: 60 } },
  { id: "ladakh", d: "M 145,18 Q 165,14 180,22 Q 175,35 158,32 Q 148,28 145,22 Z", capital: "Leh", capitalPos: { x: 160, y: 26 }, center: { x: 160, y: 26 } },
  { id: "lakshadweep", d: "M 125,192 Q 132,190 134,196 Q 128,200 125,196 Z", capital: "Kavaratti", capitalPos: { x: 130, y: 194 }, center: { x: 130, y: 194 } },
  { id: "andaman-nicobar", d: "M 228,178 Q 235,175 238,185 Q 232,195 226,190 Z", capital: "Port Blair", capitalPos: { x: 232, y: 184 }, center: { x: 232, y: 184 } },
  { id: "puducherry", d: "M 188,185 Q 192,183 194,187 Q 190,190 188,188 Z", capital: "Puducherry", capitalPos: { x: 190, y: 186 }, center: { x: 190, y: 186 } },
  { id: "dadra-nagar-haveli-daman-diu", d: "M 130,108 Q 138,106 140,112 Q 134,116 130,112 Z", capital: "Daman", capitalPos: { x: 134, y: 110 }, center: { x: 134, y: 110 } },
];

const UNION_TERRITORIES = new Set([
  "delhi",
  "chandigarh",
  "ladakh",
  "lakshadweep",
  "andaman-nicobar",
  "puducherry",
  "dadra-nagar-haveli-daman-diu",
]);

const SMALL_STATES = new Set(["goa", "sikkim", "delhi", "chandigarh", "puducherry", "lakshadweep"]);

export default function IndiaMap({
  onStateClick,
  discoveredStates,
  glowingState,
  selectedState,
  zoomedState,
  showCapital,
  stage,
}: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getFill = useCallback(
    (stateId: string): string => {
      if (selectedState === stateId || zoomedState === stateId) return "#66BB6A";
      if (glowingState === stateId) return "#4CAF50";
      if (discoveredStates.has(stateId)) return "#4CAF50";
      return "#2d5a27";
    },
    [selectedState, zoomedState, glowingState, discoveredStates]
  );

  const getTransform = useCallback(() => {
    if (zoomedState) {
      const state = STATES.find(s => s.id === zoomedState);
      if (state) {
        const scale = 2.8;
        const tx = 200 - state.center.x * scale;
        const ty = 110 - state.center.y * scale;
        return `translate(${tx}, ${ty}) scale(${scale})`;
      }
    }
    return "translate(0, 0) scale(1)";
  }, [zoomedState]);

  const selectedStateData = selectedState ? STATES.find(s => s.id === selectedState) : null;
  const zoomedStateData = zoomedState ? STATES.find(s => s.id === zoomedState) : null;

  return (
    <div className="relative overflow-hidden rounded-[20px]" style={{ minHeight: "300px" }}>
      <svg
        viewBox="0 0 400 220"
        className="w-full h-auto max-w-2xl mx-auto touch-none select-none transition-all duration-700 ease-in-out"
        style={{ minHeight: "280px", transform: "translateZ(0)" }}
        role="img"
        aria-label="Map of India with clickable states"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>
          {`
            @keyframes glowPulse {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.4) drop-shadow(0 0 6px rgba(76,175,80,0.6)); }
            }
            @keyframes utGlowPulse {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.3) drop-shadow(0 0 8px rgba(255,215,0,0.5)); }
            }
            @keyframes selectedBounce {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes pathDash {
              to { stroke-dashoffset: 0; }
            }
            @keyframes balloonFloat {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-4px) rotate(3deg); }
              75% { transform: translateY(-2px) rotate(-3deg); }
            }
            @keyframes pinDrop {
              0% { transform: translateY(-20px); opacity: 0; }
              60% { transform: translateY(2px); opacity: 1; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .state-path {
              cursor: pointer;
              transition: filter 0.2s ease, transform 0.2s ease;
              vector-effect: non-scaling-stroke;
            }
            .state-path:hover {
              filter: brightness(1.2) drop-shadow(0 0 4px rgba(255,255,255,0.3));
            }
            .state-path:active { transform: scale(0.97); }
            .state-path.union-territory {
              stroke: #FFD700;
              stroke-width: 1.5;
              filter: drop-shadow(0 0 3px rgba(255,215,0,0.4));
            }
            .state-path.union-territory:hover {
              filter: brightness(1.2) drop-shadow(0 0 6px rgba(255,215,0,0.6));
            }
            .state-path.glowing { animation: glowPulse 1.5s ease-in-out infinite; }
            .state-path.glowing-ut { animation: utGlowPulse 1.5s ease-in-out infinite; }
            .state-path.selected {
              filter: brightness(1.3) drop-shadow(0 0 8px rgba(102,187,106,0.7));
              stroke: #fff; stroke-width: 1.5;
            }
            .state-path.zoomed {
              animation: selectedBounce 1s ease-in-out infinite;
              filter: brightness(1.3) drop-shadow(0 0 8px rgba(102,187,106,0.7));
              stroke: #fff; stroke-width: 1.5;
            }
            .touch-padding {
              cursor: pointer;
              fill: transparent; stroke: transparent;
              stroke-width: 40;
              pointer-events: stroke;
            }
            .capital-dot {
              fill: #FFD700;
              stroke: #fff;
              stroke-width: 1;
              animation: glowPulse 2s ease-in-out infinite;
            }
            .capital-label {
              font-family: sans-serif;
              font-size: 5px;
              fill: #fff;
              text-anchor: middle;
              font-weight: bold;
              paint-order: stroke;
              stroke: rgba(0,0,0,0.6);
              stroke-width: 1.5;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .travel-path {
              fill: none;
              stroke: #FFD700;
              stroke-width: 1.5;
              stroke-dasharray: 4, 4;
              animation: pathDash 1.5s linear infinite;
              stroke-dashoffset: -8;
            }
            .balloon {
              animation: balloonFloat 2s ease-in-out infinite;
            }
            .pin-drop {
              animation: pinDrop 0.5s ease-out forwards;
            }
          `}
        </style>

        <g transform={getTransform()} style={{ transformOrigin: "200px 110px", transition: "transform 0.7s ease-in-out" }}>
          {/* Ocean background */}
          <rect x="100" y="10" width="230" height="195" fill="#1a3a5c" rx="8" opacity="0.3" />

          {STATES.map((state) => {
            const isUT = UNION_TERRITORIES.has(state.id);
            const isGlowing = glowingState === state.id;
            const isSelected = selectedState === state.id;
            const isZoomed = zoomedState === state.id;
            const isHovered = hoveredState === state.id;

            let className = "state-path";
            if (isUT) className += " union-territory";
            if (isGlowing && isUT) className += " glowing-ut";
            else if (isGlowing) className += " glowing";
            if (isSelected) className += " selected";
            if (isZoomed) className += " zoomed";

            return (
              <g key={state.id}>
                <path
                  d={state.d}
                  className="touch-padding"
                  onPointerEnter={() => setHoveredState(state.id)}
                  onPointerLeave={() => setHoveredState(null)}
                  onPointerDown={() => onStateClick(state.id)}
                />
                <path
                  id={state.id}
                  d={state.d}
                  fill={getFill(state.id)}
                  stroke={isUT ? "#FFD700" : isHovered ? "#81C784" : "#1a3d16"}
                  strokeWidth={isUT ? 1.5 : 0.8}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={className}
                  onPointerEnter={() => setHoveredState(state.id)}
                  onPointerLeave={() => setHoveredState(null)}
                  onPointerDown={() => onStateClick(state.id)}
                >
                  <title>{state.id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</title>
                </path>
              </g>
            );
          })}

          {/* State name labels */}
          {STATES.filter(s => stage >= 2 || discoveredStates.has(s.id)).map((state) => (
            <text
              key={`label-${state.id}`}
              x={state.center.x}
              y={state.center.y + 1.5}
              textAnchor="middle"
              className="capital-label"
              style={{ fontSize: "3.5px", fill: "#e0e0e0" }}
            >
              {state.id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </text>
          ))}

          {/* Capital pins */}
          {showCapital && selectedStateData && (
            <g className="pin-drop">
              <circle cx={selectedStateData.capitalPos.x} cy={selectedStateData.capitalPos.y} r={3} className="capital-dot" />
              <text
                x={selectedStateData.capitalPos.x}
                y={selectedStateData.capitalPos.y - 6}
                textAnchor="middle"
                className="capital-label"
              >
                {selectedStateData.capital}
              </text>

              {/* Curved travel path from state center to capital */}
              <path
                d={`M ${selectedStateData.center.x},${selectedStateData.center.y} Q ${(selectedStateData.center.x + selectedStateData.capitalPos.x) / 2},${Math.min(selectedStateData.center.y, selectedStateData.capitalPos.y) - 8} ${selectedStateData.capitalPos.x},${selectedStateData.capitalPos.y}`}
                className="travel-path"
              />

              {/* Balloons */}
              <g className="balloon" style={{ animationDelay: "0.2s" }}>
                <circle cx={selectedStateData.capitalPos.x + 10} cy={selectedStateData.capitalPos.y - 8} r={3} fill="#FF6B6B" />
                <line x1={selectedStateData.capitalPos.x + 10} y1={selectedStateData.capitalPos.y - 5} x2={selectedStateData.capitalPos.x + 10} y2={selectedStateData.capitalPos.y - 2} stroke="#666" strokeWidth={0.3} />
              </g>
              <g className="balloon" style={{ animationDelay: "0.5s" }}>
                <circle cx={selectedStateData.capitalPos.x - 8} cy={selectedStateData.capitalPos.y - 10} r={2.5} fill="#4ECDC4" />
                <line x1={selectedStateData.capitalPos.x - 8} y1={selectedStateData.capitalPos.y - 7.5} x2={selectedStateData.capitalPos.x - 8} y2={selectedStateData.capitalPos.y - 5} stroke="#666" strokeWidth={0.3} />
              </g>
              <g className="balloon" style={{ animationDelay: "0.8s" }}>
                <circle cx={selectedStateData.capitalPos.x + 14} cy={selectedStateData.capitalPos.y - 12} r={2} fill="#FFE66D" />
                <line x1={selectedStateData.capitalPos.x + 14} y1={selectedStateData.capitalPos.y - 10} x2={selectedStateData.capitalPos.x + 14} y2={selectedStateData.capitalPos.y - 7.5} stroke="#666" strokeWidth={0.3} />
              </g>
            </g>
          )}

          {/* Stars on discovery */}
          {glowingState && zoomedState && (
            Array.from({ length: 5 }).map((_, i) => (
              <text
                key={`star-${i}`}
                x={(STATES.find(s => s.id === glowingState)?.center.x || 200) + (i - 2) * 8}
                y={(STATES.find(s => s.id === glowingState)?.center.y || 110) - 12}
                style={{ fontSize: "6px", animation: `glowPulse ${1 + i * 0.3}s ease-in-out infinite` }}
                textAnchor="middle"
              >
                ⭐
              </text>
            ))
          )}
        </g>
      </svg>
    </div>
  );
}