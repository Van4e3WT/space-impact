import * as THREE from 'three';

export default class AxisGrid {
  private isVisible = false;

  public grid: THREE.GridHelper;

  public axes: THREE.AxesHelper;

  constructor(node: THREE.Object3D, units = 10) {
    const grid = new THREE.GridHelper(units, units);
    if (!(grid.material instanceof Array)) grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    const axes = new THREE.AxesHelper();
    if (!(axes.material instanceof Array)) axes.material.depthTest = false;
    axes.renderOrder = 2;
    node.add(axes);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }

  get visible() {
    return this.isVisible;
  }

  set visible(v: boolean) {
    this.isVisible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
