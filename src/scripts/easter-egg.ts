/**
 * Segredo: 5 cliques na lua (em até 3 s) chamam o disco voador.
 * Ele abduz uma estrela, abre um portal e some. A coreografia
 * está em styles/scene.css (html[data-egg="run"]).
 *
 * A cena fica atrás do conteúdo (que recebe os cliques), então em vez de
 * ouvir a lua diretamente testamos se o clique caiu sobre ela.
 */
import { prefersReducedMotion } from './motion';

const CLICKS = 5;
const WINDOW_MS = 3_000;
const DURATION_MS = 7_200;
/** Folga ao redor da lua, para o alvo não ser minúsculo. */
const HIT_SLOP = 12;
const root = document.documentElement;

export function initEasterEgg(): void {
  const moon = document.getElementById('lua-crescente');
  if (!moon || prefersReducedMotion()) return;

  let clicks: number[] = [];

  document.addEventListener('click', (event) => {
    if (!isOnMoon(moon, event) || isInteractive(event.target)) return;

    const now = event.timeStamp;
    clicks = [...clicks.filter((t) => now - t < WINDOW_MS), now];
    if (clicks.length < CLICKS || root.dataset.egg === 'run') return;

    clicks = [];
    root.dataset.egg = 'run';
    setTimeout(() => delete root.dataset.egg, DURATION_MS);
  });
}

function isOnMoon(moon: Element, { clientX: x, clientY: y }: MouseEvent): boolean {
  const r = moon.getBoundingClientRect();
  return x >= r.left - HIT_SLOP && x <= r.right + HIT_SLOP && y >= r.top - HIT_SLOP && y <= r.bottom + HIT_SLOP;
}

/** Cliques em links, botões e campos seguem sendo deles. */
function isInteractive(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('a, button, input, textarea, select, label') !== null;
}
