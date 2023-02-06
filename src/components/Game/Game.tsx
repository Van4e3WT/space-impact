import LilGui from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import View from '../../View/View';
import './Game.scss';

export const Game = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const gui = new LilGui();
    const view = new View(ref.current);

    const grid = new THREE.GridHelper();
    if (!(grid.material instanceof Array)) grid.material.depthTest = false;
    grid.renderOrder = 1;
    view.addToScene(grid);
    gui.add(grid, 'visible').name('scene');

    const geometry = view.considerGeometry(new THREE.BoxGeometry(1, 1, 1));
    const material = view.considerMaterial(new THREE.MeshPhongMaterial({ color: '#44AA88' }));
    const cube = new THREE.Mesh(geometry, material);
    view.addToScene(cube, 'cube');

    return () => {
      gui.destroy();
      view.destroy();
    };
  }, []);

  return (
    <div ref={ref} className="game" />
  );
};
