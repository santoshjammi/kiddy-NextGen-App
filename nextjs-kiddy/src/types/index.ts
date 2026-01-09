export interface LearningApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  totalSteps: number;
  route: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  age?: number;
  totalPoints: number;
}

export interface LearningProgress {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  lastAccessed: Date;
}