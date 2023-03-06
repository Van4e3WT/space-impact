import { observer } from 'mobx-react-lite';

import { Game } from './components/Game/Game';
import { EndScreen } from './modules/EndScreen/EndScreen';
import { Play } from './modules/Play/Play';
import { StartScreen } from './modules/StartScreen/StartScreen';
import { GameStates } from './store/Game/Game.types';
import { store } from './store/store';

const App = observer(() => (
  <div className="App">
    {store.game.state === GameStates.START && <StartScreen />}
    {store.game.state === GameStates.PLAY && (
      <>
        <Game />
        <Play />
      </>
    )}
    {store.game.state === GameStates.END && <EndScreen />}
  </div>
));

export default App;
