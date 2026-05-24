export type AudioSFX = 'correct' | 'wrong' | 'click' | 'coin' | 'badge' | 'cheer';

export type VoiceLineType = 'great_job' | 'wow' | 'amazing' | 'try_again' | 'lets_count' | 'streak';

const VOICE_LINES: Record<VoiceLineType, string[]> = {
  great_job: ['Great job!', 'Fantastic!', 'Excellent work!', 'Super!'],
  wow: ['Wow!', 'Sensational!', 'Incredible!', 'Awesome!'],
  amazing: ['Amazing!', 'You are a star!', 'Brilliant!'],
  try_again: ['Let us try that again!', 'Give it another go!', 'You can do it!'],
  lets_count: ['Let us count together!', 'Ready? Let us count!'],
  streak: ['Incredible streak!', 'You are on fire!', 'Unstoppable!'],
};

class AudioEngine {
  private activeMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  // Synthesis speak method with child-friendly pitch/rate
  speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance; // Retain reference to prevent V8 garbage collection

    // Attempt to locate a kid-friendly / high-quality voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer friendly English voices
    const preferredVoice = voices.find(
      v =>
        v.lang.startsWith('en-US') &&
        (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.pitch = 1.35; // Cute kid-friendly high pitch
    utterance.rate = 0.85;  // Friendly slow pace

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    const cleanup = () => {
      if (this.activeUtterance === utterance) {
        this.activeUtterance = null;
      }
      if (onEnd) onEnd();
    };

    utterance.onend = cleanup;
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      cleanup();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Plays a randomized friendly voice line for the mascot
  playVoiceLine(type: VoiceLineType, onStart?: () => void, onEnd?: () => void) {
    const lines = VOICE_LINES[type];
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    this.speak(randomLine, onStart, onEnd);
  }

  // Play sound effects (uses synthesized audio context tones or custom URLs if needed)
  playSFX(sfx: AudioSFX) {
    if (this.isMuted || typeof window === 'undefined') return;

    try {
      // Create high-quality procedural synthetic sound effects using Web Audio API!
      // This is extremely premium because it works instantly with zero loading lag, 
      // zero external dependencies, and sounds exactly like classic arcade chimes!
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      
      if (sfx === 'correct') {
        // Double ding chime
        this.playTone(ctx, 523.25, 0.1, 'sine', 0); // C5
        this.playTone(ctx, 659.25, 0.15, 'sine', 0.08); // E5
        this.playTone(ctx, 783.99, 0.25, 'sine', 0.16); // G5
      } else if (sfx === 'wrong') {
        // Two low boop tones
        this.playTone(ctx, 220.00, 0.18, 'triangle', 0); // A3
        this.playTone(ctx, 196.00, 0.22, 'triangle', 0.1); // G3
      } else if (sfx === 'click') {
        this.playTone(ctx, 600, 0.05, 'sine', 0, 0.1);
      } else if (sfx === 'coin') {
        // Classic arcade coin collect sound
        this.playTone(ctx, 987.77, 0.08, 'sine', 0); // B5
        this.playTone(ctx, 1318.51, 0.25, 'sine', 0.06); // E6
      } else if (sfx === 'badge') {
        // High ascending scale
        this.playTone(ctx, 523.25, 0.08, 'sine', 0);
        this.playTone(ctx, 587.33, 0.08, 'sine', 0.06);
        this.playTone(ctx, 659.25, 0.08, 'sine', 0.12);
        this.playTone(ctx, 698.46, 0.08, 'sine', 0.18);
        this.playTone(ctx, 783.99, 0.25, 'sine', 0.24);
      } else if (sfx === 'cheer') {
        // Magical sweep tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.warn('Web Audio SFX failed to play:', e);
    }
  }

  // Private Web Audio helper
  private playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay: number = 0,
    volume: number = 0.12
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  }

  // Handle background ambient soundtrack matching the world
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playBackgroundMusic(world: 'ocean' | 'farm' | 'jungle' | 'space') {
    if (typeof window === 'undefined' || this.isMuted) return;
    
    this.stopBackgroundMusic();
    
    // We can use royalty-free ambient music loops or simple synthesis.
    // For local resilience and zero assets network overhead, we use standard assets or silence.
    // In production, we'd initialize:
    // this.activeMusic = new Audio(`/assets/audio/music/${world}.mp3`);
    // this.activeMusic.loop = true;
    // this.activeMusic.volume = 0.1;
    // this.activeMusic.play().catch(() => {});
  }

  stopBackgroundMusic() {
    if (this.activeMusic) {
      this.activeMusic.pause();
      this.activeMusic = null;
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBackgroundMusic();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        this.activeUtterance = null;
      }
    }
  }

  stopAll() {
    this.stopBackgroundMusic();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
