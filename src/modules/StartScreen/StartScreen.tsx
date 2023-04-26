import { store } from '../../store/store';
import { Rules } from './Rules/Rules';
import S from './StartScreen.module.scss';

const rulesList = [
  'Shot costs 10 points;',
  'Destroyed enemy brings 50 points;',
  'Every missed enemy costs 100 points.',
];

export const StartScreen = () => (
  <div className={S['wrapper']}>
    <div className={S['container']}>
      <h1 className={S['title']}>Space Impact</h1>
      <button type="button" onClick={() => store.game.startGame()} className={S['start-button']}>Start</button>
      <div className={S['rules']}>
        <Rules rules={rulesList} />
      </div>
    </div>
  </div>
);
