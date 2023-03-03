import * as THREE from 'three';

import { ExtensionalMesh } from '../ExtensionalMesh';
import ResoursesController from '../ResoursesController';
import Controls from './Controls/Controls';

export default class Player extends ResoursesController {
  private scene: THREE.Scene;

  private player!: ExtensionalMesh;

  private controls!: Controls;

  private shotGeometry: THREE.BufferGeometry;

  private shotMaterial: THREE.Material;

  public shots: Array<ExtensionalMesh> = [];

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;

    this.shotGeometry = this.considerGeometry(new THREE.BoxGeometry(0.3, 0.3, 0.6));
    this.shotMaterial = this.considerMaterial(new THREE.MeshBasicMaterial({ color: '#FF4540' }));

    this.init();
  }

  get box() {
    return this.player.box;
  }

  public destroy = () => {
    this.controls.remove();
    this.scene.remove(this.player.mesh);
    super.destroy();
  };

  public shoot = (time: number) => {
    const shot = new ExtensionalMesh(time, this.shotGeometry, this.shotMaterial);

    shot.mesh.position.x = this.player.mesh.position.x;

    this.shots.push(shot);

    this.scene.add(shot.mesh);
  };

  private init = () => {
    const geometry = this.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    const material = this.considerMaterial(new THREE.MeshPhongMaterial({ color: '#44AA88' }));

    this.player = new ExtensionalMesh(0, geometry, material);

    this.scene.add(this.player.mesh);

    this.controls = new Controls(this.player);
    this.controls.init();
  };
}
