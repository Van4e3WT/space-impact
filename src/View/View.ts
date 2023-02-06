import * as THREE from 'three';

import { SceneItems } from './View.types';

export default class View {
  private parent: HTMLElement;

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private geometries: Array<THREE.BufferGeometry> = [];

  private materials: Array<THREE.Material> = [];

  private textures: Array<THREE.Texture> = [];

  private sceneItems: SceneItems = {};

  constructor(root: HTMLElement) {
    this.parent = root;

    this.initRenderer();
    this.initScene();
    this.initCamera();

    this.render();
  }

  public destroy = () => {
    const dispose = <T extends { dispose: () => void }>(element: T) => {
      element.dispose();
    };

    Object.values(this.sceneItems).forEach((sceneItem) => {
      this.scene.remove(sceneItem);
    });

    this.geometries.forEach(dispose);
    this.materials.forEach(dispose);
    this.textures.forEach(dispose);

    this.renderer.dispose();
    this.renderer.domElement.remove();
  };

  private initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.domElement.classList.add('game__canvas');
    this.parent.appendChild(this.renderer.domElement);
  };

  private initScene = () => {
    const light = new THREE.DirectionalLight('#FFF9BE', 1);
    light.position.set(-1, 2, 4);

    this.scene = new THREE.Scene();

    this.scene.add(light);

    this.addSceneItems();
  };

  private initCamera = () => {
    const canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      90,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );

    this.camera.position.z = 2;
  };

  private addSceneItems = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometries.push(geometry);

    const material = new THREE.MeshPhongMaterial({ color: '#44AA88' });
    this.materials.push(material);

    const cube = new THREE.Mesh(geometry, material);
    this.sceneItems.cube = cube;

    this.scene.add(cube);
  };

  private render = () => {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    requestAnimationFrame(this.render);

    const { cube } = this.sceneItems;

    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
    const pixelRatio = window.devicePixelRatio;
    const canvas = renderer.domElement;

    const width = canvas.clientWidth * pixelRatio;
    const height = canvas.clientHeight * pixelRatio;

    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  };
}
