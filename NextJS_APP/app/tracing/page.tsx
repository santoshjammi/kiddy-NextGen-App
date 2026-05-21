'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function TracingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [letter, setLetter] = useState('A');
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  // Draw the guide letter on the canvas background
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 220px serif';
    ctx.fillStyle = 'rgba(0,112,204,0.10)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
  }, [letter]);

  useEffect(() => {
    drawGuide();
    setHasDrawn(false);
    setCelebrated(false);
  }, [letter, drawGuide]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasRef.current!.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current!.height / rect.height),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.strokeStyle = '#0070cc';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
    setHasDrawn(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    setDrawing(false);
    if (hasDrawn) setCelebrated(true);
  };

  const clearCanvas = () => {
    drawGuide();
    setHasDrawn(false);
    setCelebrated(false);
  };

  const nextLetter = () => {
    const idx = LETTERS.indexOf(letter);
    setLetter(LETTERS[(idx + 1) % LETTERS.length]);
  };

  const prevLetter = () => {
    const idx = LETTERS.indexOf(letter);
    setLetter(LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Tracing &amp; Handwriting</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Letter picker */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevLetter} className="ps-btn ps-btn-sm ps-btn-ghost">← Prev</button>
            <div className="text-center">
              <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">Tracing letter</p>
              <span className="text-[48px] font-light text-[#0070cc]">{letter}</span>
            </div>
            <button onClick={nextLetter} className="ps-btn ps-btn-sm ps-btn-ghost">Next →</button>
          </div>

          {/* Letter row */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {LETTERS.map(l => (
              <button
                key={l}
                onClick={() => setLetter(l)}
                className={[
                  'w-8 h-8 rounded-[6px] text-xs font-semibold transition-all',
                  l === letter
                    ? 'bg-[#0070cc] text-white'
                    : 'bg-[#f5f7fa] text-[#1f1f1f] hover:bg-[#e8f0fb] hover:text-[#0070cc]',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="relative rounded-[16px] overflow-hidden border-2 border-[#e0e0e0] mb-4 bg-[#fafafa]"
               style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              width={480}
              height={300}
              className="w-full cursor-crosshair"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[#b0b0b0] text-sm bg-white/80 px-3 py-1.5 rounded-full">
                  ✏️ Draw over the letter guide
                </p>
              </div>
            )}
          </div>

          {celebrated && (
            <div className="text-center mb-4">
              <p className="text-[#16a34a] font-semibold text-lg">
                🎉 Great job tracing <strong>{letter}</strong>!
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button onClick={clearCanvas} className="ps-btn ps-btn-sm ps-btn-ghost">
              🗑 Clear
            </button>
            <button onClick={nextLetter} className="ps-btn ps-btn-sm">
              Next Letter →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
