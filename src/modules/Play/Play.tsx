import { observer } from 'mobx-react-lite';

import { HeartIcon } from '../../assets/icons/HeartIcon';
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
      {[...Array(store.game.playerLives)].map((_, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={idx} className={S['life']}>
          <HeartIcon />
        </div>
      ))}
    </span>
  </>
));
