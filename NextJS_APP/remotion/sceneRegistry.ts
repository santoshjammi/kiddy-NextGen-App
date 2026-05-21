export type SceneType =
  | 'intro'
  | 'question'
  | 'correct_answer'
  | 'wrong_answer'
  | 'reward_unlock'
  | 'badge_unlock';

export interface SceneConfig {
  id: SceneType;
  componentName: string;
  durationSeconds: number;
  priority: 'P0' | 'P1';
}

export const SCENE_REGISTRY: Record<SceneType, SceneConfig> = {
  intro: {
    id: 'intro',
    componentName: 'IntroScene',
    durationSeconds: 2.0,
    priority: 'P0',
  },
  question: {
    id: 'question',
    componentName: 'QuestionScene',
    durationSeconds: 5.0,
    priority: 'P0',
  },
  correct_answer: {
    id: 'correct_answer',
    componentName: 'CorrectScene',
    durationSeconds: 1.0,
    priority: 'P0',
  },
  wrong_answer: {
    id: 'wrong_answer',
    componentName: 'WrongScene',
    durationSeconds: 1.0,
    priority: 'P0',
  },
  reward_unlock: {
    id: 'reward_unlock',
    componentName: 'RewardScene',
    durationSeconds: 2.0,
    priority: 'P0',
  },
  badge_unlock: {
    id: 'badge_unlock',
    componentName: 'BadgeUnlockScene',
    durationSeconds: 2.0,
    priority: 'P1',
  },
};
