import * as THREE from 'three';

import { getRandom } from '../../utils/getRandom';
import { ExtensionalMesh } from '../ExtensionalMesh';
import ResoursesController from '../ResoursesController';

const SPAWN_RANGE = 100;
const SPAWN_DELTA_LIMIT = 0.25;
const BASIC_SPAWN_DELTA = 2.5;
const TIME_OFFSET = 4;

export default class NPC extends ResoursesController {
  private scene: THREE.Scene;

  private enemyGeometry: THREE.BufferGeometry;

  private enemyMaterial: THREE.Material;

  private lastSpawnTime: number = 0;

  private spawnDelta: number = BASIC_SPAWN_DELTA;

  public enemies: Array<ExtensionalMesh> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;
    this.enemyGeometry = this.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.enemyMaterial = this.considerMaterial(new THREE.MeshPhongMaterial({ color: '#FF4540' }));
  }

  public createEnemy = (time: number) => {
    if (time - this.lastSpawnTime < this.spawnDelta) return;

    const enemy = new ExtensionalMesh(time, this.enemyGeometry, this.enemyMaterial);

    this.lastSpawnTime = time;
    this.spawnDelta = (((time + TIME_OFFSET) ** -1) ** SPAWN_DELTA_LIMIT) * BASIC_SPAWN_DELTA
      + SPAWN_DELTA_LIMIT;

    enemy.mesh.geometry.computeBoundingBox();
    enemy.mesh.position.z = SPAWN_RANGE;
    enemy.mesh.position.x = Math.round(getRandom(-4, 4));

    this.enemies.push(enemy);

    this.scene.add(enemy.mesh);
  };
}
