import { store } from '../../store/store';
import S from './EndScreen.module.scss';

export const EndScreen = () => (
  <div className={S['wrapper']}>
    <div className={S['container']}>
      <h1 className={S['title']}>Game over</h1>
      <span className={S['score']}>
        Your score:
        {' '}
        <span className={S['highlight']}>{store.game.playerScore}</span>
        {' '}
        points
      </span>
      <button
        type="button"
        onClick={() => store.game.startGame()}
        className={S['restart-button']}
      >
        Restart
      </button>
    </div>
  </div>
);
