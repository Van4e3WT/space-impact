import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { throttleKey } from './helpers/throttleKey';

import NPC from './NPC/NPC';
import Player from './Player/Player';
import ResoursesController from './ResoursesController';

const UNMOUNT_ENEMY_RANGE = -5;
const UNMOUNT_SHOT_RANGE = 75;

export default class View extends ResoursesController {
  private parent: HTMLElement;

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private npc!: NPC;

  private stats: Stats;

  private time: number;

  private player!: Player;

  constructor(root: HTMLElement) {
    super();
    this.parent = root;
    this.time = 0;
    this.stats = Stats();

    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initNPC();
    this.initPlayer();

    document.body.appendChild(this.stats.dom);

    requestAnimationFrame(this.render);
  }

  public addToScene = (node: THREE.Object3D) => {
    this.scene.add(node);
  };

  public destroy = () => {
    this.npc.destroy();
    this.player.destroy();
    document.removeEventListener('keydown', this.handlePlayerShoot);

    super.destroy();

    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.stats.dom.remove();
  };

  private initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.domElement.classList.add('game__canvas');
    this.parent.appendChild(this.renderer.domElement);
  };

  private initScene = () => {
    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight('#FFF9BE', 0.1);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#FFF9BE', 1);
    pointLight.position.set(-1, 2, 4);
    this.scene.add(pointLight);
  };

  private initCamera = () => {
    const canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      90,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );

    // TODO: remove OribtControls on prod
    const controls = new OrbitControls(this.camera, canvas);
    this.camera.position.z = -2;
    this.camera.position.y = 2;
    this.camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
  };

  private initNPC = () => {
    this.npc = new NPC(this.scene);

    // TODO: add speed and generation coefficient
    // TODO: replace interval on something inside render-method
    setInterval(() => this.npc.createEnemy(this.time), 2500);
  };

  private initPlayer = () => {
    this.player = new Player(this.scene);

    document.addEventListener('keydown', this.handlePlayerShoot);
  };

  private render = (time: number) => {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.time = time * 0.001;

    // TODO: move enemies and shots updates into separated methods

    this.npc.enemies.forEach((enemy, index) => {
      const { mesh, creationTime } = enemy;

      if (mesh.position.z > UNMOUNT_ENEMY_RANGE) {
        mesh.position.z -= (this.time - creationTime) * 0.05;
      } else {
        this.npc.enemies = this.npc.enemies.filter((_, idx) => index !== idx);
        this.scene.remove(enemy.mesh);
      }
    });

    this.player.shots.forEach((shot, index) => {
      const { mesh, creationTime } = shot;

      if (mesh.position.z < UNMOUNT_SHOT_RANGE) {
        mesh.position.z = (this.time - creationTime) * 50;
      } else {
        this.player.shots = this.player.shots.filter((_, idx) => index !== idx);
        this.scene.remove(shot.mesh);
      }
    });

    requestAnimationFrame(this.render);

    this.stats.update();

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

  private handlePlayerShoot = throttleKey(' ', () => this.player.shoot(this.time), 500);
}
