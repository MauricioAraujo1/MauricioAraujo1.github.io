/**
 * Regras de um farol de verdade, sem DOM.
 *
 * - A lente só gira em um sentido (horário): para chegar a um rumo, o feixe
 *   avança, nunca volta. O ângulo é acumulado (pode passar de 360°).
 * - A "característica" (ex.: Fl(5) W 10s) diz como a luz pisca:
 *   Fl(n) = grupo de n lampejos, W = branca, 10s = período do ciclo.
 */

/** Quanto girar no sentido horário para sair de `from` e chegar a `to` (0 ≤ Δ < 360). */
export function clockwiseDelta(from: number, to: number): number {
  return (((to - from) % 360) + 360) % 360;
}

export interface LightCharacter {
  flashes: number;
  periodMs: number;
}

/** Lê "Fl(5) W 10s" → { flashes: 5, periodMs: 10000 }. Formato inválido = 1 lampejo a cada 5 s. */
export function parseCharacter(signature: string): LightCharacter {
  const flashes = Number(/Fl\((\d+)\)/i.exec(signature)?.[1] ?? 1);
  const seconds = Number(/(\d+(?:\.\d+)?)\s*s\b/i.exec(signature)?.[1] ?? 5);
  return { flashes, periodMs: seconds * 1000 };
}

/**
 * Tempos de um grupo de lampejos, cabendo numa fração do período
 * (o resto do período é o eclipse longo entre grupos).
 */
export function flashGroup({ flashes, periodMs }: LightCharacter, share = 0.3): { onMs: number; offMs: number } {
  const slot = (periodMs * share) / flashes;
  return { onMs: slot * 0.4, offMs: slot * 0.6 };
}
