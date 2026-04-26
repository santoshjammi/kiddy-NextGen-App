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

    useEffect(() => {
        const percentage = (completedNumbers.size / 100) * 100;
        // If we are on the hub, we'd want to update the hub's progress.
        // For now, we'll just handle it locally.
    }, [completedNumbers]);

    const saveProgress = (newCompleted: Set<number>) => {
        setCompletedNumbers(newCompleted);
        localStorage.setItem('kiddyHub_numbersCompleted', JSON.stringify([...newCompleted]));
        localStorage.setItem('kiddyHub_numbersProgress', newCompleted.size.toString());
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
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <Link href="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition-all">
                        ← Back to Hub
                    </Link>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-fredoka text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                            🔢 Number Fun 🔢
                        </h1>
                        <p className="text-gray-600">Numbers {currentRange[0]}-{currentRange[1]}</p>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            className="bg-gray-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
                            value={`${currentRange[0]}-${currentRange[1]}`}
                            onChange={(e) => changeRange('select', e.target.value)}
                        >
                            {[ [1,10], [11,20], [21,30], [31,40], [41,50], [51,60], [61,70], [71,80], [81,90], [91,100] ].map(([start, end]) => (
                                <option key={`${start}-${end}`} value={`${start}-${end}`}>
                                    {start}-{end}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Learning Progress</span>
                        <span>{completedNumbers.size}/100</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${(completedNumbers.size / 100) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
                    <div className="text-center bg-indigo-50 rounded-3xl p-8 shadow-inner">
                        <div className="text-8xl md:text-9xl font-fredoka text-indigo-600 mb-4">
                            {currentNumber}
                        </div>
                        <div className="text-3xl font-semibold text-gray-700">
                            {numberWords[currentNumber]}
                        </div>
                        <div className="mt-6 h-32 flex items-center justify-center">
                             <img 
                                src={`/numbers_assets/${currentNumber}.webp`} 
                                alt={numberWords[currentNumber]}
                                className="max-h-full object-contain rounded-xl"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-h-[200px] flex flex-wrap items-center justify-center gap-2">
                            {Array.from({ length: Math.min(currentNumber, 20) }).map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                            {currentNumber > 20 && (
                                <div className="text-indigo-400 font-bold text-xl">
                                    ({Math.floor(currentNumber / 10)} tens and {currentNumber % 10} ones)
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => changeRange('prev')}
                                disabled={currentRange[0] === 1}
                                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                            >
                                ← Prev
                            </button>
                            <button 
                                onClick={() => changeRange('next')}
                                disabled={currentRange[1] === 100}
                                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                            >
                                Next →
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={selectRandomNumber}
                                className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                            >
                                🎲 Surprise!
                            </button>
                            <button 
                                onClick={() => playNumberAudio(currentNumber)}
                                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                            >
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
                            className={`aspect-square rounded-xl text-lg md:text-xl font-bold transition-all ${
                                currentNumber === num
                                    ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-4 ring-indigo-200'
                                    : completedNumbers.has(num)
                                    ? 'bg-green-400 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={resetProgress}
                        className="text-red-400 hover:text-red-600 text-sm font-medium underline transition-colors"
                    >
                        Reset All Progress
                    </button>
                </div>
            </div>
        </div>
    );
}
