import { store } from '../../store/store';
import S from './EndScreen.module.scss';

export const EndScreen = () => (
  <div className={S['container']}>
    <h1 className={S['title']}>Game over</h1>
    <button
      type="button"
      onClick={() => store.game.startGame()}
      className={S['restart-button']}
    >
      Restart
    </button>
  </div>
);
