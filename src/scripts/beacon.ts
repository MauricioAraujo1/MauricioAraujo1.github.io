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
import { cue } from './sound';

/** Velocidade do giro entre rumos e da deriva depois de chegar. */
const TURN_DEG_PER_S = 110;
const TURN_MIN_MS = 900;
const DRIFT_DEG_PER_S = 0.6;
const DRIFT_MAX_DEG = 6;
/** Mirar um barco: mais rápido que o giro entre rumos. */
const AIM_DEG_PER_S = 90;
const AIM_MIN_MS = 450;
/** Folga ao sair de um barco, para não voltar ao destaque entre um barco e outro. */
const RELEASE_DELAY_MS = 220;
/** Comprimento do feixe desenhado (unidades da cena): ao mirar, ele muda para terminar no casco. */
const BEAM_LENGTH = 1160;
/** A ponta do feixe desenhado fica 36 unidades acima da lanterna (1120,276 → −40,240) e tem 240 de abertura. */
const BEAM_TIP_RISE = 36;
const BEAM_MOUTH = 240;
/** Ao mirar, a boca do feixe tem a largura do barco. */
const BEAM_MOUTH_PER_BOAT = 1;
/** O casco fica neste ponto do feixe; o resto é o esmaecer da ponta (degradê em farol-cena.svg). */
const BEAM_HULL_AT = 0.96;

const root = document.documentElement;
/** Variáveis que mudam a cada quadro ficam na cena: escritas no <html>, recalculariam o estilo da página inteira. */
const sceneEl = document.querySelector<HTMLElement>('[data-scene]') ?? root;

export function initBeacon(): void {
  const lens = createLens();
  const boats = followBoats(lens);
  const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];

  const setSection = (section: HTMLElement) => {
    const id = section.dataset.section ?? 'home';
    root.dataset.section = id;

    const bearing = Number(section.dataset.bearing);
    // nos projetos (palco) o feixe repousa no barco em destaque, não no rumo fixo
    const onBoat = id === 'projects' && boats.rest();
    if (!onBoat && Number.isFinite(bearing) && section.dataset.bearing) lens.turnTo(bearing);
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

/**
 * Nos projetos (palco) o feixe repousa no barco em destaque; o barco sob o cursor
 * (ou com foco) toma a luz e, ao sair, ela volta ao destaque. No celular os barcos
 * viram cartões e o feixe segue o rumo da seção.
 */
function followBoats(lens: ReturnType<typeof createLens>): { rest: () => boolean } {
  const lamp = document.getElementById('lampada');
  const stage = window.matchMedia('(min-width: 56em) and (min-height: 38em)' /* = --stage */);
  const featured = document.querySelector('.moored--featured .boat');
  let releaseTimer = 0;

  /**
   * Rumo da lanterna até o casco e a escala do feixe: comprimento até ele, abertura do tamanho dele.
   * O barco é medido em relação à seção (a cena fica parada): vale mesmo no meio da rolagem.
   */
  const aimAt = (boat: Element) => {
    const from = lamp!.getBoundingClientRect();
    const to = boat.getBoundingClientRect();
    const sectionTop = boat.closest('[data-section]')?.getBoundingClientRect().top ?? 0;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    // mira no casco, não no topo do mastro
    const dy = to.top - sectionTop + to.height * 0.75 - (from.top + from.height / 2);
    // a lâmpada tem 16 unidades de diâmetro: dá a escala da cena na tela
    const unit = from.width / 16;
    const distance = Math.hypot(dx, dy) / unit;
    const spread = Math.min(1, ((to.width / unit) * BEAM_MOUTH_PER_BOAT) / BEAM_MOUTH);
    // comprimento e abertura mudam separados, então o ângulo da ponta (subida/comprimento)
    // muda junto e entra na correção do rumo
    const rise = BEAM_TIP_RISE * spread * BEAM_HULL_AT; // subida do eixo até o casco
    const run = Math.sqrt(Math.max(distance ** 2 - rise ** 2, 1));
    const tilt = (Math.atan2(rise, run) * 180) / Math.PI;
    const bearing = ((Math.atan2(dx, -dy) * 180) / Math.PI - tilt + 360) % 360;
    return { bearing, reach: run / BEAM_HULL_AT / BEAM_LENGTH, spread };
  };

  const aimAtBoat = (boat: Element) => {
    const { bearing, reach, spread } = aimAt(boat);
    lens.aim(bearing, reach, spread);
  };

  /** Feixe no barco em destaque. Falso quando não se aplica (celular, sem barcos). */
  const rest = () => {
    if (!lamp || !featured || !stage.matches) return false;
    clearTimeout(releaseTimer);
    aimAtBoat(featured);
    return true;
  };

  document.querySelectorAll<HTMLElement>('.moored').forEach((moored) => {
    const boat = moored.querySelector('.boat');
    if (!boat || !lamp) return;
    const aim = () => {
      if (!stage.matches || root.dataset.section !== 'projects') return;
      clearTimeout(releaseTimer);
      aimAtBoat(boat);
    };
    const release = () => {
      if (!stage.matches) return;
      clearTimeout(releaseTimer);
      // a folga evita voltar ao destaque no caminho de um barco para outro
      releaseTimer = window.setTimeout(() => root.dataset.section === 'projects' && rest(), RELEASE_DELAY_MS);
    };
    moored.addEventListener('pointerenter', aim);
    moored.addEventListener('pointerleave', release);
    moored.addEventListener('focusin', aim);
    moored.addEventListener('focusout', release);
  });

  return { rest };
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
    cue('lens');
    await sleep(onMs);
    root.dataset.lamp = 'off';
    await sleep(offMs);
  }
  root.dataset.beacon = 'on';
}

/**
 * A lente: guarda o ângulo acumulado (em graus náuticos) e escreve --beam-rot na cena.
 * Giros usam transição CSS; a deriva é feita frame a frame.
 * Entre rumos de seção ela só gira no sentido horário. Mirar um barco é o faroleiro
 * guiando a luz à mão: vai pelo caminho mais curto e segura ali, sem deriva.
 */
function createLens() {
  // começa no primeiro rumo da página: o feixe já nasce apontado para a primeira seção
  const firstBearing = sectionData.find((s) => s.bearing !== null)?.bearing ?? scene.beamRestBearing;
  let angle: number = firstBearing;
  let target = angle;
  let driftFrame = 0;
  let turnTimer = 0;

  let reach = 1;
  let spread = 1;
  const write = () => {
    sceneEl.style.setProperty('--beam-rot', `${beamRotation(angle)}deg`);
    sceneEl.style.setProperty('--beam-reach', String(reach));
    sceneEl.style.setProperty('--beam-spread', String(spread));
  };

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

  const stop = () => {
    cancelAnimationFrame(driftFrame);
    clearTimeout(turnTimer);
  };

  /** Gira `delta` graus em `duration` ms e então chama `then`. */
  const swing = (delta: number, duration: number, then?: () => void) => {
    angle += delta;
    if (prefersReducedMotion()) {
      write();
      return then?.();
    }
    sceneEl.style.setProperty('--beam-turn', `${duration}ms`);
    root.dataset.beam = 'turning';
    write();
    turnTimer = window.setTimeout(() => {
      delete root.dataset.beam;
      then?.();
    }, duration);
  };

  const shortest = (to: number) => ((((to - angle) % 360) + 540) % 360) - 180;
  const aimDuration = (delta: number) => Math.max(AIM_MIN_MS, (Math.abs(delta) / AIM_DEG_PER_S) * 1000);

  return {
    turnTo(bearing: number) {
      stop();
      reach = 1;
      spread = 1;
      delete root.dataset.beamAim;
      const delta = clockwiseDelta(angle, bearing);
      // o rumo ficou só um pouco para trás por causa da deriva: já estamos nele
      const behind = 360 - delta;
      if (delta < 0.5 || behind <= DRIFT_MAX_DEG + 0.5) {
        target = angle - (delta < 0.5 ? delta : behind);
        return drift();
      }
      target = angle + delta;
      swing(delta, Math.max(TURN_MIN_MS, (delta / TURN_DEG_PER_S) * 1000), drift);
    },
    /** Aponta o feixe para um rumo, com `length` × o comprimento e `width` × a abertura desenhados, e segura ali. */
    aim(bearing: number, length = 1, width = 1) {
      stop();
      reach = length;
      spread = width;
      // a ponta do feixe é o barco: o degradê não pode sumir antes dela (scene.css)
      root.dataset.beamAim = '';
      const delta = shortest(bearing);
      swing(delta, aimDuration(delta));
    },
  };
}
