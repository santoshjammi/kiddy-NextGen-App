'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserProgress } from '../../components/useUserProgress';

const LEVEL_RANGES: Array<{ label: string; start: number; end: number }> = [
  { label: 'Level 1', start: 1, end: 25 },
  { label: 'Level 2', start: 26, end: 50 },
  { label: 'Level 3', start: 51, end: 100 },
  { label: 'Level 4', start: 101, end: 150 },
  { label: 'Level 5', start: 151, end: 200 },
];

const UNITS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numberToWords(n: number): string {
  if (n === 0) return 'Zero';
  if (n === 200) return 'Two Hundred';
  if (n > 100) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    const prefix = hundreds === 1 ? 'One Hundred' : `${UNITS[hundreds]} Hundred`;
    return remainder === 0 ? prefix : `${prefix} ${numberToWords(remainder)}`;
  }
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  const ten = Math.floor(n / 10);
  const unit = n % 10;
  return unit === 0 ? TENS[ten] : `${TENS[ten]}-${UNITS[unit]}`;
}

const numberWords: Record<number, string> = {};
for (let i = 1; i <= 200; i++) {
  numberWords[i] = numberToWords(i);
}

export default function NumbersPage() {
    const [currentNumber, setCurrentNumber] = useState(1);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const { saveProgress: syncToFirebase } = useUserProgress('numbers');

    useEffect(() => {
        const saved = localStorage.getItem('kiddyHub_numbersCompleted');
        if (saved) {
            setCompletedNumbers(new Set(JSON.parse(saved)));
        }
    }, []);

    const saveProgress = (newCompleted: Set<number>) => {
        setCompletedNumbers(newCompleted);
        localStorage.setItem('kiddyHub_numbersCompleted', JSON.stringify([...newCompleted]));
        localStorage.setItem('kiddyHub_numbersProgress', newCompleted.size.toString());
        syncToFirebase(Math.round((newCompleted.size / 200) * 100));
    };

    const playNumberAudio = useCallback((num: number) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const audioPath = `/numbers_assets/${num}.mp3`;
        const audio = new Audio(audioPath);
        audio.volume = 0.8;

        audio.onerror = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(numberWords[num]);
                utterance.rate = 0.8;
                utterance.pitch = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        };

        audio.play().catch(() => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(numberWords[num]);
                utterance.rate = 0.8;
                utterance.pitch = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        });
        setCurrentAudio(audio);
    }, [currentAudio]);

    const selectNumber = (num: number) => {
        setCurrentNumber(num);
        const newCompleted = new Set(completedNumbers);
        newCompleted.add(num);
        saveProgress(newCompleted);

        setTimeout(() => {
            playNumberAudio(num);
        }, 300);
    };

    const changeLevel = (direction: 'prev' | 'next' | 'select', levelIdx?: number) => {
        if (direction === 'select' && levelIdx !== undefined) {
            setCurrentLevel(levelIdx);
        } else if (direction === 'prev' && currentLevel > 0) {
            setCurrentLevel(currentLevel - 1);
        } else if (direction === 'next' && currentLevel < LEVEL_RANGES.length - 1) {
            setCurrentLevel(currentLevel + 1);
        }
    };

    const resetProgress = () => {
        if (confirm('Are you sure you want to start over? This will reset all your progress!')) {
            setCompletedNumbers(new Set());
            setCurrentNumber(1);
            setCurrentLevel(0);
            localStorage.removeItem('kiddyHub_numbersCompleted');
            localStorage.removeItem('kiddyHub_numbersProgress');
        }
    };

    const selectRandomNumber = () => {
        const range = LEVEL_RANGES[currentLevel];
        const randomNum = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
        selectNumber(randomNum);
    };

    const range = LEVEL_RANGES[currentLevel];
    const numbersInGrid = useMemo(() => {
        const arr = [];
        for (let i = range.start; i <= range.end; i++) {
            arr.push(i);
        }
        return arr;
    }, [range]);

    const visualDotCount = currentNumber <= 50 ? currentNumber : 50;

    return (
        <div className="min-h-screen bg-black">
            {/* Nav */}
            <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
                    <div className="text-center">
                        <h1 className="text-[22px] font-light text-white tracking-[0.1px]">Numbers 1–200</h1>
                        <p className="text-[#6b6b6b] text-xs mt-0.5">{range.label}: {range.start}–{range.end}</p>
                    </div>
                    <select
                        className="bg-[#1a1a1a] text-white border border-[#333] rounded-[6px] px-3 py-1.5 text-sm"
                        value={currentLevel}
                        onChange={(e) => changeLevel('select', parseInt(e.target.value))}
                    >
                        {LEVEL_RANGES.map((lr, i) => (
                            <option key={i} value={i}>{lr.label}: {lr.start}–{lr.end}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-[24px] p-6 md:p-10" style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-[#6b6b6b] mb-2">
                        <span className="font-light">Progress</span>
                        <span className="text-[#0070cc] font-semibold">{completedNumbers.size}/200</span>
                    </div>
                    <div className="ps-progress-track">
                        <div className="ps-progress-fill" style={{ width: `${(completedNumbers.size / 200) * 100}%` }} />
                    </div>
                </div>

                {/* Main Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
                    <div className="text-center bg-[#f5f7fa] rounded-[19px] p-8" style={{ boxShadow: 'inset rgba(0,0,0,0.04) 0 2px 6px 0' }}>
                        <div className="text-8xl md:text-9xl font-light text-[#0070cc] mb-4">
                            {currentNumber}
                        </div>
                        <div className="text-[28px] font-light text-[#1f1f1f]">
                            {numberWords[currentNumber]}
                        </div>
                        <div className="mt-6 h-32 flex items-center justify-center">
                             <Image
                                src={`/numbers_assets/${currentNumber}.webp`}
                                alt={numberWords[currentNumber]}
                                className="max-h-full object-contain rounded-[12px]"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-[19px] p-4 border border-[#f3f3f3] min-h-[200px] flex flex-wrap items-center justify-center gap-1.5">
                            {Array.from({ length: visualDotCount }).map((_, i) => (
                                <div key={i} className="w-3.5 h-3.5 bg-[#0070cc] rounded-full" style={{ opacity: 0.5 + (i / visualDotCount) * 0.5 }}></div>
                            ))}
                            {currentNumber > 50 && (
                                <div className="w-full text-center text-[#0070cc] font-semibold text-lg mt-2">
                                    ({Math.floor(currentNumber / 10)} tens & {currentNumber % 10} ones)
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => changeLevel('prev')} disabled={currentLevel === 0}
                                className="ps-btn ps-btn-sm ps-btn-ghost">
                                ← Prev Level
                            </button>
                            <button onClick={() => changeLevel('next')} disabled={currentLevel === LEVEL_RANGES.length - 1}
                                className="ps-btn ps-btn-sm ps-btn-ghost">
                                Next Level →
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={selectRandomNumber} className="ps-btn ps-btn-sm">
                                🎲 Surprise
                            </button>
                            <button onClick={() => playNumberAudio(currentNumber)} className="ps-btn ps-btn-sm">
                                🔊 Repeat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className={`grid gap-2 md:gap-3 mb-8 ${
                    range.end - range.start > 50
                        ? 'grid-cols-5 sm:grid-cols-5 md:grid-cols-10'
                        : 'grid-cols-5 sm:grid-cols-5 md:grid-cols-5'
                }`}>
                    {numbersInGrid.map((num) => (
                        <button
                            key={num}
                            onClick={() => selectNumber(num)}
                            className={`ps-tile aspect-square text-sm md:text-base ${
                                currentNumber === num
                                    ? 'ps-tile-active'
                                    : completedNumbers.has(num)
                                    ? 'ps-tile-done'
                                    : ''
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button onClick={resetProgress}
                        className="ps-btn ps-btn-sm ps-btn-ghost" style={{ color: '#c81b3a', borderColor: '#ffd0d0' }}>
                        Reset All Progress
                    </button>
                </div>

                </div>
            </div>
        </div>
    );
}