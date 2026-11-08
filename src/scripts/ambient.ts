/**
 * Vida da cena: parallax das montanhas, estrela cadente ocasional
 * e um avião cruzando o céu de vez em quando.
 */
import { scene } from '@/components/scene/geometry';
import { prefersReducedMotion, random } from './motion';

const root = document.documentElement;
/** O parallax muda a cada rolagem: a variável fica na cena para não recalcular a página inteira. */
const sceneEl = document.querySelector<HTMLElement>('[data-scene]') ?? root;

export function initAmbient(): void {
  if (prefersReducedMotion()) return;
  initParallax();
  schedule(shootingStar, 20_000, 40_000, 6_000);
  schedule(airplane, 60_000, 120_000, 15_000);
}

function initParallax(): void {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    sceneEl.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) requestAnimationFrame(update);
      ticking = true;
    },
    { passive: true },
  );
  update();
}

/** Repete `fn` em intervalos aleatórios; não dispara com a aba escondida. */
function schedule(fn: () => void, min: number, max: number, first: number): void {
  const next = (delay: number) =>
    setTimeout(() => {
      if (!document.hidden) fn();
      next(random(min, max));
    }, delay);
  next(first);
}

function restart(el: Element, className: string): void {
  el.classList.remove(className);
  void (el as HTMLElement).getBoundingClientRect(); // reinicia a animação CSS
  el.classList.add(className);
}

function shootingStar(): void {
  const star = document.getElementById('cadente');
  if (!star) return;
  const { minX, maxX, minY, maxY } = scene.sky;
  star.style.setProperty('--x', `${random(minX, maxX)}px`);
  star.style.setProperty('--y', `${random(minY, maxY)}px`);
  star.style.setProperty('--a', `${random(18, 38)}deg`);
  restart(star, 'is-falling');
}

function airplane(): void {
  const plane = document.getElementById('aviao');
  if (plane) restart(plane, 'is-flying');
}
