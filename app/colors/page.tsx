'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUserProgress } from '../../components/useUserProgress';

const colorData: Record<string, { name: string; description: string; className: string; examples: string[] }> = {
    red: { name: 'Red', description: 'A warm, bright color like fire and roses', className: 'bg-red-500', examples: ['🍎 apple', '🌹 rose', '🚗 fire truck', '❤️ heart', '🍓 strawberry'] },
    blue: { name: 'Blue', description: 'A cool, calm color like the sky and ocean', className: 'bg-blue-500', examples: ['🌊 ocean', '☁️ sky', '🫐 blueberry', '👖 jeans', '🐋 whale'] },
    yellow: { name: 'Yellow', description: 'A bright, cheerful color like the sun', className: 'bg-yellow-400', examples: ['☀️ sun', '🍌 banana', '🌻 sunflower', '🐣 chick', '🧀 cheese'] },
    green: { name: 'Green', description: 'A natural color like grass and leaves', className: 'bg-green-500', examples: ['🌱 grass', '🍃 leaves', '🐸 frog', '🥒 cucumber', '🌲 tree'] },
    orange: { name: 'Orange', description: 'A warm color between red and yellow', className: 'bg-orange-500', examples: ['🍊 orange', '🥕 carrot', '🎃 pumpkin', '🦊 fox', '🔥 fire'] },
    purple: { name: 'Purple', description: 'A royal color made from red and blue', className: 'bg-purple-500', examples: ['🍇 grapes', '🦄 unicorn', '👑 crown', '🌸 flower', '🍆 eggplant'] },
    pink: { name: 'Pink', description: 'A soft, gentle color like cotton candy', className: 'bg-pink-400', examples: ['🌸 cherry blossom', '🐷 pig', '💖 heart', '🎀 bow', '🍑 peach'] },
    brown: { name: 'Brown', description: 'An earthy color like tree bark and soil', className: 'bg-amber-800', examples: ['🌳 tree trunk', '🐻 bear', '🍫 chocolate', '🥜 nuts', '🏠 wood'] },
    black: { name: 'Black', description: 'The darkest color, like the night sky', className: 'bg-black', examples: ['🌙 night', '🐧 penguin', '⚫ circle', '🖤 heart', '🐈‍⬛ cat'] },
    white: { name: 'White', description: 'The lightest color, like fresh snow', className: 'bg-white border border-gray-200', examples: ['❄️ snow', '☁️ clouds', '🐑 sheep', '🥛 milk', '🦢 swan'] },
    gray: { name: 'Gray', description: 'A neutral color between black and white', className: 'bg-gray-500', examples: ['🐘 elephant', '☁️ storm clouds', '🪨 rock', '🐭 mouse', '🏢 building'] },
    turquoise: { name: 'Turquoise', description: 'A beautiful blue-green color like tropical water', className: 'bg-teal-400', examples: ['🏝️ tropical water', '💎 gemstone', '🦚 peacock', '🌊 lagoon', '💙 jewel'] },
};

const colorKeys = Object.keys(colorData);

export default function ColorsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedColors, setCompletedColors] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const { saveProgress: syncToFirebase } = useUserProgress('colors');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        const saved = localStorage.getItem('kiddyHub_colorsCompleted');
        if (saved) setCompletedColors(new Set(JSON.parse(saved)));
        return () => clearTimeout(timer);
    }, []);

    const saveProgress = (newCompleted: Set<string>) => {
        setCompletedColors(newCompleted);
        localStorage.setItem('kiddyHub_colorsCompleted', JSON.stringify([...newCompleted]));
        syncToFirebase(Math.round((newCompleted.size / colorKeys.length) * 100));
    };

    const playColorAudio = useCallback((key: string) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        const audio = new Audio(`/colors_assets/${key}.mp3`);
        audio.onerror = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(`${colorData[key].name}. ${colorData[key].description}`);
                utterance.rate = 0.8;
                utterance.pitch = 1.1;
                window.speechSynthesis.speak(utterance);
            }
        };
        audio.play().catch(() => {});
        setCurrentAudio(audio);
    }, [currentAudio]);

    const selectColor = (index: number) => {
        const key = colorKeys[index];
        setCurrentIndex(index);
        const newCompleted = new Set(completedColors);
        newCompleted.add(key);
        saveProgress(newCompleted);
        setTimeout(() => playColorAudio(key), 300);
    };

    const resetProgress = () => {
        if (confirm('Are you sure you want to start over?')) {
            setCompletedColors(new Set());
            setCurrentIndex(0);
            localStorage.removeItem('kiddyHub_colorsCompleted');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-500">
                <div className="text-white text-2xl animate-pulse text-center">
                    Loading Color World... 🌈<br/><span className="text-sm opacity-75">Mixing magical colors!</span>
                </div>
            </div>
        );
    }

    const currentKey = colorKeys[currentIndex];
    const colorInfo = colorData[currentKey];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-blue-300 to-teal-300 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition-all">← Back to Hub</Link>
                    <h1 className="text-3xl md:text-4xl font-fredoka text-indigo-600 text-center">🎨 Color World 🎨</h1>
                    <div className="text-gray-500 font-semibold hidden md:block">Color {currentIndex + 1} of {colorKeys.length}</div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div 
                        className={`w-48 h-48 md:w-64 md:h-64 rounded-full shadow-2xl cursor-pointer transform transition-all hover:scale-105 active:scale-95 ${colorInfo.className}`}
                        onClick={() => playColorAudio(currentKey)}
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-5xl font-bold text-gray-800 mb-4">{colorInfo.name}</h2>
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">{colorInfo.description}</p>
                        
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Examples</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {colorInfo.examples.map((ex, i) => (
                                    <span key={i} className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium shadow-sm">
                                        {ex}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 my-10">
                    {colorKeys.map((key, idx) => (
                        <button
                            key={key}
                            onClick={() => selectColor(idx)}
                            className={`h-10 md:h-12 rounded-xl transition-all transform ${
                                currentIndex === idx 
                                ? 'scale-110 ring-4 ring-indigo-300 shadow-lg' 
                                : completedColors.has(key)
                                ? 'opacity-100'
                                : 'opacity-50'
                            } ${colorData[key].className}`}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 border-t pt-8">
                    <button onClick={() => selectColor(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="bg-gray-200 disabled:opacity-50 px-8 py-3 rounded-full font-bold text-gray-700">← Prev</button>
                    <button onClick={() => selectColor(Math.min(colorKeys.length - 1, currentIndex + 1))} disabled={currentIndex === colorKeys.length - 1} className="bg-gray-200 disabled:opacity-50 px-8 py-3 rounded-full font-bold text-gray-700">Next →</button>
                    <button onClick={resetProgress} className="text-red-400 hover:text-red-600 text-sm font-medium underline ml-4">Reset All Progress</button>
                </div>
            </div>
        </div>
    );
}
