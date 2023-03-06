import { store } from '../../store/store';
import './EndScreen.scss';

export const EndScreen = () => (
  <button type="button" onClick={() => store.game.startGame()} className="restart-button">Restart</button>
);
