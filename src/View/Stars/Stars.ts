import * as THREE from 'three';
import ResoursesController from '../ResoursesController';

const POSITION_LENGTH = 3; // ...[x,y,z]
const STARS_COUNTER = 3000;
const MIN_VALUE = -100;
const MAX_VALUE = 100;

export default class Stars extends ResoursesController {
  private scene: THREE.Scene;

  private position!: Float32Array;

  private stars: THREE.Points | null = null;

  constructor(scene: THREE.Scene) {
    super();
    this.scene = scene;
    this.init(STARS_COUNTER);
  }

  public destroy = () => {
    if (this.stars) this.scene.remove(this.stars);

    super.destroy();
  };

  public animateStars = () => {
    for (let i = 2; i < this.position.length; i += POSITION_LENGTH) {
      this.position[i] -= 0.5;

      if (this.position[i] < MIN_VALUE) this.position[i] = MAX_VALUE;
    }

    if (this.stars && this.stars.geometry) {
      this.stars.geometry.attributes.position.needsUpdate = true;
    }
  };

  private init = (n: number) => {
    const starGeometry = this.considerGeometry(new THREE.BufferGeometry());
    const positions: Array<number> = [];

    for (let i = 0; i < n; i += 1) {
      const position = [
        Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE,
        Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE,
        Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE,
      ];

      positions.push(...position);
    }

    this.position = new Float32Array(positions);

    starGeometry.setAttribute('position', new THREE.BufferAttribute(this.position, POSITION_LENGTH));

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(`${process.env.PUBLIC_URL}/textures/star.png`, (texture) => {
      this.considerTexture(texture);

      const starMaterial = this.considerMaterial(new THREE.PointsMaterial({
        color: '#fff',
        size: 0.2,
        map: texture,
      }));

      this.stars = new THREE.Points(starGeometry, starMaterial);
      this.scene.add(this.stars);
    });
  };
}
