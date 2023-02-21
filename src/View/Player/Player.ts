import * as THREE from 'three';

import ResoursesController from '../ResoursesController';
import Controls from './Controls/Controls';

export default class Player extends ResoursesController {
  private scene: THREE.Scene;

  private player!: THREE.Mesh;

  private controls!: Controls;

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;

    this.init();
  }

  public destroy = () => {
    this.controls.remove();
    this.scene.remove(this.player);
    super.destroy();
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
