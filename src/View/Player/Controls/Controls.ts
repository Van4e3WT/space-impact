import { FieldBounds } from '../../../constants';
import { wrapToInterval } from '../../../utils/wrapToInterval';
import { ExtensionalObject } from '../../ExtensionalObject';

const MOVE_STEP = 0.075;
const KEY_REFRESH_LATENCY = 10;
const MOVE_LEFT_CONTROL = '#move-left-control';
const MOVE_RIGHT_CONTROL = '#move-right-control';

export default class Controls {
  private item: ExtensionalObject;

  private keyIsDown: { [key: string]: boolean } = {};

  private keyDownHandlers: Array<(e: KeyboardEvent) => void> = [];

  private keyUpHandlers: Array<(e: KeyboardEvent) => void> = [];

  private moveLeftHandlers!: [() => void, () => void];

  private moveRightHandlers!: [() => void, () => void];

  private moveLeftControl: HTMLElement | null = null;

  private moveRightControl: HTMLElement | null = null;

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

    this.moveLeftHandlers = wrapToInterval(handleMoveLeft, KEY_REFRESH_LATENCY);
    this.moveRightHandlers = wrapToInterval(handleMoveRight, KEY_REFRESH_LATENCY);

    this.moveLeftControl = document.querySelector(MOVE_LEFT_CONTROL);
    this.moveRightControl = document.querySelector(MOVE_RIGHT_CONTROL);

    this.addKeyControl(['KeyA', 'ArrowLeft'], handleMoveLeft);
    this.addKeyControl(['KeyD', 'ArrowRight'], handleMoveRight);

    if (this.moveLeftControl) {
      const [handleMoveStart, handleMoveEnd] = this.moveLeftHandlers;

      this.moveLeftControl.addEventListener('pointerdown', handleMoveStart);
      this.moveLeftControl.addEventListener('pointerup', handleMoveEnd);
      this.moveLeftControl.addEventListener('pointercancel', handleMoveEnd);
    }

    if (this.moveRightControl) {
      const [handleMoveStart, handleMoveEnd] = this.moveRightHandlers;

      this.moveRightControl.addEventListener('pointerdown', handleMoveStart);
      this.moveRightControl.addEventListener('pointerup', handleMoveEnd);
      this.moveRightControl.addEventListener('pointercancel', handleMoveEnd);
    }
  };

  public remove = () => {
    this.keyDownHandlers.forEach((handler) => {
      document.removeEventListener('keydown', handler);
    });

    this.keyUpHandlers.forEach((handler) => {
      document.removeEventListener('keyup', handler);
    });

    if (this.moveLeftControl) {
      const [handleMoveStart, handleMoveEnd] = this.moveLeftHandlers;

      this.moveLeftControl.removeEventListener('pointerdown', handleMoveStart);
      this.moveLeftControl.removeEventListener('pointerup', handleMoveEnd);
      this.moveLeftControl.removeEventListener('pointercancel', handleMoveEnd);
    }

    if (this.moveRightControl) {
      const [handleMoveStart, handleMoveEnd] = this.moveRightHandlers;

      this.moveRightControl.removeEventListener('pointerdown', handleMoveStart);
      this.moveRightControl.removeEventListener('pointerup', handleMoveEnd);
      this.moveRightControl.removeEventListener('pointercancel', handleMoveEnd);
    }
  };

  private addKeyControl = (codes: Array<string>, onInteraction: () => void) => {
    const [startExecution, finishExecution] = wrapToInterval(onInteraction, KEY_REFRESH_LATENCY);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!codes.some((code) => e.code === code) || this.keyIsDown[codes.toString()]) return;

      startExecution();
      this.keyIsDown[codes.toString()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!codes.some((code) => e.code === code)) return;

      finishExecution();
      this.keyIsDown[codes.toString()] = false;
    };

    this.keyDownHandlers.push(handleKeyDown);
    this.keyUpHandlers.push(handleKeyUp);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  };
}
