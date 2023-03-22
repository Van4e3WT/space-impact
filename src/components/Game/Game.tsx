import LilGui from 'lil-gui';
import { useEffect, useRef } from 'react';

import View from '../../View/View';
import './Game.scss';

export const Game = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: remove lilGui
    if (!ref.current) return;

    const gui = new LilGui();
    const view = new View(ref.current);

    return () => {
      gui.destroy();
      view.destroy();
    };
  }, []);

  return (
    <div ref={ref} className="game" />
  );
};
