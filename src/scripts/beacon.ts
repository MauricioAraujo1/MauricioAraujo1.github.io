/**
 * O farol segue a rolagem como um farol real:
 * - a seção visível define o rumo, e o feixe chega até ele girando só no sentido horário;
 * - ao chegar, a lente não para: segue derivando devagar;
 * - ao acender, a lanterna faz o grupo de lampejos da característica (Fl(5) W 10s) antes do feixe sair.
 * Também marca o item ativo da navegação.
 */
import { beamRotation, scene } from '@/components/scene/geometry';
import { profile } from '@/data/profile';
import { sections as sectionData } from '@/data/sections';
import { clockwiseDelta, flashGroup, parseCharacter } from '@/lib/lighthouse';
import { prefersReducedMotion, sleep } from './motion';

/** Velocidade do giro entre rumos e da deriva depois de chegar. */
const TURN_DEG_PER_S = 110;
const TURN_MIN_MS = 900;
const DRIFT_DEG_PER_S = 0.6;
const DRIFT_MAX_DEG = 6;

const root = document.documentElement;

export function initBeacon(): void {
  const lens = createLens();
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];

  const setSection = (section: HTMLElement) => {
    const id = section.dataset.section ?? 'home';
    root.dataset.section = id;

    const bearing = Number(section.dataset.bearing);
    if (Number.isFinite(bearing) && section.dataset.bearing) lens.turnTo(bearing);
    if (id !== 'home') void lightBeacon();

    navLinks.forEach((link) =>
      link.dataset.navLink === id ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'),
    );
  };

  // A seção "ativa" é a que cruza a faixa central da tela.
  const observer = new IntersectionObserver(
    (entries) => entries.filter((e) => e.isIntersecting).forEach((e) => setSection(e.target as HTMLElement)),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  sections.forEach((s) => observer.observe(s));

  document.querySelectorAll('[data-light-beacon]').forEach((el) => el.addEventListener('click', () => void lightBeacon()));
}

/** Acende o farol: grupo de lampejos da característica e, em seguida, o feixe. */
export async function lightBeacon(): Promise<void> {
  if (root.dataset.beacon !== 'off') return;
  if (prefersReducedMotion()) {
    root.dataset.beacon = 'on';
    return;
  }

  root.dataset.beacon = 'flashing';
  const character = parseCharacter(profile.lightCharacter);
  const { onMs, offMs } = flashGroup(character);
  for (let i = 0; i < character.flashes; i++) {
    root.dataset.lamp = 'on';
    await sleep(onMs);
    root.dataset.lamp = 'off';
    await sleep(offMs);
  }
  root.dataset.beacon = 'on';
}

/**
 * A lente: guarda o ângulo acumulado (em graus náuticos) e escreve --beam-rot.
 * Giros entre rumos usam transição CSS; a deriva é feita frame a frame.
 */
function createLens() {
  // começa no primeiro rumo da página: o feixe já nasce apontado para a primeira seção
  const firstBearing = sectionData.find((s) => s.bearing !== null)?.bearing ?? scene.beamRestBearing;
  let angle: number = firstBearing;
  let target = angle;
  let driftFrame = 0;
  let turnTimer = 0;

  const write = () => root.style.setProperty('--beam-rot', `${beamRotation(angle)}deg`);

  write();

  const drift = () => {
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      // aproxima-se do limite cada vez mais devagar: a lente nunca para de vez
      const room = Math.max(0, target + DRIFT_MAX_DEG - angle);
      angle += Math.min(room, DRIFT_DEG_PER_S * dt * (room / DRIFT_MAX_DEG));
      write();
      driftFrame = requestAnimationFrame(step);
    };
    driftFrame = requestAnimationFrame(step);
  };

  return {
    turnTo(bearing: number) {
      cancelAnimationFrame(driftFrame);
      clearTimeout(turnTimer);

      const delta = clockwiseDelta(angle, bearing);
      // o rumo ficou só um pouco para trás por causa da deriva: já estamos nele
      const behind = 360 - delta;
      if (delta < 0.5 || behind <= DRIFT_MAX_DEG + 0.5) {
        target = angle - (delta < 0.5 ? delta : behind);
        return drift();
      }

      target = angle + delta;
      angle = target;

      if (prefersReducedMotion()) return write();

      const duration = Math.max(TURN_MIN_MS, (delta / TURN_DEG_PER_S) * 1000);
      root.style.setProperty('--beam-turn', `${duration}ms`);
      root.dataset.beam = 'turning';
      write();
      turnTimer = window.setTimeout(() => {
        delete root.dataset.beam;
        drift();
      }, duration);
    },
  };
}
