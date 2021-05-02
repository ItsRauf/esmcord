export const DenyObjectModification = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target): boolean {
    if (!target._allowModification) return false;
    return true;
  },
};

export function setObjectModification<T>(object: T, modifiable: boolean): void {
  Object.defineProperty(object, '_allowModification', {
    value: modifiable,
  });
}
