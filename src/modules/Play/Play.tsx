import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { HeartIcon } from '../../assets/icons/HeartIcon';
import { livesNumber } from '../../constants';
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
      {[...Array(livesNumber)].map((_, idx) => (
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
  </>
));
