'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUserProgress } from '../../components/useUserProgress';

const numberWords: Record<number, string> = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
    11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
    16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
    21: 'Twenty-One', 22: 'Twenty-Two', 23: 'Twenty-Three', 24: 'Twenty-Four', 25: 'Twenty-Five',
    26: 'Twenty-Six', 27: 'Twenty-Seven', 28: 'Twenty-Eight', 29: 'Twenty-Nine', 30: 'Thirty',
    31: 'Thirty-One', 32: 'Thirty-Two', 33: 'Thirty-Three', 34: 'Thirty-Four', 35: 'Thirty-Five',
    36: 'Thirty-Six', 37: 'Thirty-Seven', 38: 'Thirty-Eight', 39: 'Thirty-Nine', 40: 'Forty',
    41: 'Forty-One', 42: 'Forty-Two', 43: 'Forty-Three', 44: 'Forty-Four', 45: 'Forty-Five',
    46: 'Forty-Six', 47: 'Forty-Seven', 48: 'Forty-Eight', 49: 'Forty-Nine', 50: 'Fifty',
    51: 'Fifty-One', 52: 'Fifty-Two', 53: 'Fifty-Three', 54: 'Fifty-Four', 55: 'Fifty-Five',
    56: 'Fifty-Six', 57: 'Fifty-Seven', 58: 'Fifty-Eight', 59: 'Fifty-Nine', 60: 'Sixty',
    61: 'Sixty-One', 62: 'Sixty-Two', 63: 'Sixty-Three', 64: 'Sixty-Four', 65: 'Sixty-Five',
    66: 'Sixty-Six', 67: 'Sixty-Seven', 68: 'Sixty-Eight', 69: 'Sixty-Nine', 70: 'Seventy',
    71: 'Seventy-One', 72: 'Seventy-Two', 73: 'Seventy-Three', 74: 'Seventy-Four', 75: 'Seventy-Five',
    76: 'Seventy-Six', 77: 'Seventy-Seven', 78: 'Seventy-Eight', 79: 'Seventy-Nine', 80: 'Eighty',
    81: 'Eighty-One', 82: 'Eighty-Two', 83: 'Eighty-Three', 84: 'Eighty-Four', 85: 'Eighty-Five',
    86: 'Eighty-Six', 87: 'Eighty-Seven', 88: 'Eighty-Eight', 89: 'Eighty-Nine', 90: 'Ninety',
    91: 'Ninety-One', 92: 'Ninety-Two', 93: 'Ninety-Three', 94: 'Ninety-Four', 95: 'Ninety-Five',
    96: 'Ninety-Six', 97: 'Ninety-Seven', 98: 'Ninety-Eight', 99: 'Ninety-Nine', 100: 'One Hundred'
};

export default function NumbersPage() {
    const [currentNumber, setCurrentNumber] = useState(1);
    const [currentRange, setCurrentRange] = useState<[number, number]>([1, 10]);
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
        syncToFirebase(Math.round((newCompleted.size / 100) * 100));
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

    const changeRange = (direction: 'prev' | 'next' | 'select', value?: string) => {
        if (direction === 'select' && value) {
            const selectedRange = value.split('-').map(Number);
            setCurrentRange([selectedRange[0], selectedRange[1]]);
        } else if (direction === 'prev' && currentRange[0] > 1) {
            setCurrentRange([currentRange[0] - 10, currentRange[1] - 10]);
        } else if (direction === 'next' && currentRange[1] < 100) {
            setCurrentRange([currentRange[0] + 10, currentRange[1] + 10]);
        }
    };

    const resetProgress = () => {
        if (confirm('Are you sure you want to start over? This will reset all your progress!')) {
            setCompletedNumbers(new Set());
            setCurrentNumber(1);
            setCurrentRange([1, 10]);
            localStorage.removeItem('kiddyHub_numbersCompleted');
            localStorage.removeItem('kiddyHub_numbersProgress');
        }
    };

    const selectRandomNumber = () => {
        const randomNum = Math.floor(Math.random() * 100) + 1;
        selectNumber(randomNum);
    };

    const numbersInGrid = useMemo(() => {
        const arr = [];
        for (let i = currentRange[0]; i <= currentRange[1]; i++) {
            arr.push(i);
        }
        return arr;
    }, [currentRange]);

    return (
        <div className="min-h-screen bg-black">
            {/* Nav */}
            <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
                    <div className="text-center">
                        <h1 className="text-[22px] font-light text-white tracking-[0.1px]">Numbers 1–100</h1>
                        <p className="text-[#6b6b6b] text-xs mt-0.5">Range {currentRange[0]}–{currentRange[1]}</p>
                    </div>
                    <select
                        className="bg-[#1a1a1a] text-white border border-[#333] rounded-[6px] px-3 py-1.5 text-sm"
                        value={`${currentRange[0]}-${currentRange[1]}`}
                        onChange={(e) => changeRange('select', e.target.value)}
                    >
                        {[ [1,10], [11,20], [21,30], [31,40], [41,50], [51,60], [61,70], [71,80], [81,90], [91,100] ].map(([start, end]) => (
                            <option key={`${start}-${end}`} value={`${start}-${end}`}>{start}–{end}</option>
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
                        <span className="text-[#0070cc] font-semibold">{completedNumbers.size}/100</span>
                    </div>
                    <div className="ps-progress-track">
                        <div className="ps-progress-fill" style={{ width: `${(completedNumbers.size / 100) * 100}%` }} />
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
                             <img 
                                src={`/numbers_assets/${currentNumber}.webp`} 
                                alt={numberWords[currentNumber]}
                                className="max-h-full object-contain rounded-[12px]"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-[19px] p-4 border border-[#f3f3f3] min-h-[200px] flex flex-wrap items-center justify-center gap-2">
                            {Array.from({ length: Math.min(currentNumber, 20) }).map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-[#0070cc] rounded-full" style={{ opacity: 0.7 + (i / 20) * 0.3 }}></div>
                            ))}
                            {currentNumber > 20 && (
                                <div className="text-[#0070cc] font-semibold text-lg">
                                    ({Math.floor(currentNumber / 10)} tens &amp; {currentNumber % 10} ones)
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => changeRange('prev')} disabled={currentRange[0] === 1}
                                className="ps-btn ps-btn-sm ps-btn-ghost">
                                ← Prev Range
                            </button>
                            <button onClick={() => changeRange('next')} disabled={currentRange[1] === 100}
                                className="ps-btn ps-btn-sm ps-btn-ghost">
                                Next Range →
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
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 mb-8">
                    {numbersInGrid.map((num) => (
                        <button
                            key={num}
                            onClick={() => selectNumber(num)}
                            className={`ps-tile aspect-square text-lg md:text-xl ${
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
