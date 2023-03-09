import { store } from '../../store/store';
import S from './StartScreen.module.scss';

export const StartScreen = () => (
  <div className={S['container']}>
    <h1 className={S['title']}>Space Impact</h1>
    <button type="button" onClick={() => store.game.startGame()} className={S['start-button']}>Start</button>
  </div>
);
