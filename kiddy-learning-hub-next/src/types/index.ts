export interface LearningApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

export interface GameProgress {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
}