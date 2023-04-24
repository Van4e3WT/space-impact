import { makeAutoObservable } from 'mobx';

import { LIVES_NUMBER } from '../../constants';
import { GameStates } from './Game.types';

export class Game {
  private gameState: GameStates = GameStates.START;

  private lives: number = 0;

  private score: number = 0;

  private cooldown: number = 0;

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

  public incrementScore = () => {
    this.score += 50;
  };

  public decrementLife = () => {
    this.lives -= 1;

    if (this.lives < 0) this.gameState = GameStates.END;
  };

  public startGame = () => {
    this.lives = LIVES_NUMBER;
    this.score = 0;
    this.gameState = GameStates.PLAY;
  };
}
