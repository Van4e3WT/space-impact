import { store } from '../../store/store';
import './StartScreen.scss';

export const StartScreen = () => (
  <button type="button" onClick={() => store.game.startGame()} className="start-button">Start</button>
);
