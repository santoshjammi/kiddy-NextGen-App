'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
            <div className="min-h-screen flex items-center justify-center bg-indigo-500">
                <div className="text-white text-2xl animate-pulse">Loading Shapes... ✨</div>
            </div>
        );
    }

    const currentShapeKey = shapeKeys[currentIndex];
    const shapeInfo = shapeData[currentShapeKey];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-400 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <Link href="/" className="bg-indigo-500 text-white px-6 py-2 rounded-full">← Back to Hub</Link>
                    <h1 className="text-3xl md:text-4xl font-fredoka text-indigo-600">🔺 Shape Explorer 🔺</h1>
                    <div className="text-gray-500 font-semibold">Shape {currentIndex + 1} of {shapeKeys.length}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
                    <div className="flex flex-col items-center">
                        <div 
                            className={`w-48 h-48 bg-indigo-500 shadow-lg mb-6 transition-all duration-500 flex items-center justify-center ${shapeInfo.className}`}
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
                        <p className="text-gray-400 text-sm italic">Tap the shape to hear its name!</p>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">{shapeInfo.name}</h2>
                        <p className="text-xl text-indigo-600 mb-4">{shapeInfo.description}</p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl italic text-gray-700">
                            "{shapeInfo.funFact}"
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 mb-10">
                    {shapeKeys.map((key, idx) => (
                        <button
                            key={key}
                            onClick={() => selectShape(idx)}
                            className={`h-12 rounded-xl font-bold transition-all ${
                                currentIndex === idx 
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' 
                                : completedShapes.has(key)
                                ? 'bg-green-400 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={prevShape} disabled={currentIndex === 0} className="bg-gray-200 disabled:opacity-50 px-8 py-3 rounded-full font-bold">← Prev</button>
                    <button onClick={nextShape} disabled={currentIndex === shapeKeys.length - 1} className="bg-gray-200 disabled:opacity-50 px-8 py-3 rounded-full font-bold">Next →</button>
                    <button onClick={resetProgress} className="text-red-500 text-sm underline ml-4">Reset Progress</button>
                </div>
            </div>
        </div>
    );
}
