import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { FieldBounds, BloomParams } from '../constants';
import { lineFragment } from '../shaders/lineFragment';
import { lineVertex } from '../shaders/lineVertex';
import { store } from '../store/store';
import { ExtensionalObject } from './ExtensionalObject';
import NPC from './NPC/NPC';
import Player from './Player/Player';
import ResoursesController from './ResoursesController';
import Stars from './Stars/Stars';

const UNMOUNT_ENEMY_RANGE = -5;
const UNMOUNT_SHOT_RANGE = 150;
const LINE_OFFSET = 0.5;
const MISSED_ENEMY_COST = 100;
const ENEMY_COST = 50;

export default class View extends ResoursesController {
  private requestId: number;

  private parent: HTMLElement;

  private renderer!: THREE.WebGLRenderer;

  private composer!: EffectComposer;

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private stars!: Stars;

  private npc!: NPC;

  private loadingManager!: THREE.LoadingManager;

  private stats: Stats;

  private time: number;

  private player!: Player;

  constructor(root: HTMLElement) {
    super();
    this.parent = root;
    this.time = 0;
    this.stats = Stats();

    this.initLoadingManager();
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initComposer();
    this.initStars();
    this.initNPC();
    this.initPlayer();

    document.body.appendChild(this.stats.dom);

    this.requestId = requestAnimationFrame(this.render);
  }

  public addToScene = (node: THREE.Object3D) => {
    this.scene.add(node);
  };

  public destroy = () => {
    cancelAnimationFrame(this.requestId);

    this.player.playerShootControl?.removeEventListener('pointerdown', this.handlePlayerShoot);
    document.removeEventListener('keydown', this.handlePlayerShoot);

    this.npc.destroy();
    this.player.destroy();
    this.stars.destroy();

    super.destroy();

    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.stats.dom.remove();
  };

  private initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.domElement.classList.add('game__canvas');
    this.parent.appendChild(this.renderer.domElement);
  };

  private initScene = () => {
    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.3);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#FFFFFF', 1);
    pointLight.position.set(-1, 2, 4);
    this.scene.add(pointLight);
    // TODO: add equirectangular background

    this.initLines();
  };

  private initLines = () => {
    const lineMaterial = this.considerMaterial(new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('#05FFFF') },
        origin: { value: new THREE.Vector3() },
        limitDistance: { value: 100 },
      },
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      transparent: true,
    }));

    const lineGeometryMin = this.considerGeometry(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(FieldBounds.MIN - LINE_OFFSET, 0, UNMOUNT_ENEMY_RANGE),
      new THREE.Vector3(FieldBounds.MIN - LINE_OFFSET, 0, UNMOUNT_SHOT_RANGE),
    ]));

    const lineGeometryMax = this.considerGeometry(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(FieldBounds.MAX + LINE_OFFSET, 0, UNMOUNT_ENEMY_RANGE),
      new THREE.Vector3(FieldBounds.MAX + LINE_OFFSET, 0, UNMOUNT_SHOT_RANGE),
    ]));

    const lineMin = new THREE.Line(lineGeometryMin, lineMaterial);
    const lineMax = new THREE.Line(lineGeometryMax, lineMaterial);

    this.scene.add(lineMin, lineMax);
  };

  private initCamera = () => {
    const canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      90,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000, // TODO: reduce to current scene limit
    );

    // TODO: remove OribtControls on prod
    const controls = new OrbitControls(this.camera, canvas);
    this.camera.position.z = -2;
    this.camera.position.y = 2;
    this.camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
  };

  private initComposer = () => {
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.renderer.domElement.clientWidth,
        this.renderer.domElement.clientHeight,
      ),
      BloomParams.STRENGTH,
      BloomParams.RADIUS,
      BloomParams.THRESHOLD,
    );

    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);

    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = BloomParams.EXPOSURE;
  };

  private initStars = () => {
    this.stars = new Stars(this.scene, this.loadingManager);
  };

  private initNPC = () => {
    this.npc = new NPC(this.scene, this.loadingManager);
  };

  private initPlayer = () => {
    this.player = new Player(this.scene, this.loadingManager);

    document.addEventListener('keydown', this.handlePlayerShoot);
    this.player.playerShootControl?.addEventListener('pointerdown', this.handlePlayerShoot);
  };

  private initLoadingManager = () => {
    this.loadingManager = new THREE.LoadingManager();

    this.loadingManager.onProgress = (_, loaded, total) => {
      store.game.loadingProgress = loaded / total;
    };
  };

  private render = (time: number) => {
    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.time = time * 0.001;

    this.npc.createEnemy(this.time);

    this.stars.animateStars();

    // TODO: move enemies and shots updates into separated methods

    this.player.updateCooldown(this.time);
    this.player.shots.forEach((shot, index) => {
      const { obj, creationTime } = shot;

      if (obj.position.z < UNMOUNT_SHOT_RANGE) {
        obj.position.z = (this.time - creationTime) * 50;

        shot.update();
      } else {
        this.player.shots = this.player.shots.filter(this.makeComparator(index));
      }
    });

    this.npc.enemies.forEach((enemy, enemyIndex) => {
      const { obj: enemyObj, box: enemyBox, creationTime: enemyTime } = enemy;

      if (enemyObj.position.z > UNMOUNT_ENEMY_RANGE) {
        enemyObj.position.z -= (this.time - enemyTime) * 0.05;

        enemy.update();

        if (this.player.box && enemyBox.intersectsBox(this.player.box)) {
          this.npc.enemies = this.npc.enemies.filter(this.makeComparator(enemyIndex));
          if (!this.player.isInvulnerable) {
            store.game.decrementLife();
            this.player.enableInvulnerable();
          }
        }

        // TODO: optimize algorithm
        this.player.shots.forEach(({ box: shotBox }, shotIndex) => {
          if (enemyBox.intersectsBox(shotBox)) {
            this.npc.enemies = this.npc.enemies.filter(this.makeComparator(enemyIndex));
            this.player.shots = this.player.shots.filter(this.makeComparator(shotIndex));
            store.game.incrementScore(ENEMY_COST);
          }
        });
      } else {
        this.npc.enemies = this.npc.enemies.filter(this.makeComparator(enemyIndex));
        store.game.decrementScore(MISSED_ENEMY_COST);
      }
    });

    this.stats.update();

    this.composer.render();

    this.requestId = requestAnimationFrame(this.render);
  };

  private resizeRendererToDisplaySize = () => {
    const pixelRatio = window.devicePixelRatio;
    const canvas = this.renderer.domElement;

    const width = canvas.clientWidth * pixelRatio;
    const height = canvas.clientHeight * pixelRatio;

    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      this.renderer.setSize(width, height, false);
      this.composer.setSize(width, height);
    }

    return needResize;
  };

  private handlePlayerShoot = (e: Event) => {
    if (e instanceof KeyboardEvent && (e.code !== 'Space' || e.repeat)) return;

    this.player.shoot(this.time);
  };

  private makeComparator = (removableIndex: number) => (
    extensionalObject: ExtensionalObject,
    index: number,
  ) => {
    const isVisible = index !== removableIndex;
    if (!isVisible) this.scene.remove(extensionalObject.obj);
    return isVisible;
  };
}
