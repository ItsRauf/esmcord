export function waitUntil(condition: () => boolean): Promise<void> {
  const poll = (resolve: (value: void) => void) => {
    if (condition()) resolve();
    else setTimeout(() => poll(resolve), 400);
  };

  return new Promise<void>(poll);
}
