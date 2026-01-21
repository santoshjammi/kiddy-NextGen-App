// Shared TypeScript types for the application

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface LearningProgress {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  lastAccessed: Date;
}

export interface GameState {
  isPlaying: boolean;
  currentLevel: number;
  score: number;
  timeRemaining?: number;
}