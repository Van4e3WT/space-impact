import { FieldBounds } from '../../../constants';
import { ExtensionalObject } from '../../ExtensionalObject';

const MOVE_STEP = 0.075;
const KEY_REFRESH_LATENCY = 10;

export default class Controls {
  private item: ExtensionalObject;

  private keyIsDown: { [key: string]: boolean } = {};

  private keyDownHandlers: Array<(e: KeyboardEvent) => void> = [];

  private keyUpHandlers: Array<(e: KeyboardEvent) => void> = [];

  constructor(item: ExtensionalObject) {
    this.item = item;
  }

  public init = () => {
    const handleMoveLeft = () => {
      if (this.item.obj.position.x > FieldBounds.MAX) return;

      this.item.obj.position.x += MOVE_STEP;
      this.item.update();
    };

    const handleMoveRight = () => {
      if (this.item.obj.position.x < FieldBounds.MIN) return;

      this.item.obj.position.x -= MOVE_STEP;
      this.item.update();
    };

    this.addKeyControl('KeyA', handleMoveLeft);
    this.addKeyControl('ArrowLeft', handleMoveLeft);

    this.addKeyControl('KeyD', handleMoveRight);
    this.addKeyControl('ArrowRight', handleMoveRight);
  };

  public remove = () => {
    this.keyDownHandlers.forEach((handler) => {
      document.removeEventListener('keydown', handler);
    });

    this.keyUpHandlers.forEach((handler) => {
      document.removeEventListener('keyup', handler);
    });
  };

  private addKeyControl = (code: string, onInteraction: () => void) => {
    let interval: NodeJS.Timer;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== code || this.keyIsDown[code]) return;

      interval = setInterval(onInteraction, KEY_REFRESH_LATENCY);
      this.keyIsDown[code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== code) return;

      clearInterval(interval);
      this.keyIsDown[code] = false;
    };

    this.keyDownHandlers.push(handleKeyDown);
    this.keyUpHandlers.push(handleKeyUp);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  };
}
