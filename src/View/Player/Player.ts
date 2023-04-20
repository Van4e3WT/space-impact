import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { ExtensionalObject } from '../ExtensionalObject';
import ResoursesController from '../ResoursesController';
import Controls from './Controls/Controls';

const SHOT_OFFSET_Y = 0.08;
const SPACESHIP_SCALE = 0.3;

export default class Player extends ResoursesController {
  private scene: THREE.Scene;

  private player: ExtensionalObject | null = null;

  private controls: Controls | null = null;

  private shotGeometry: THREE.BufferGeometry;

  private shotMaterial: THREE.Material;

  public shots: Array<ExtensionalObject> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;

    this.shotGeometry = this.considerGeometry(new THREE.BoxGeometry(0.15, 0.15, 0.4));
    this.shotMaterial = this.considerMaterial(new THREE.MeshBasicMaterial({ color: '#FF4540' }));

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

  public shoot = (time: number) => {
    if (!this.player) return;

    const shot = new ExtensionalObject(time, new THREE.Mesh(this.shotGeometry, this.shotMaterial));

    shot.obj.position.x = this.player.obj.position.x;
    shot.obj.position.y = this.player.obj.position.y + SHOT_OFFSET_Y;

    this.shots.push(shot);

    this.scene.add(shot.obj);
  };

  private init = () => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(`${process.env.PUBLIC_URL}/models/spaceship.glb`, (model) => {
      model.scene.scale.set(SPACESHIP_SCALE, SPACESHIP_SCALE, SPACESHIP_SCALE);
      this.player = new ExtensionalObject(0, model.scene);

      model.scene.rotateY(Math.PI);

      this.scene.add(this.player.obj);

      this.controls = new Controls(this.player);
      this.controls.init();
    });
  };
}
