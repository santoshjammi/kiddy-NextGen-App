'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F',
  '#00FF00', '#00CED1', '#1E90FF', '#0000FF', '#8A2BE2',
  '#FF00FF', '#FF1493', '#000000', '#555555', '#A9A9A9',
  '#FFFFFF',
];

const BRUSH_SIZES = [4, 8, 16, 32];

type Tool = 'brush' | 'eraser' | 'fill';

export default function PaintPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(8);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    if (!hasDrawn) setHasDrawn(true);
  }, [getPos, hasDrawn]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }, [isDrawing, getPos, tool, color, brushSize]);

  const endDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const fillCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!hasDrawn) setHasDrawn(true);
  }, [color, hasDrawn]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  const TOOLS: Array<{ id: Tool; icon: string; label: string }> = [
    { id: 'brush', icon: '🖌️', label: 'Brush' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
    { id: 'fill', icon: '🪣', label: 'Fill' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">🎨 Kiddy Paint</h1>
          <button onClick={clearCanvas} className="ps-btn ps-btn-sm ps-btn-ghost-dark">
            🗑️ Clear
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Toolbar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-3 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Tools — giant buttons, icon-only */}
            <div className="flex gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center transition-all duration-200 ${
                    tool === t.id
                      ? 'bg-[#0070cc] scale-110 shadow-lg'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title={t.label}
                >
                  {t.icon}
                </button>
              ))}
            </div>

            {/* Colors — scrollable strip */}
            <div className="flex gap-1.5 overflow-x-auto max-w-[200px] md:max-w-xs py-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full flex-shrink-0 border-2 transition-all duration-200 ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {/* Brush sizes */}
            <div className="flex gap-2 items-center">
              {BRUSH_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    brushSize === s ? 'bg-[#0070cc] scale-110' : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title={`${s}px`}
                >
                  <div
                    className="bg-white rounded-full"
                    style={{ width: Math.min(s / 2, 14), height: Math.min(s / 2, 14) }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-[60vh] md:h-[70vh] cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        <p className="text-white/40 text-xs text-center mt-4">
          Draw anything you like! Use brush, eraser, fill bucket, or clear to start fresh.
        </p>
      </main>
    </div>
  );
}