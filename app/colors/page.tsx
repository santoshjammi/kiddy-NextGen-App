'use client';

import { useState, useEffect, useCallback } from 'react';
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#6b6b6b] text-base font-light">Loading Color World&hellip;</p>
                </div>
            </div>
        );
    }

    const currentKey = colorKeys[currentIndex];
    const colorInfo = colorData[currentKey];

    return (
        <div className="min-h-screen bg-black">
            {/* Nav */}
            <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
                    <div className="text-center">
                        <h1 className="text-[22px] font-light text-white tracking-[0.1px]">Color World</h1>
                        <p className="text-[#6b6b6b] text-xs mt-0.5">Color {currentIndex + 1} of {colorKeys.length}</p>
                    </div>
                    <div className="text-[#0070cc] text-xs font-semibold">
                        {completedColors.size}/{colorKeys.length}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-[24px] p-6 md:p-10" style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>

                <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                    <div 
                        className={`w-48 h-48 md:w-60 md:h-60 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 ${colorInfo.className}`}
                        style={{ boxShadow: 'rgba(0,0,0,0.16) 0 5px 9px 0' }}
                        onClick={() => playColorAudio(currentKey)}
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-[35px] font-light text-black mb-3">{colorInfo.name}</h2>
                        <p className="text-[18px] text-[#6b6b6b] font-light mb-6 leading-relaxed">{colorInfo.description}</p>
                        
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-[#6b6b6b] tracking-wider">Examples</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {colorInfo.examples.map((ex, i) => (
                                    <span key={i} className="bg-[#f5f7fa] px-4 py-2 rounded-[20px] text-[#1f1f1f] text-sm font-medium">
                                        {ex}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 my-8">
                    {colorKeys.map((key, idx) => (
                        <button
                            key={key}
                            onClick={() => selectColor(idx)}
                            className={`h-10 md:h-12 rounded-[12px] transition-all transform ${colorData[key].className} ${
                                currentIndex === idx 
                                ? 'scale-110 ring-2 ring-[#0070cc] ring-offset-2' 
                                : completedColors.has(key)
                                ? 'opacity-100'
                                : 'opacity-50'
                            }`}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 border-t border-[#f3f3f3] pt-8">
                    <button onClick={() => selectColor(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
                        className="ps-btn ps-btn-sm ps-btn-ghost">← Prev</button>
                    <button onClick={() => selectColor(Math.min(colorKeys.length - 1, currentIndex + 1))} disabled={currentIndex === colorKeys.length - 1}
                        className="ps-btn ps-btn-sm ps-btn-ghost">Next →</button>
                    <button onClick={resetProgress}
                        className="ps-btn ps-btn-sm ps-btn-ghost" style={{ color: '#c81b3a', borderColor: '#ffd0d0' }}>Reset</button>
                </div>

                </div>
            </div>
        </div>
    );
}
