import * as THREE from 'three';

import { normalize } from '../../utils/normalize';
import ResoursesController from '../ResoursesController';

const POSITION_LENGTH = 3; // ...[x,y,z]
const STARS_COUNTER = 3000;
const MIN_VALUE = -150;
const MAX_VALUE = 150;
const EXCLUSION_MIN_VALUE = -10;
const EXCLUSION_MAX_VALUE = 10;

export default class Stars extends ResoursesController {
  private scene: THREE.Scene;

  private position!: Float32Array;

  private stars: THREE.Points | null = null;

  constructor(scene: THREE.Scene, manager?: THREE.LoadingManager) {
    super();
    this.scene = scene;
    this.init(STARS_COUNTER, manager);
  }

  public destroy = () => {
    if (this.stars) this.scene.remove(this.stars);

    super.destroy();
  };

  public animateStars = () => {
    for (let i = 2; i < this.position.length; i += POSITION_LENGTH) {
      this.position[i] -= 0.1;

      if (this.position[i] < MIN_VALUE) this.position[i] = MAX_VALUE;
    }

    if (this.stars && this.stars.geometry) {
      this.stars.geometry.attributes.position.needsUpdate = true;
    }
  };

  private init = (n: number, manager?: THREE.LoadingManager) => {
    const starGeometry = this.considerGeometry(new THREE.BufferGeometry());
    const positions: Array<number> = [];

    for (let i = 0; i < n; i += 1) {
      const position = this.calculatePosition();

      positions.push(...position);
    }

    this.position = new Float32Array(positions);

    starGeometry.setAttribute('position', new THREE.BufferAttribute(this.position, POSITION_LENGTH));

    const textureLoader = new THREE.TextureLoader(manager);
    textureLoader.load(`${process.env.PUBLIC_URL}/textures/star.png`, (texture) => {
      this.considerTexture(texture);

      const starMaterial = this.considerMaterial(new THREE.PointsMaterial({
        color: '#fff',
        size: 0.15,
        map: texture,
        transparent: true,
        sizeAttenuation: true,
      }));

      this.stars = new THREE.Points(starGeometry, starMaterial);
      this.scene.add(this.stars);
    });
  };

  private calculatePosition = (): [number, number, number] => {
    const z = Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE;
    const y = Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE;
    const x = y > EXCLUSION_MIN_VALUE && y < EXCLUSION_MAX_VALUE
      ? this.calculateAxisWithExclusion(Math.random())
      : (Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE);

    return [x, y, z];
  };

  private calculateAxisWithExclusion = (seed: number) => (seed > 0.5
    ? (normalize(seed, 0.5, 1) * (MAX_VALUE - EXCLUSION_MAX_VALUE) + EXCLUSION_MAX_VALUE)
    : (normalize(seed, 0, 0.5) * (EXCLUSION_MIN_VALUE - MIN_VALUE) + MIN_VALUE)
  );
}
