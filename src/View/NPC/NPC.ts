import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { fieldBounds } from '../../constants';
import { getRandom } from '../../utils/getRandom';
import { ExtensionalObject } from '../ExtensionalObject';
import ResoursesController from '../ResoursesController';

const SPAWN_RANGE = 100;
const SPEED_GROWING_EXPONENT = 5;
const BASIC_SPAWN_DELTA = 2.5;
const BASIC_DECREMENT_POINT = 1.5;
const ENEMY_SCALE = 0.03125;

export default class NPC extends ResoursesController {
  private scene: THREE.Scene;

  private enemyObject: THREE.Object3D | null = null;

  private lastSpawnTime: number = 0;

  private spawnDelta: number = BASIC_SPAWN_DELTA;

  public enemies: Array<ExtensionalObject> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(`${process.env.PUBLIC_URL}/models/enemy.gltf`, (model) => {
      model.scene.scale.set(ENEMY_SCALE, ENEMY_SCALE, ENEMY_SCALE);
      model.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
      this.enemyObject = model.scene;
    });
  }

  public createEnemy = (time: number) => {
    if (time - this.lastSpawnTime < this.spawnDelta) return;

    if (!this.enemyObject) return;

    const enemy = new ExtensionalObject(time, this.enemyObject.clone());

    this.lastSpawnTime = time;
    this.spawnDelta -= ((BASIC_SPAWN_DELTA - this.spawnDelta + BASIC_DECREMENT_POINT) ** -1)
      ** SPEED_GROWING_EXPONENT;

    enemy.obj.position.z = SPAWN_RANGE;
    enemy.obj.position.x = Math.round(getRandom(fieldBounds.min, fieldBounds.max));

    this.enemies.push(enemy);

    this.scene.add(enemy.obj);
  };
}
