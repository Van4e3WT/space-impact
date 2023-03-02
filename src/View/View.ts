import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { ExtensionalMesh } from './ExtensionalMesh';
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

    this.npc.createEnemy(this.time);

    // TODO: move enemies and shots updates into separated methods

    this.player.shots.forEach((shot, index) => {
      const { mesh, creationTime } = shot;

      if (mesh.position.z < UNMOUNT_SHOT_RANGE) {
        mesh.position.z = (this.time - creationTime) * 50;

        shot.update();
      } else {
        // TODO: stress test comparator (E2E)
        this.player.shots = this.player.shots.filter(this.makeComparator(index));
      }
    });

    this.npc.enemies.forEach((enemy, enemyIndex) => {
      const { mesh: enemyMesh, box: enemyBox, creationTime: enemyTime } = enemy;

      if (enemyMesh.position.z > UNMOUNT_ENEMY_RANGE) {
        enemyMesh.position.z -= (this.time - enemyTime) * 0.05;

        enemy.update();

        // TODO: optimize algorithm
        this.player.shots.forEach(({ box: shotBox }, shotIndex) => {
          if (enemyBox.intersectsBox(shotBox)) {
            this.npc.enemies = this.npc.enemies.filter(this.makeComparator(enemyIndex));
            this.player.shots = this.player.shots.filter(this.makeComparator(shotIndex));
          }
        });
      } else {
        this.npc.enemies = this.npc.enemies.filter(this.makeComparator(enemyIndex));
      }
    });

    this.stats.update();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render);
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

  // TODO: Bind throttleKey to player shoot
  private handlePlayerShoot = throttleKey(' ', () => this.player.shoot(this.time), 500);

  private makeComparator = (removableIndex: number) => (
    extensionalMesh: ExtensionalMesh,
    index: number,
  ) => {
    const isVisible = index !== removableIndex;
    if (!isVisible) this.scene.remove(extensionalMesh.mesh);
    return isVisible;
  };
}
