import * as THREE from 'three';

import { getRandom } from '../../utils/getRandom';
import { ExtensionalMesh } from '../ExtensionalMesh';
import ResoursesController from '../ResoursesController';

const SPAWN_RANGE = 100;

export default class NPC extends ResoursesController {
  private scene: THREE.Scene;

  private enemyGeometry: THREE.BufferGeometry;

  private enemyMaterial: THREE.Material;

  public enemies: Array<ExtensionalMesh> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;
    this.enemyGeometry = this.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.enemyMaterial = this.considerMaterial(new THREE.MeshPhongMaterial({ color: '#FF4540' }));
  }

  public createEnemy = (time: number) => {
    const enemy = new ExtensionalMesh(time, this.enemyGeometry, this.enemyMaterial);

    enemy.mesh.geometry.computeBoundingBox();
    enemy.mesh.position.z = SPAWN_RANGE;
    enemy.mesh.position.x = Math.round(getRandom(-5, 5));

    this.enemies.push(enemy);

    this.scene.add(enemy.mesh);
  };
}
