/** Respeita "reduzir movimento" do sistema. */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Número aleatório entre min e max (inclusive). */
export const random = (min: number, max: number): number => min + Math.random() * (max - min);

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
