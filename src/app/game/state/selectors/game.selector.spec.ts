import { deepClone } from '../../../shared/utilities/deep-clone';
import { Game } from '../models/game.model';
import { initialState } from '../reducers/game.reducer';
import * as selectors from './game.selector';

describe('GameSelectors', () => {
  const state: Game = deepClone(initialState)

  it('should get game state', () => {
    const result = selectors.selectGameState.projector(state);

    expect(result).toEqual(result);
  });

  it('should get number of guesses', () => {
    const result = selectors.selectGuesses.projector(state);

    expect(result).toEqual(initialState.guesses);
  });

  it('should get game state', () => {
    const result = selectors.selectIsPlayingMusic.projector(state);

    expect(result).toBe(initialState.isPlayingMusic);
  });
});
