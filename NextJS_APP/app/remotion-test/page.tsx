'use client';

import React, { useState, useEffect } from 'react';
import GameWrapper from '../../remotion/GameWrapper';
import eventBus from '../../remotion/eventBus';
import { audioEngine } from '../../remotion/audio/audioEngine';
import Bunny from '../../remotion/characters/Bunny';

export default function RemotionTestSandbox() {
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [testWorld, setTestWorld] = useState<'ocean' | 'farm' | 'jungle' | 'space'>('ocean');
  const [spamCount, setSpamCount] = useState(0);

  const logTelemetry = (msg: string) => {
    setTelemetry((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 15),
    ]);
  };

  const handleCorrect = () => {
    logTelemetry('Emitted: CORRECT_ANSWER');
    eventBus.emit('CORRECT_ANSWER', { payload: { points: 10 } });
  };

  const handleWrong = () => {
    logTelemetry('Emitted: WRONG_ANSWER');
    eventBus.emit('WRONG_ANSWER');
  };

  const handleLevelComplete = () => {
    logTelemetry('Emitted: LEVEL_COMPLETE');
    eventBus.emit('LEVEL_COMPLETE');
  };

  const handleBadgeUnlock = () => {
    logTelemetry('Emitted: BADGE_UNLOCK');
    eventBus.emit('BADGE_UNLOCK');
  };

  const handleQuestionStart = () => {
    logTelemetry('Emitted: QUESTION_START');
    eventBus.emit('QUESTION_START');
  };

  const handleCorrectSpam = () => {
    logTelemetry('Stress Test: Emitting CORRECT_ANSWER 3x rapidly...');
    eventBus.emit('CORRECT_ANSWER', { payload: { points: 10 } });
    eventBus.emit('CORRECT_ANSWER', { payload: { points: 10 } });
    eventBus.emit('CORRECT_ANSWER', { payload: { points: 10 } });
  };

  const handleAudioSpam = () => {
    logTelemetry('Stress Test: Spam-tapping Bunny speech...');
    setSpamCount((c) => c + 1);
    audioEngine.playSFX('click');
    audioEngine.playVoiceLine('great_job');
  };

  // Bind key events or inspect listeners
  useEffect(() => {
    logTelemetry('KAE Infrastructure Sandbox initialized.');
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* ── Left/Right Layout: Wrapper on left, sandbox controls on right ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* GameWrapper Container Live View */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-700">
          <GameWrapper
            gameId="test-fishing-game"
            subject="english"
            world={testWorld}
            title="KAE Testing Sandbox"
            subtitle="Verify stress events, mobile scaling, and procedural voice loops"
          >
            <div className="bg-white/95 rounded-3xl p-8 text-slate-800 shadow-2xl flex flex-col items-center gap-6 border border-white/20">
              <div className="text-4xl animate-bounce">🎣</div>
              <h3 className="text-2xl font-bold text-center">Interactive Fishing Hook</h3>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                This is the actual Game Screen running inside the GameWrapper. Use the sandbox controls on the right to simulate events!
              </p>
              
              <div className="flex gap-4">
                <button
                  id="btn-sandbox-correct"
                  onClick={handleCorrect}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-500/20"
                >
                  Correct Answer 🎉
                </button>
                <button
                  id="btn-sandbox-wrong"
                  onClick={handleWrong}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Wrong Answer ❌
                </button>
              </div>

              <button
                onClick={handleQuestionStart}
                className="mt-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Reset Mascot to Thinking/Idle
              </button>
            </div>
          </GameWrapper>
        </div>

        {/* Developer Sandbox Controls Pane */}
        <div className="w-full lg:w-[420px] bg-slate-850 p-6 flex flex-col gap-6 overflow-y-auto" style={{ backgroundColor: '#1e293b' }}>
          
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛠️</span> KAE Exit Gate Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Verify stress events, procedural audio queuing, and responsive scaling under Exit Gate conditions.
            </p>
          </div>

          <hr className="border-slate-700" />

          {/* Theme selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select World Environment</label>
            <div className="grid grid-cols-2 gap-2">
              {(['ocean', 'farm', 'jungle', 'space'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setTestWorld(w);
                    logTelemetry(`Changed environment: ${w}`);
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    testWorld === w
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Exit Gate Event Stress Triggers */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exit Gate Stress Tests</h3>
            
            <div className="flex flex-col gap-2">
              <button
                id="btn-stress-eventbus"
                onClick={handleCorrectSpam}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-650 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
              >
                Test A: Emit CORRECT_ANSWER 3x Rapidly
              </button>
              <p className="text-[10px] text-slate-400 leading-normal px-1">
                Ensures only one overlay remains active, overlays do not stack duplicate DOM nodes, and the timing queue handles resets properly.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                id="btn-stress-audio"
                onClick={handleAudioSpam}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-650 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
              >
                Test C: Rapidly Spam-Tap Bunny ({spamCount} Taps)
              </button>
              <p className="text-[10px] text-slate-400 leading-normal px-1">
                Verifies SpeechSynthesis voice line queue gets interrupted cleanly and prevents stacking overlapping sound lines.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleLevelComplete}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  Unlock Level 🏆
                </button>
                <button
                  onClick={handleBadgeUnlock}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  Earn Badge 🏅
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal px-1">
                Simulates Sprites overlays transition loops (`Test D`).
              </p>
            </div>
          </div>

          <hr className="border-slate-700" />

          {/* Bunny Character Live expression inspect (Test B) */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mascot Lifecycle Inspector (Test B)</h3>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center p-1 border border-slate-700">
                <Bunny expression="thinking" width="100%" height="100%" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Bunny Loop Health</h4>
                <p className="text-[10px] text-green-400 font-mono mt-0.5">● SVG CSS loops active</p>
                <p className="text-[9px] text-slate-400 mt-1 leading-snug">
                  100% vector loops. Zero setInterval logic, ensuring zero CPU/JS garbage accumulation leaks.
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry Log */}
          <div className="flex-1 flex flex-col min-h-[150px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Debug Logs</span>
            <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-300 overflow-y-auto leading-normal flex flex-col gap-1.5 max-h-[220px]">
              {telemetry.length === 0 ? (
                <div className="text-slate-500 italic text-center py-4">No events logged yet.</div>
              ) : (
                telemetry.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
