export const rotate = <T>(n: number, array: readonly T[]): T[] => [
  ...array.slice(n % array.length),
  ...array.slice(0, n % array.length),
];
