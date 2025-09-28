
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  CHALLENGE = 'Challenge',
}

export interface Question {
  question: string;
  answer: string;
  solution: string;
}

export type GameStatus = 'LOADING' | 'PLAYING' | 'CORRECT' | 'INCORRECT_FIRST_TRY' | 'INCORRECT_FINAL' | 'WON' | 'ERROR';
