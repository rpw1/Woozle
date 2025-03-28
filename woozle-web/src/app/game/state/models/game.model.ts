import { Guess } from '../../models/guess';
import { GameState } from './game-state.model';
import { Track } from '../../content/state/models/track';

export interface Game {
  guesses: Guess[],
  numberOfGuesses: number,
  isPlayingMusic: boolean,
  currentGameState: GameState
  solution: Track,
  solutions: Track[],
  solutionIndex: number,
  deviceId?: number
}
