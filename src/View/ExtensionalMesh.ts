import * as THREE from 'three';

export class ExtensionalMesh {
  public creationTime: number;

  public mesh: THREE.Mesh;

  public box: THREE.Box3 = new THREE.Box3();

  constructor(time: number, ...args: ConstructorParameters<typeof THREE.Mesh>) {
    this.creationTime = time;
    this.mesh = new THREE.Mesh(...args);
    this.mesh.geometry.computeBoundingBox();

    this.initBox();
  }

  private initBox = () => {
    if (!this.mesh.geometry.boundingBox) return;

    this.box.copy(this.mesh.geometry.boundingBox);
    this.box.applyMatrix4(this.mesh.matrixWorld);
  };
}
