import { useEffect, useRef } from 'react';

import View from '../../View/View';
import './Game.scss';

export const Game = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const view = new View(ref.current);

    return () => view.destroy();
  }, []);

  return (
    <div ref={ref} className="game" />
  );
};
