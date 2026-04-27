'use client';

import { useState } from 'react';
import Link from 'next/link';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Generate all on-the-hour times 1:00 – 12:00 */
function allTimes(): { hour: number; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    return { hour: h, label: `${h}:00` };
  });
}

function generateRound() {
  const times = shuffle(allTimes());
  const correct = times[0];
  const wrong = times.slice(1, 4);
  return {
    correct,
    choices: shuffle([correct, ...wrong]),
  };
}

/** SVG analog clock face */
function ClockFace({ hour }: { hour: number }) {
  const cx = 100;
  const cy = 100;
  const r = 90;

  // Hour hand angle: each hour = 30°, 12 o'clock = -90° offset
  const hourAngle = (hour % 12) * 30 - 90;
  // Minute hand always at 12 (0 minutes)
  const minuteAngle = -90;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const hourX = cx + 55 * Math.cos(toRad(hourAngle));
  const hourY = cy + 55 * Math.sin(toRad(hourAngle));

  const minX = cx + 75 * Math.cos(toRad(minuteAngle));
  const minY = cy + 75 * Math.sin(toRad(minuteAngle));

  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#0070cc" strokeWidth="4" />
      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = toRad(i * 30 - 90);
        const x1 = cx + 78 * Math.cos(a);
        const y1 = cy + 78 * Math.sin(a);
        const x2 = cx + 88 * Math.cos(a);
        const y2 = cy + 88 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />;
      })}
      {/* Hour numbers */}
      {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
        const a = toRad(i * 30 - 90);
        const x = cx + 63 * Math.cos(a);
        const y = cy + 63 * Math.sin(a);
        return (
          <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fontSize="12" fontWeight="600" fill="#1f1f1f">
            {n}
          </text>
        );
      })}
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minX} y2={minY} stroke="#1f1f1f" strokeWidth="3" strokeLinecap="round" />
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourX} y2={hourY} stroke="#0070cc" strokeWidth="5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#0070cc" />
    </svg>
  );
}

export default function TellingTimePage() {
  const [round, setRound] = useState(generateRound);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const pick = (label: string) => {
    if (selected !== null) return;
    setSelected(label);
    setTotal(t => t + 1);
    if (label === round.correct.label) setScore(s => s + 1);
  };

  const next = () => {
    setRound(generateRound());
    setSelected(null);
  };

  const isCorrect = selected === round.correct.label;

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Telling Time</h1>
          <span className="text-white/60 text-sm font-medium">⭐ {score}/{total}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          <p className="text-[#6b6b6b] text-sm text-center mb-6">
            What time does the clock show?
          </p>

          {/* Clock face */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#f5f7fa] rounded-full p-4 shadow-sm">
              <ClockFace hour={round.correct.hour} />
            </div>
          </div>

          {/* Time choices */}
          <div className="grid grid-cols-2 gap-4">
            {round.choices.map(({ label }) => {
              const isThis = selected === label;
              const correct = label === round.correct.label;
              let cls =
                'py-5 rounded-[16px] text-[28px] font-light text-center border-2 transition-all duration-180 ';
              if (selected === null) {
                cls += 'bg-white border-[#e0e0e0] hover:border-[#0070cc] hover:bg-[#f5f7fa] hover:scale-105 cursor-pointer shadow-sm';
              } else if (correct) {
                cls += 'bg-[#f0fdf4] border-[#22c55e] text-[#16a34a]';
              } else if (isThis) {
                cls += 'bg-[#fef2f2] border-[#ef4444] text-[#dc2626]';
              } else {
                cls += 'bg-[#f5f5f5] border-[#e0e0e0] text-[#b0b0b0]';
              }
              return (
                <button key={label} onClick={() => pick(label)} className={cls}>
                  {label}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-6 text-center space-y-3">
              {isCorrect ? (
                <p className="text-[#16a34a] font-semibold text-lg">
                  🎉 Correct! The clock shows <strong>{round.correct.label}</strong>
                </p>
              ) : (
                <p className="text-[#dc2626] font-semibold">
                  The correct time was <strong>{round.correct.label}</strong>.
                </p>
              )}
              <button onClick={next} className="ps-btn">Next Clock →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
