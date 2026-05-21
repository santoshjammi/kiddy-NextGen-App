export type { DifficultyLevel, SubjectProgress } from '../useSubjectProgress';

export type Operation = '+' | '-' | '*';

export interface ProblemState {
  operation: Operation;
  operands: number[];
  difficultyLevel: import('../useSubjectProgress').DifficultyLevel;
}
