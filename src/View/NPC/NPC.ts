import * as THREE from 'three';

import { getRandom } from '../../utils/getRandom';
import ResoursesController from '../ResoursesController';
import { MeshWithTime } from '../View.types';

const SPAWN_RANGE = 100;

export default class Enemies extends ResoursesController {
  private scene: THREE.Scene;

  private enemyGeometry: THREE.BufferGeometry;

  private enemyMaterial: THREE.Material;

  public enemies: Array<MeshWithTime> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;
    this.enemyGeometry = this.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.enemyMaterial = this.considerMaterial(new THREE.MeshPhongMaterial({ color: '#FF4540' }));
  }

  public createEnemy = (time: number) => {
    const enemy = new THREE.Mesh(this.enemyGeometry, this.enemyMaterial);

    enemy.position.z = SPAWN_RANGE;
    enemy.position.x = Math.round(getRandom(-5, 5));

    this.enemies.push({
      creationTime: time,
      mesh: enemy,
    });

    this.scene.add(enemy);
  };
}
