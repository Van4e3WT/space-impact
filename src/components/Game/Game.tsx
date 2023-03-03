import LilGui from 'lil-gui';
import { useEffect, useRef } from 'react';
import { GridHelper } from 'three/src/helpers/GridHelper';

import View from '../../View/View';
import './Game.scss';

export const Game = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const gui = new LilGui();
    const view = new View(ref.current);

    const grid = new GridHelper();
    if (!(grid.material instanceof Array)) grid.material.depthTest = false;
    grid.renderOrder = 1;
    view.addToScene(grid);
    gui.add(grid, 'visible').name('scene');

    return () => {
      gui.destroy();
      view.destroy();
    };
  }, []);

  return (
    <div ref={ref} className="game" />
  );
};
