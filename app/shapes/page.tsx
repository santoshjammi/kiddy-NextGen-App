'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUserProgress } from '../../components/useUserProgress';

const shapeData: Record<string, { name: string; description: string; funFact: string; className: string; examples: string[] }> = {
    circle: {
        name: 'Circle',
        description: 'A round shape with no corners',
        funFact: 'Circles are everywhere! Look for wheels, balls, and the sun!',
        className: 'circle',
        examples: ['wheel', 'ball', 'sun', 'moon', 'pizza']
    },
    square: {
        name: 'Square',
        description: 'A shape with 4 equal sides and 4 corners',
        funFact: 'Squares have 4 equal sides and 4 right angles. Windows are often square!',
        className: 'square',
        examples: ['window', 'book', 'box', 'tile', 'picture frame']
    },
    triangle: {
        name: 'Triangle',
        description: 'A shape with 3 sides and 3 corners',
        funFact: 'Triangles are the strongest shape! That\'s why we see them in bridges.',
        className: 'triangle',
        examples: ['roof', 'mountain', 'slice of pizza', 'arrow', 'sail']
    },
    rectangle: {
        name: 'Rectangle',
        description: 'A shape with 4 sides, opposite sides are equal',
        funFact: 'Your TV screen, tablet, and most doors are rectangles!',
        className: 'rectangle',
        examples: ['door', 'TV', 'book', 'phone', 'envelope']
    },
    oval: {
        name: 'Oval',
        description: 'A stretched circle shape, like an egg',
        funFact: 'Eggs are oval shaped because it\'s the strongest shape for thin shells!',
        className: 'oval',
        examples: ['egg', 'face', 'mirror', 'track', 'balloon']
    },
    diamond: {
        name: 'Diamond',
        description: 'A square turned on its point',
        funFact: 'Diamonds sparkle because of their special shape! Baseball fields are diamond-shaped too.',
        className: 'diamond',
        examples: ['jewel', 'baseball field', 'kite', 'road sign', 'playing card']
    },
    star: {
        name: 'Star',
        description: 'A shape with pointed rays going outward',
        funFact: 'Real stars in the sky are actually sphere-shaped, but they look pointy because they\'re so bright!',
        className: 'star',
        examples: ['flag', 'decoration', 'award', 'sheriff badge', 'sea star']
    },
    heart: {
        name: 'Heart',
        description: 'A special shape that means love and caring',
        funFact: 'The heart shape doesn\'t look like a real heart, but it\'s been a symbol of love for hundreds of years!',
        className: 'heart',
        examples: ['valentine', 'emoji', 'decoration', 'candy', 'card']
    },
    hexagon: {
        name: 'Hexagon',
        description: 'A shape with 6 equal sides',
        funFact: 'Bees make their honeycombs in hexagon shapes because it uses the least wax and is super strong!',
        className: 'hexagon',
        examples: ['honeycomb', 'nut', 'soccer ball patch', 'snowflake', 'tile']
    }
};

const shapeKeys = Object.keys(shapeData);

export default function ShapesPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedShapes, setCompletedShapes] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const { saveProgress: syncToFirebase } = useUserProgress('shapes');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        const saved = localStorage.getItem('kiddyHub_shapesCompleted');
        if (saved) {
            setCompletedShapes(new Set(JSON.parse(saved)));
        }
        return () => clearTimeout(timer);
    }, []);

    const saveProgress = (newCompleted: Set<string>) => {
        setCompletedShapes(newCompleted);
        localStorage.setItem('kiddyHub_shapesCompleted', JSON.stringify([...newCompleted]));
        syncToFirebase(Math.round((newCompleted.size / shapeKeys.length) * 100));
    };

    const playShapeAudio = useCallback((key: string) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        const audio = new Audio(`/shapes_assets/${key}.mp3`);
        audio.onerror = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(`${shapeData[key].name}. ${shapeData[key].description}`);
                utterance.rate = 0.8;
                utterance.pitch = 1.1;
                window.speechSynthesis.speak(utterance);
            }
        };
        audio.play().catch(() => {});
        setCurrentAudio(audio);
    }, [currentAudio]);

    const selectShape = (index: number) => {
        const key = shapeKeys[index];
        setCurrentIndex(index);
        const newCompleted = new Set(completedShapes);
        newCompleted.add(key);
        saveProgress(newCompleted);
        playShapeAudio(key);
    };

    const nextShape = () => {
        if (currentIndex < shapeKeys.length - 1) selectShape(currentIndex + 1);
    };

    const prevShape = () => {
        if (currentIndex > 0) selectShape(currentIndex - 1);
    };

    const resetProgress = () => {
        if (confirm('Are you sure you want to start over?')) {
            setCompletedShapes(new Set());
            setCurrentIndex(0);
            localStorage.removeItem('kiddyHub_shapesCompleted');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#0070cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#6b6b6b] text-base font-light">Loading shapes&hellip;</p>
                </div>
            </div>
        );
    }

    const currentShapeKey = shapeKeys[currentIndex];
    const shapeInfo = shapeData[currentShapeKey];

    return (
        <div className="min-h-screen bg-black">
            {/* Nav */}
            <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="ps-btn ps-btn-sm ps-btn-ghost-dark">← Back</Link>
                    <div className="text-center">
                        <h1 className="text-[22px] font-light text-white tracking-[0.1px]">Shape Explorer</h1>
                        <p className="text-[#6b6b6b] text-xs mt-0.5">Shape {currentIndex + 1} of {shapeKeys.length}</p>
                    </div>
                    <div className="text-[#0070cc] text-xs font-semibold">
                        {completedShapes.size}/{shapeKeys.length}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-[24px] p-6 md:p-10" style={{ boxShadow: 'rgba(0,0,0,0.08) 0 5px 9px 0' }}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-40 h-40 bg-[#0070cc] shadow-[rgba(0,0,0,0.16)_0_5px_9px_0] mb-6 transition-all duration-500 flex items-center justify-center cursor-pointer"
                            onClick={() => playShapeAudio(currentShapeKey)}
                            style={{ 
                                clipPath: 
                                    currentShapeKey === 'circle' ? 'circle(50%)' :
                                    currentShapeKey === 'square' ? 'inset(0)' :
                                    currentShapeKey === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                    currentShapeKey === 'rectangle' ? 'inset(0 20% 0 20%)' :
                                    currentShapeKey === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                                    currentShapeKey === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                                    currentShapeKey === 'heart' ? 'polygon(50% 15%, 80% 0%, 100% 30%, 50% 100%, 0% 30%, 20% 0%)' : 'none'
                            }}
                        >
                            {/* Tailwind can't easily do all clip-paths for custom shapes without complex config, 
                                so for this demo we use the logic provided or fallback to a simple div */}
                        </div>
                        <p className="text-[#6b6b6b] text-sm italic">Tap the shape to hear its name!</p>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-[35px] font-light text-black mb-2">{shapeInfo.name}</h2>
                        <p className="text-[18px] text-[#0070cc] font-light mb-4">{shapeInfo.description}</p>
                        <div className="bg-[#f5f7fa] border-l-4 border-[#0070cc] p-4 rounded-r-[12px] italic text-[#1f1f1f] text-sm leading-relaxed">
                            &ldquo;{shapeInfo.funFact}&rdquo;
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 mb-10">
                    {shapeKeys.map((key, idx) => (
                        <button
                            key={key}
                            onClick={() => selectShape(idx)}
                            className={`ps-tile h-12 ${
                                currentIndex === idx 
                                ? 'ps-tile-active' 
                                : completedShapes.has(key)
                                ? 'ps-tile-done'
                                : ''
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={prevShape} disabled={currentIndex === 0} className="ps-btn ps-btn-sm ps-btn-ghost">← Prev</button>
                    <button onClick={nextShape} disabled={currentIndex === shapeKeys.length - 1} className="ps-btn ps-btn-sm ps-btn-ghost">Next →</button>
                    <button onClick={resetProgress} className="ps-btn ps-btn-sm ps-btn-ghost" style={{ color: '#c81b3a', borderColor: '#ffd0d0' }}>Reset</button>
                </div>

                </div>
            </div>
        </div>
    );
}
