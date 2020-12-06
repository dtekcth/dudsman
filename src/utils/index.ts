export { default as useTimeout } from './hooks/useTimeout';

export const mod = (a: number, n: number): number => ((a % n) + n) % n;
