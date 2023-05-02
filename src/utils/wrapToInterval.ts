export const wrapToInterval = (callback: () => void, delay: number): [() => void, () => void] => {
  let interval: NodeJS.Timer;

  const startExecution = () => {
    interval = setInterval(callback, delay);
  };

  const finishExecution = () => clearInterval(interval);

  return [startExecution, finishExecution];
};
