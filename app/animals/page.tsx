'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import audioEngine from '../../remotion/audio/audioEngine';

interface Animal {
  name: string;
  emoji: string;
  sound: string;
  soundWord: string;
}

const ANIMALS: Animal[] = [
  { name: 'Cow', emoji: '🐄', sound: 'Moo!', soundWord: 'moo' },
  { name: 'Dog', emoji: '🐶', sound: 'Woof!', soundWord: 'woof' },
  { name: 'Cat', emoji: '🐱', sound: 'Meow!', soundWord: 'meow' },
  { name: 'Duck', emoji: '🦆', sound: 'Quack!', soundWord: 'quack' },
  { name: 'Sheep', emoji: '🐑', sound: 'Baa!', soundWord: 'baa' },
  { name: 'Frog', emoji: '🐸', sound: 'Ribbit!', soundWord: 'ribbit' },
  { name: 'Pig', emoji: '🐷', sound: 'Oink!', soundWord: 'oink' },
  { name: 'Lion', emoji: '🦁', sound: 'Roar!', soundWord: 'roar' },
  { name: 'Owl', emoji: '🦉', sound: 'Hoot!', soundWord: 'hoot' },
  { name: 'Horse', emoji: '🐴', sound: 'Neigh!', soundWord: 'neigh' },
  { name: 'Elephant', emoji: '🐘', sound: 'Trumpet!', soundWord: 'trumpet' },
  { name: 'Bee', emoji: '🐝', sound: 'Buzz!', soundWord: 'buzz' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getChoices(correct: Animal, all: Animal[]): Animal[] {
  const others = shuffle(all.filter(a => a.name !== correct.name)).slice(0, 3);
  return shuffle([correct, ...others]);
}



export default function AnimalSoundsPage() {
  const [questions] = useState(() => shuffle(ANIMALS));
  const [choices] = useState(() => questions.map(q => getChoices(q, ANIMALS)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const current = questions[index];

  const playSound = useCallback(() => {
    audioEngine.speak(
      current.soundWord + '!',
      () => setSpeaking(true),
      () => setSpeaking(false)
    );
  }, [current.soundWord]);

  const pick = (name: string) => {
    if (selected !== null) return;
    setSelected(name);
    if (name === current.name) setScore(s => s + 1);
  };

  const next = () => {
    audioEngine.stopAll();
    setSpeaking(false);
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    audioEngine.stopAll();
    setSpeaking(false);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-black sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
            <h1 className="text-white font-light text-lg">Animal Sounds</h1>
            <div className="w-24" />
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-[24px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.18)] text-center">
            <div className="text-7xl mb-6">🦁</div>
            <h2 className="text-[36px] font-light text-black mb-3">Amazing!</h2>
            <p className="text-[#6b6b6b] text-lg mb-8">
              Score: <strong className="text-[#0070cc]">{score}</strong> / {questions.length}
            </p>
            <button onClick={restart} className="ps-btn">Play Again</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Home</Link>
          <h1 className="text-white font-light text-lg">Animal Sounds</h1>
          <span className="text-white/60 text-sm font-medium">⭐ {score}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
          {/* Progress */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#6b6b6b] text-sm">{index + 1} / {questions.length}</span>
            <div className="ps-progress-track w-40">
              <div className="ps-progress-fill" style={{ width: `${(index / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Sound card */}
          <div className="bg-[#f5f7fa] rounded-[19px] py-10 text-center mb-8">
            <p className="text-[#6b6b6b] text-sm mb-3">Which animal says this?</p>
            <p className="text-[64px] font-light text-black tracking-tight leading-none mb-6">
              {current.sound}
            </p>
            <button
              onClick={playSound}
              className={[
                'ps-btn ps-btn-sm mx-auto',
                speaking ? 'opacity-70' : '',
              ].join(' ')}
            >
              {speaking ? '🔊 Playing...' : '🔊 Hear it!'}
            </button>
          </div>

          {/* Animal choices */}
          <div className="grid grid-cols-2 gap-4">
            {choices[index].map(animal => {
              const isSelected = selected === animal.name;
              const isCorrect = animal.name === current.name;
              let cls =
                'py-6 rounded-[20px] flex flex-col items-center gap-2 border-2 transition-all duration-180 ';
              if (selected === null) {
                cls += 'bg-white border-[#e0e0e0] hover:border-[#0070cc] hover:bg-[#f5f7fa] hover:scale-105 cursor-pointer shadow-sm';
              } else if (isCorrect) {
                cls += 'bg-[#f0fdf4] border-[#22c55e]';
              } else if (isSelected) {
                cls += 'bg-[#fef2f2] border-[#ef4444]';
              } else {
                cls += 'bg-white border-[#e0e0e0] opacity-40';
              }
              return (
                <button
                  key={animal.name}
                  onClick={() => pick(animal.name)}
                  className={cls}
                  data-testid="animal-choice"
                  data-correct={isCorrect}
                >
                  <span className="text-5xl">{animal.emoji}</span>
                  <span className={[
                    'font-semibold text-sm',
                    isCorrect && selected !== null ? 'text-[#16a34a]' :
                    isSelected && !isCorrect ? 'text-[#dc2626]' : 'text-[#1f1f1f]',
                  ].join(' ')}>
                    {animal.name}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-6 text-center space-y-3">
              {selected === current.name ? (
                <p className="text-[#16a34a] font-semibold">
                  🎉 Yes! The {current.name} says &quot;{current.sound}&quot;
                </p>
              ) : (
                <p className="text-[#dc2626] font-semibold">
                  It was the {current.name} {current.emoji} that says &quot;{current.sound}&quot;
                </p>
              )}
              <button onClick={next} className="ps-btn">
                {index + 1 >= questions.length ? 'See Results' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
