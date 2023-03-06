import { observer } from 'mobx-react-lite';
import { store } from '../../store/store';
import './Play.scss';

export const Play: React.FC = observer(() => (
  <div className="score">
    <span>
      Score:
      {' '}
      {store.game.playerScore}
    </span>
    <br />
    <span>
      Lives:
      {' '}
      {store.game.playerLives}
    </span>
  </div>
));
