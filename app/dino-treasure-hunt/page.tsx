'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import IndiaMap from '../../components/IndiaMap';

interface StateInfo {
  id: string;
  name: string;
  emoji: string;
  capital: string;
  landmark: string;
  landmarkEmoji: string;
  funFact: string;
  color: string;
}

const ALL_STATES: StateInfo[] = [
  { id: 'jammu-kashmir', name: 'Jammu & Kashmir', emoji: '🏔️', capital: 'Srinagar', landmark: 'Dal Lake', landmarkEmoji: '🛶', funFact: 'Famous for beautiful houseboats and shikaras!', color: '#4FC3F7' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', emoji: '⛰️', capital: 'Shimla', landmark: 'Snow Mountains', landmarkEmoji: '❄️', funFact: 'Known as the "Land of Snow"!', color: '#81C784' },
  { id: 'punjab', name: 'Punjab', emoji: '🌾', capital: 'Chandigarh', landmark: 'Golden Temple', landmarkEmoji: '🛕', funFact: 'Called the "Bread Basket of India"!', color: '#FFB74D' },
  { id: 'uttarakhand', name: 'Uttarakhand', emoji: '🏞️', capital: 'Dehradun', landmark: 'Yoga Mountains', landmarkEmoji: '🧘', funFact: 'Home to the famous Himalayan peaks!', color: '#A5D6A7' },
  { id: 'haryana', name: 'Haryana', emoji: '🚜', capital: 'Chandigarh', landmark: 'Farm Fields', landmarkEmoji: '🌽', funFact: 'Known for its amazing wrestlers!', color: '#FFCC80' },
  { id: 'delhi', name: 'Delhi', emoji: '🏛️', capital: 'New Delhi', landmark: 'Red Fort', landmarkEmoji: '🏰', funFact: 'The capital of India for thousands of years!', color: '#EF5350' },
  { id: 'rajasthan', name: 'Rajasthan', emoji: '🏜️', capital: 'Jaipur', landmark: 'Palace & Camel', landmarkEmoji: '🐪', funFact: 'Largest state in India by area!', color: '#FF7043' },
  { id: 'gujarat', name: 'Gujarat', emoji: '🦁', capital: 'Gandhinagar', landmark: 'Lion Sanctuary', landmarkEmoji: '🦁', funFact: 'Home to the Asiatic lion!', color: '#FF8A65' },
  { id: 'maharashtra', name: 'Maharashtra', emoji: '🎬', capital: 'Mumbai', landmark: 'Bollywood City', landmarkEmoji: '🎥', funFact: 'Bollywood — the biggest film industry in the world!', color: '#7E57C2' },
  { id: 'goa', name: 'Goa', emoji: '🏖️', capital: 'Panaji', landmark: 'Sunset Beach', landmarkEmoji: '🌅', funFact: 'India\'s smallest state — and the most fun beaches!', color: '#4DD0E1' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', emoji: '🐯', capital: 'Bhopal', landmark: 'Tiger Reserve', landmarkEmoji: '🐅', funFact: 'Called the "Tiger State" of India!', color: '#66BB6A' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', emoji: '🕌', capital: 'Lucknow', landmark: 'Taj Mahal', landmarkEmoji: '🕌', funFact: 'Home to the Taj Mahal — one of the 7 wonders!', color: '#AB47BC' },
  { id: 'chhattisgarh', name: 'Chhattisgarh', emoji: '🌳', capital: 'Raipur', landmark: 'Green Forests', landmarkEmoji: '🌲', funFact: 'One of the greenest states with many waterfalls!', color: '#43A047' },
  { id: 'bihar', name: 'Bihar', emoji: '📚', capital: 'Patna', landmark: 'Ancient University', landmarkEmoji: '📜', funFact: 'Had the world\'s first university — Nalanda!', color: '#FFA726' },
  { id: 'jharkhand', name: 'Jharkhand', emoji: '⛏️', capital: 'Ranchi', landmark: 'Waterfall Valley', landmarkEmoji: '💧', funFact: 'Known as the "Land of Forests and Waterfalls"!', color: '#8D6E63' },
  { id: 'west-bengal', name: 'West Bengal', emoji: '🐅', capital: 'Kolkata', landmark: 'Royal Bengal Tiger', landmarkEmoji: '🐯', funFact: 'Home to the Royal Bengal Tiger in the Sundarbans!', color: '#EC407A' },
  { id: 'odisha', name: 'Odisha', emoji: '🏛️', capital: 'Bhubaneswar', landmark: 'Sun Temple', landmarkEmoji: '☀️', funFact: 'Famous for the magnificent Sun Temple!', color: '#FF8A65' },
  { id: 'sikkim', name: 'Sikkim', emoji: '🌸', capital: 'Gangtok', landmark: 'Flower Gardens', landmarkEmoji: '🌺', funFact: 'India\'s first organic state — no chemicals!', color: '#CE93D8' },
  { id: 'assam', name: 'Assam', emoji: '🍵', capital: 'Dispur', landmark: 'Tea Gardens', landmarkEmoji: '🍃', funFact: 'Famous for delicious Assam tea!', color: '#66BB6A' },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', emoji: '🏔️', capital: 'Itanagar', landmark: 'Mountain Sunrise', landmarkEmoji: '🌄', funFact: 'The first place in India to see the sunrise!', color: '#80CBC4' },
  { id: 'nagaland', name: 'Nagaland', emoji: '🎭', capital: 'Kohima', landmark: 'Festival Dance', landmarkEmoji: '💃', funFact: 'Famous for the Hornbill Festival with colorful dances!', color: '#F48FB1' },
  { id: 'manipur', name: 'Manipur', emoji: '🪷', capital: 'Imphal', landmark: 'Floating Lake', landmarkEmoji: '🪷', funFact: 'Home to the floating Loktak Lake!', color: '#FFD54F' },
  { id: 'mizoram', name: 'Mizoram', emoji: '🎋', capital: 'Aizawl', landmark: 'Bamboo Dances', landmarkEmoji: '🎋', funFact: 'Known for the beautiful bamboo dance!', color: '#AED581' },
  { id: 'tripura', name: 'Tripura', emoji: '🛕', capital: 'Agartala', landmark: 'Ancient Temples', landmarkEmoji: '🛕', funFact: 'Has amazing ancient temples and palaces!', color: '#DCE775' },
  { id: 'meghalaya', name: 'Meghalaya', emoji: '☁️', capital: 'Shillong', landmark: 'Cloud Mountains', landmarkEmoji: '☁️', funFact: 'Means "Home of the Clouds" — the rainiest place!', color: '#90CAF9' },
  { id: 'telangana', name: 'Telangana', emoji: '💎', capital: 'Hyderabad', landmark: 'Pearls & Charminar', landmarkEmoji: '💎', funFact: 'Famous for pearls and the historic Charminar!', color: '#CE93D8' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', emoji: '🥭', capital: 'Amaravati', landmark: 'Mango Gardens', landmarkEmoji: '🥭', funFact: 'Known as the "Mango Basket" of India!', color: '#FFB74D' },
  { id: 'karnataka', name: 'Karnataka', emoji: '🖥️', capital: 'Bengaluru', landmark: 'Garden City', landmarkEmoji: '🌳', funFact: 'Bengaluru is called the "Silicon Valley of India"!', color: '#81C784' },
  { id: 'kerala', name: 'Kerala', emoji: '🌴', capital: 'Thiruvananthapuram', landmark: 'Coconut Trees', landmarkEmoji: '🥥', funFact: 'Called "God\'s Own Country" for its beauty!', color: '#4DB6AC' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', emoji: '🏛️', capital: 'Chennai', landmark: 'Ancient Temples', landmarkEmoji: '🏛️', funFact: 'Famous for magnificent temple architecture!', color: '#E57373' },
  { id: 'chandigarh', name: 'Chandigarh', emoji: '🌳', capital: 'Chandigarh', landmark: 'Rock Garden', landmarkEmoji: '🪨', funFact: 'India\'s most planned and beautiful city!', color: '#FFD54F' },
  { id: 'ladakh', name: 'Ladakh', emoji: '🏔️', capital: 'Leh', landmark: 'Mountain Monastery', landmarkEmoji: '⛰️', funFact: 'Has the highest motorable road in the world!', color: '#FF8A65' },
  { id: 'lakshadweep', name: 'Lakshadweep', emoji: '🏝️', capital: 'Kavaratti', landmark: 'Coral Islands', landmarkEmoji: '🐠', funFact: 'Made of 36 tiny coral islands in the ocean!', color: '#4DD0E1' },
  { id: 'andaman-nicobar', name: 'Andaman & Nicobar', emoji: '🏝️', capital: 'Port Blair', landmark: 'Crystal Beaches', landmarkEmoji: '🏖️', funFact: 'Has the most beautiful beaches and coral reefs!', color: '#4DB6AC' },
  { id: 'puducherry', name: 'Puducherry', emoji: '🏖️', capital: 'Puducherry', landmark: 'French Colony', landmarkEmoji: '🇫🇷', funFact: 'A tiny French-style town in India!', color: '#E57373' },
  { id: 'dadra-nagar-haveli-daman-diu', name: 'Dadra & Nagar Haveli', emoji: '🌿', capital: 'Daman', landmark: 'Green Valleys', landmarkEmoji: '🌿', funFact: 'Peaceful green valleys and beautiful beaches!', color: '#81C784' },
];

const STAGES = [
  { label: 'Explore', emoji: '🌍', instruction: 'Tap any state to explore India!', dinoLine: 'Let\'s explore India together! Tap a state to learn about it!' },
  { label: 'Discover', emoji: '🔍', instruction: 'Collect all state stickers!', dinoLine: 'Let\'s collect stickers from every state! Tap to discover!' },
  { label: 'Associate', emoji: '🧩', instruction: 'Match the shape to the state name!', dinoLine: 'Can you tell which state this shape belongs to?' },
  { label: 'Capitals', emoji: '🏛️', instruction: 'Travel to each capital city!', dinoLine: 'Let\'s visit each state capital! Tap a state!' },
  { label: 'Recall', emoji: '🧠', instruction: 'What is the capital of this state?', dinoLine: 'Think hard! What\'s the capital of this state?' },
];

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.pitch = 1.2;
    window.speechSynthesis.speak(u);
  }
}

export default function DinoTreasureHuntPage() {
  const [stage, setStage] = useState(0);
  const [discoveredStates, setDiscoveredStates] = useState<Set<string>>(new Set());
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [zoomedState, setZoomedState] = useState<string | null>(null);
  const [showCapital, setShowCapital] = useState<string | null>(null);
  const [showLandmark, setShowLandmark] = useState(false);
  const [collectedStickers, setCollectedStickers] = useState<string[]>([]);
  const [dinoMessage, setDinoMessage] = useState(STAGES[0].dinoLine);
  const [dinoAnim, setDinoAnim] = useState<'idle' | 'jump' | 'wave'>('idle');
  const [quizState, setQuizState] = useState<{ targetId: string; options: string[] } | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const currentStage = STAGES[stage];
  const selectedInfo = selectedState ? ALL_STATES.find(s => s.id === selectedState) : null;

  useEffect(() => {
    if (isFirstVisit) {
      speak(currentStage.dinoLine);
    }
  }, [stage, isFirstVisit]);

  const triggerDino = useCallback((anim: 'jump' | 'wave') => {
    setDinoAnim(anim);
    setTimeout(() => setDinoAnim('idle'), 1200);
  }, []);

  const handleStateClick = useCallback((stateId: string) => {
    const state = ALL_STATES.find(s => s.id === stateId);
    if (!state) return;

    setSelectedState(stateId);

    switch (stage) {
      case 0: {
        setDinoMessage(`This is ${state.name}! ${state.landmarkEmoji}`);
        speak(`This is ${state.name}! ${state.landmark}`);
        triggerDino('jump');
        setShowLandmark(true);
        setTimeout(() => setShowLandmark(false), 3000);
        break;
      }
      case 1: {
        if (discoveredStates.has(stateId)) {
          setDinoMessage(`Welcome back to ${state.name}! ${state.emoji}`);
          speak(`Welcome back to ${state.name}!`);
          triggerDino('wave');
          return;
        }
        const newDiscovered = new Set(discoveredStates);
        newDiscovered.add(stateId);
        setDiscoveredStates(newDiscovered);
        setCollectedStickers(prev => [...prev, state.emoji]);
        setDinoMessage(`You discovered ${state.name}! ${state.emoji}`);
        speak(`You discovered ${state.name}! ${state.funFact}`);
        triggerDino('jump');
        setShowLandmark(true);
        setZoomedState(stateId);
        setTimeout(() => { setShowLandmark(false); setZoomedState(null); }, 2500);
        if (newDiscovered.size >= 5 && stage === 1) {
          setTimeout(() => {
            setDinoMessage('Amazing! You discovered 5 states!');
            speak('Amazing! You discovered 5 states!');
            setShowCelebration(true);
            setTimeout(() => { setShowCelebration(false); }, 2000);
          }, 2800);
        }
        break;
      }
      case 2: {
        if (!quizState) {
          const ids = ALL_STATES.map(s => s.id);
          const shuffled = ids.sort(() => Math.random() - 0.5).slice(0, 4);
          if (!shuffled.includes(stateId)) shuffled[0] = stateId;
          setQuizState({ targetId: stateId, options: shuffled.sort(() => Math.random() - 0.5) });
          setDinoMessage(`Which state is this? ${state.emoji}`);
          speak(`Which state is this?`);
        } else if (quizState.targetId === stateId) {
          setQuizFeedback('correct');
          setDinoMessage(`Correct! This is ${state.name}! 🎉`);
          speak(`Correct! ${state.name}!`);
          triggerDino('jump');
          const newDiscovered = new Set(discoveredStates);
          newDiscovered.add(stateId);
          setDiscoveredStates(newDiscovered);
          setTimeout(() => { setQuizFeedback(null); setQuizState(null); }, 2000);
        } else {
          setQuizFeedback('wrong');
          setDinoMessage(`Not quite! Try again! 💪`);
          speak(`Not quite, try again!`);
          setTimeout(() => setQuizFeedback(null), 1000);
        }
        break;
      }
      case 3: {
        setZoomedState(stateId);
        triggerDino('jump');
        setTimeout(() => setShowCapital(stateId), 500);
        setDinoMessage(`${state.name}! Capital: ${state.capital} ${state.landmarkEmoji}`);
        speak(`Welcome to ${state.name}! The capital is ${state.capital}. Let's visit!`);
        const newDiscovered = new Set(discoveredStates);
        newDiscovered.add(stateId);
        setDiscoveredStates(newDiscovered);
        setTimeout(() => { setShowCapital(null); setZoomedState(null); }, 4000);
        break;
      }
      case 4: {
        const targetState = ALL_STATES[Math.floor(Math.random() * ALL_STATES.length)];
        const wrongCaps = ALL_STATES
          .filter(s => s.capital !== targetState.capital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(s => s.capital);
        const options = [targetState.capital, ...wrongCaps].sort(() => Math.random() - 0.5);
        setQuizState({ targetId: targetState.id, options });
        setDinoMessage(`What is the capital of ${targetState.name}?`);
        speak(`What is the capital of ${targetState.name}?`);
        break;
      }
    }
  }, [stage, discoveredStates, quizState, triggerDino]);

  const handleCapitalQuizAnswer = useCallback((capital: string) => {
    if (!quizState) return;
    const targetState = ALL_STATES.find(s => s.id === quizState.targetId);
    if (!targetState) return;

    if (capital === targetState.capital) {
      setQuizFeedback('correct');
      setDinoMessage(`Correct! ${targetState.capital} is the capital! 🎉`);
      speak(`Correct! ${targetState.capital}!`);
      triggerDino('jump');
      const newDiscovered = new Set(discoveredStates);
      newDiscovered.add(targetState.id);
      setDiscoveredStates(newDiscovered);
      setCollectedStickers(prev => [...prev, targetState.emoji]);
      setTimeout(() => { setQuizFeedback(null); setQuizState(null); }, 2000);
    } else {
      setQuizFeedback('wrong');
      setDinoMessage(`Not quite! The capital is ${targetState.capital}`);
      speak(`The capital of ${targetState.name} is ${targetState.capital}`);
      triggerDino('wave');
      setTimeout(() => { setQuizFeedback(null); setQuizState(null); }, 2500);
    }
  }, [quizState, discoveredStates, triggerDino]);

  const advanceStage = useCallback(() => {
    if (stage < STAGES.length - 1) {
      setStage(s => s + 1);
      setQuizState(null);
      setQuizFeedback(null);
      setSelectedState(null);
      setShowCapital(null);
      setZoomedState(null);
    }
  }, [stage]);

  const resetGame = () => {
    setStage(0);
    setDiscoveredStates(new Set());
    setSelectedState(null);
    setZoomedState(null);
    setShowCapital(null);
    setShowLandmark(false);
    setCollectedStickers([]);
    setQuizState(null);
    setQuizFeedback(null);
    setShowCelebration(false);
    setDinoMessage(STAGES[0].dinoLine);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] via-[#1b2838] to-[#16213e]">
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white text-sm font-medium">← Home</Link>
          <div className="text-center">
            <h1 className="text-white font-light text-sm md:text-lg">🦕 Dino Treasure Hunt</h1>
            <p className="text-yellow-400 text-[10px] md:text-xs flex items-center gap-1">
              <span>{currentStage.emoji}</span>
              <span>{currentStage.label}</span>
              <span className="text-white/30">|</span>
              <span className="text-white/50">{discoveredStates.size}/{ALL_STATES.length} states</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetGame} className="text-white/40 hover:text-white text-xs px-2 py-1 rounded-full border border-white/10 hover:border-white/30 transition-all">
              🔄
            </button>
          </div>
        </div>
      </header>

      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-10 text-center shadow-2xl max-w-sm mx-4 animate-bounce-in">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-3xl font-light text-black mb-2">Amazing!</h2>
            <p className="text-[#6b6b6b] text-sm">Keep exploring India!</p>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Stage Progress */}
        <div className="flex gap-1 mb-4 justify-center">
          {STAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => i <= stage ? setStage(i) : null}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === stage
                  ? 'bg-yellow-400 text-black scale-105'
                  : i < stage
                  ? 'bg-green-500/30 text-green-300'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {i < stage ? '✓' : s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Dino mascot */}
        <div className={`flex items-center gap-3 mb-4 bg-white/5 backdrop-blur-sm rounded-[16px] p-3 transition-all duration-300 ${
          dinoAnim === 'jump' ? 'scale-105' : ''
        }`}>
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl md:text-4xl transition-transform duration-300 ${
            dinoAnim === 'jump' ? 'animate-bounce' : dinoAnim === 'wave' ? 'animate-shake' : ''
          }`}>
            🦕
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm md:text-base font-light leading-snug">{dinoMessage}</p>
            <p className="text-yellow-400/70 text-[10px] mt-0.5">{currentStage.instruction}</p>
          </div>
          <div className="hidden sm:flex gap-1 text-xl flex-shrink-0">
            {collectedStickers.slice(-5).map((s, i) => (
              <span key={i} className="animate-bounce-in" style={{ animationDelay: `${i * 0.08}s` }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Landmark popup */}
        {showLandmark && selectedInfo && (
          <div className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-[16px] p-4 text-center animate-bounce-in border border-yellow-400/20">
            <span className="text-3xl mr-2">{selectedInfo.landmarkEmoji}</span>
            <span className="text-white font-light text-sm">{selectedInfo.landmark}</span>
            <p className="text-white/50 text-xs mt-1">{selectedInfo.funFact}</p>
          </div>
        )}

        {/* Quiz feedback */}
        {quizFeedback === 'correct' && (
          <div className="mb-4 bg-green-500/20 rounded-[16px] p-2 text-center animate-bounce-in">
            <span className="text-green-400 text-sm">✓ Correct! 🎉</span>
          </div>
        )}
        {quizFeedback === 'wrong' && (
          <div className="mb-4 bg-red-500/20 rounded-[16px] p-2 text-center animate-shake">
            <span className="text-red-400 text-sm">✗ Try again!</span>
          </div>
        )}

        {/* Map */}
        <IndiaMap
          onStateClick={handleStateClick}
          discoveredStates={discoveredStates}
          glowingState={selectedState}
          selectedState={selectedState}
          zoomedState={zoomedState}
          showCapital={showCapital}
          stage={stage}
        />

        {/* Stage 2 Quiz: Multiple choice state names */}
        {stage === 2 && quizState && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quizState.options.map((optId) => {
              const optState = ALL_STATES.find(s => s.id === optId);
              return (
                <button
                  key={optId}
                  onClick={() => handleStateClick(optId)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-[12px] p-3 text-sm font-medium transition-all active:scale-95 border border-white/10"
                >
                  {optState?.emoji} {optState?.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Stage 5 Quiz: Multiple choice capitals */}
        {stage === 4 && quizState && (
          <div className="mt-4 space-y-2">
            <p className="text-white/60 text-sm text-center mb-3">
              {ALL_STATES.find(s => s.id === quizState.targetId)?.emoji} {ALL_STATES.find(s => s.id === quizState.targetId)?.name}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quizState.options.map((cap) => (
                <button
                  key={cap}
                  onClick={() => handleCapitalQuizAnswer(cap)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-[12px] p-3 text-sm font-medium transition-all active:scale-95 border border-white/10"
                >
                  🏛️ {cap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sticker collection */}
        <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-[16px] p-3">
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-xs">Stickers: {collectedStickers.length}</p>
            <div className="flex gap-1 text-lg">
              {collectedStickers.length === 0 ? (
                <span className="text-white/20 text-xs">Explore to collect stickers!</span>
              ) : (
                collectedStickers.slice(-10).map((s, i) => (
                  <span key={i} className="animate-bounce-in" style={{ animationDelay: `${i * 0.04}s` }}>{s}</span>
                ))
              )}
            </div>
          </div>
          <div className="mt-2 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${(discoveredStates.size / ALL_STATES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Advance stage button */}
        {stage < STAGES.length - 1 && discoveredStates.size >= 3 && (
          <div className="mt-4 text-center">
            <button onClick={advanceStage} className="ps-btn ps-btn-sm text-sm">
              Next: {STAGES[stage + 1].emoji} {STAGES[stage + 1].label} →
            </button>
          </div>
        )}

        <p className="text-white/20 text-xs text-center mt-4">
          Travel across India with Dino to discover states, landmarks, and capitals!
        </p>
      </main>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-bounce-in { animation: bounceIn 0.4s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}