import { makeAutoObservable } from 'mobx';

import { livesNumber } from '../../constants';
import { GameStates } from './Game.types';

export class Game {
  private gameState: GameStates = GameStates.START;

  private lives: number = 0;

  private score: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get playerLives() {
    return this.lives;
  }

  get playerScore() {
    return this.score;
  }

  get state() {
    return this.gameState;
  }

  public incrementScore = () => {
    this.score += 50;
  };

  public decrementLife = () => {
    this.lives -= 1;

    if (this.lives < 0) this.gameState = GameStates.END;
  };

  public startGame = () => {
    this.lives = livesNumber;
    this.score = 0;
    this.gameState = GameStates.PLAY;
  };
}
