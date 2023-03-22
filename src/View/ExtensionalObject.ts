import * as THREE from 'three';

export class ExtensionalObject {
  public creationTime: number;

  public obj: THREE.Object3D;

  public box: THREE.Box3;

  constructor(time: number, obj: THREE.Object3D) {
    this.creationTime = time;
    this.obj = obj;
    this.box = new THREE.Box3().setFromObject(obj);

    this.update();
  }

  public update = () => {
    this.box.copy(new THREE.Box3().setFromObject(this.obj));
  };
}
