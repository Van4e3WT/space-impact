import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { HeartIcon } from '../../assets/icons/HeartIcon';
import gunsImage from '../../assets/images/guns-image.png';
import { LIVES_NUMBER } from '../../constants';
import { store } from '../../store/store';
import S from './Play.module.scss';

export const Play: React.FC = observer(() => (
  <>
    <span className={S['score']}>
      Score:
      {' '}
      <span className={S['highlight']}>{store.game.playerScore}</span>
    </span>
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
          <HeartIcon />
        </div>
      ))}
    </span>
    <div className={cn(S['cooldown'], { [S['cooldown--disabled']]: store.game.gunsCooldown < 1 })}>
      <svg viewBox="0 0 100 100">
        <circle className={S['circle-bar']} r="25" cx="50" cy="50" strokeWidth="45" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * store.game.gunsCooldown} />
      </svg>
      <img className={S['guns-img']} src={gunsImage} alt="guns" />
    </div>
  </>
));
