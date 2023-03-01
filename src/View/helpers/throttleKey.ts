export const throttleKey = (key: string, callback: (e: Event) => void, delay: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (e: KeyboardEvent) => {
    if (e.key !== key || e.repeat) return;

    if (!timeout) {
      callback(e);
      timeout = setTimeout(() => { timeout = null; }, delay);
    }
  };
};
