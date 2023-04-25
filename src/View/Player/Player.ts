import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { store } from '../../store/store';
import { createRoundedBoxGeometry } from '../../utils/createRoundedBoxGeometry';
import { normalize } from '../../utils/normalize';
import { ExtensionalObject } from '../ExtensionalObject';
import ResoursesController from '../ResoursesController';
import Controls from './Controls/Controls';

const SHOT_COOLDOWN_SEC = 0.5;
const SHOT_OFFSET_X = 0.4;
const SPACESHIP_SCALE = 0.273;

export default class Player extends ResoursesController {
  private scene: THREE.Scene;

  private player: ExtensionalObject | null = null;

  private controls: Controls | null = null;

  private playerModelMaterial: THREE.Material | null = null;

  private playerFlickeringMaterial: THREE.Material;

  private shotGeometry: THREE.BufferGeometry;

  private shotMaterial: THREE.Material;

  private lastShotTime = 0;

  public shots: Array<ExtensionalObject> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;

    this.shotGeometry = this.considerGeometry(createRoundedBoxGeometry(0.1, 0.05, 0.3, 0.05, 1));
    this.shotMaterial = this.considerMaterial(new THREE.MeshBasicMaterial({ color: '#FF4540' }));
    this.playerFlickeringMaterial = this.considerMaterial(new THREE.MeshBasicMaterial({
      opacity: 0,
      transparent: true,
    }));

    this.init();
  }

  get box() {
    return this.player?.box;
  }

  public destroy = () => {
    if (this.player) this.scene.remove(this.player.obj);
    this.controls?.remove();
    super.destroy();
  };

  public updateCooldown = (time: number) => {
    const delta = time - this.lastShotTime;

    store.game.gunsCooldown = normalize(
      delta > SHOT_COOLDOWN_SEC ? SHOT_COOLDOWN_SEC : delta,
      0,
      SHOT_COOLDOWN_SEC,
    );
  };

  public shoot = (time: number) => {
    if (!this.player || time - this.lastShotTime < SHOT_COOLDOWN_SEC) return;

    store.game.decrementScore();

    this.lastShotTime = time;

    const leftGunShot = new ExtensionalObject(
      time,
      new THREE.Mesh(this.shotGeometry, this.shotMaterial),
    );

    leftGunShot.obj.position.x = this.player.obj.position.x + SHOT_OFFSET_X;
    leftGunShot.obj.position.y = this.player.obj.position.y;

    const rightGunShot = new ExtensionalObject(
      time,
      new THREE.Mesh(this.shotGeometry, this.shotMaterial),
    );

    rightGunShot.obj.position.x = this.player.obj.position.x - SHOT_OFFSET_X;
    rightGunShot.obj.position.y = this.player.obj.position.y;

    this.shots.push(leftGunShot, rightGunShot);

    this.scene.add(leftGunShot.obj, rightGunShot.obj);
  };

  public toggleModel = (isToggle = false) => {
    if (!(this.player?.obj instanceof THREE.Group) || !this.playerModelMaterial) return;

    this.player.obj.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // eslint-disable-next-line no-param-reassign
      obj.material = isToggle ? this.playerFlickeringMaterial : this.playerModelMaterial;
    });
  };

  private init = () => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(`${process.env.PUBLIC_URL}/models/spaceship.glb`, (model) => {
      model.scene.scale.set(SPACESHIP_SCALE, SPACESHIP_SCALE, SPACESHIP_SCALE);
      this.player = new ExtensionalObject(0, model.scene);

      model.scene.rotateY(Math.PI);

      const defaultObj = model.scene.getObjectByName('defaultMaterial');
      if (defaultObj instanceof THREE.Mesh) this.playerModelMaterial = defaultObj.material;

      this.scene.add(this.player.obj);

      this.controls = new Controls(this.player);
      this.controls.init();
    });
  };
}
