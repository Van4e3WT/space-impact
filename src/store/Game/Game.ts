import { makeAutoObservable } from 'mobx';

import { LIVES_NUMBER } from '../../constants';
import { GameStates } from './Game.types';

export class Game {
  private gameState: GameStates = GameStates.START;

  private lives: number = 0;

  private score: number = 0;

  private cooldown: number = 0;

  private loading: number = 0;

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

  get gunsCooldown() {
    return this.cooldown;
  }

  set gunsCooldown(value: number) {
    this.cooldown = value;
  }

  get loadingProgress() {
    return this.loading;
  }

  set loadingProgress(value: number) {
    this.loading = value;
  }

  public incrementScore = (value: number) => {
    this.score += value;
  };

  public decrementScore = (value: number) => {
    this.score -= value;
  };

  public decrementLife = (value = 1) => {
    this.lives -= value;

    if (this.lives < 0) this.gameState = GameStates.END;
  };

  public startGame = () => {
    this.lives = LIVES_NUMBER;
    this.score = 0;
    this.gameState = GameStates.PLAY;
  };
}
