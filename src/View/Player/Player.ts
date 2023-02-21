import * as THREE from 'three';

import ResoursesController from '../ResoursesController';
import { MeshWithTime } from '../View.types';
import Controls from './Controls/Controls';

export default class Player extends ResoursesController {
  private scene: THREE.Scene;

  private player!: THREE.Mesh;

  private controls!: Controls;

  private shotGeometry: THREE.BufferGeometry;

  private shotMaterial: THREE.Material;

  public shots: Array<MeshWithTime> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;

    this.shotGeometry = this.considerGeometry(new THREE.BoxGeometry(0.3, 0.3, 0.6));
    this.shotMaterial = this.considerMaterial(new THREE.MeshBasicMaterial({ color: '#FF4540' }));

    this.init();
  }

  public destroy = () => {
    this.controls.remove();
    this.scene.remove(this.player);
    super.destroy();
  };

  public shoot = (time: number) => {
    const shot = new THREE.Mesh(this.shotGeometry, this.shotMaterial);

    shot.position.x = this.player.position.x;

    this.shots.push({
      creationTime: time,
      mesh: shot,
    });

    this.scene.add(shot);
  };

  private init = () => {
    const geometry = this.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    const material = this.considerMaterial(new THREE.MeshPhongMaterial({ color: '#44AA88' }));

    this.player = new THREE.Mesh(geometry, material);

    this.scene.add(this.player);

    this.controls = new Controls(this.player);
    this.controls.init();
  };
}
