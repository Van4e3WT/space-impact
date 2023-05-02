import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { CyberShieldIcon } from '../../assets/icons/CyberShieldIcon';
import gunsImage from '../../assets/images/guns-image.png';
import { LIVES_NUMBER } from '../../constants';
import { store } from '../../store/store';
import S from './Play.module.scss';
import { Loading } from './Loading/Loading';

export const Play: React.FC = observer(() => (
  <>
    <span className={S['score']}>
      Score:
      {' '}
      <span className={S['highlight']}>{store.game.playerScore}</span>
    </span>
    <div className={S['controls-group']}>
      <div className={S['controls']}>
        <button
          id="move-left-control"
          type="button"
          aria-label="move left"
          className={cn(S['move-control'], S['move-left-control'])}
        />
        <button
          id="move-right-control"
          type="button"
          aria-label="move right"
          className={cn(S['move-control'], S['move-right-control'])}
        />
      </div>
      <span className={S['lives']}>
        {[...Array(LIVES_NUMBER)].map((_, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className={cn(
              S['life'],
              { [S['life--disabled']]: idx > store.game.playerLives - 1 },
            )}
          >
            <CyberShieldIcon />
          </div>
        ))}
      </span>
    </div>
    <button
      id="player-shoot-control"
      type="button"
      aria-label="shoot"
      className={cn(S['shoot'], { [S['shoot--disabled']]: store.game.gunsCooldown < 1 })}
    >
      <svg viewBox="0 0 100 100">
        <circle className={S['circle-bar']} r="25" cx="50" cy="50" strokeWidth="45" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * store.game.gunsCooldown} />
      </svg>
      <img className={S['guns-img']} src={gunsImage} alt="guns" draggable="false" />
    </button>
    {store.game.loadingProgress < 1 && <Loading progress={store.game.loadingProgress} />}
  </>
));
