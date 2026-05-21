export type GameEvent =
  | 'GAME_START'
  | 'QUESTION_START'
  | 'CORRECT_ANSWER'
  | 'WRONG_ANSWER'
  | 'HINT_TRIGGER'
  | 'LEVEL_COMPLETE'
  | 'STREAK_REWARD'
  | 'BADGE_UNLOCK'
  | 'SESSION_COMPLETE';

export interface EventPayload {
  subject?: 'math' | 'english';
  world?: 'ocean' | 'farm' | 'jungle' | 'space';
  mascot?: 'bunny' | 'owl' | 'robot' | 'dino';
  payload?: {
    difficulty?: number;
    mastery?: number;
    points?: number;
    rewards?: string[];
    streak?: number;
    correctCount?: number;
    totalCount?: number;
  };
}

type EventCallback = (payload: EventPayload) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  on(event: GameEvent, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event: GameEvent, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: GameEvent, payload: EventPayload = {}) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb(payload));
  }
}

export const eventBus = new EventBus();
export default eventBus;
