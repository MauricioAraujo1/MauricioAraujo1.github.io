import { egg, eggCssVars } from './geometry';

/**
 * Camadas extras da cena, em coordenadas do viewBox 1440×900.
 * Ficam aqui (e não no SVG exportado do VectorCraft) porque são do site:
 * aparecem e se movem só via CSS/JS. Desenho de referência: farol-portfolio.figcraft.
 */

/**
 * Estrelas à esquerda do viewBox (x < 0). Em telas mais largas que 16:10
 * a cena se ajusta pela altura e essa faixa aparece à esquerda.
 * PRNG com semente fixa: o céu é igual em todo build.
 */
function extraStars(count: number): string {
  let seed = 1440;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: count }, () => {
    const x = (-3000 * rand()).toFixed(0);
    const y = (10 + 500 * rand()).toFixed(0);
    const r = (0.8 + 1.4 * rand()).toFixed(1);
    const o = (0.35 + 0.55 * rand()).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#efe6d2" opacity="${o}"/>`;
  }).join('');
}

export const leftSky = `<g id="estrelas-extra" aria-hidden="true">${extraStars(110)}</g>`;

const cloud = (id: string, x: number, y: number, d: string, top: string) => `
  <path id="${id}" class="nuvem" transform="translate(${x} ${y})" d="${d}" fill="url(#nuvem-${id})"/>
  <linearGradient id="nuvem-${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="#8c98c4" stop-opacity="0"/>
  </linearGradient>`;

/** Entre a lua e as montanhas. */
export const clouds = `
<g id="nuvens" aria-hidden="true">
  ${cloud('nuvem-lua', 470, 98, 'M0 34 C24 26 46 24 66 26 C82 12 112 6 136 16 C154 4 188 2 210 14 C232 6 262 10 284 22 C300 20 316 26 330 34 Z', '#c9d0ea80')}
  ${cloud('nuvem-longa', 560, 296, 'M0 28 C30 20 60 18 90 20 C110 8 150 4 176 12 C206 2 250 4 278 14 C310 8 350 12 380 20 C410 18 440 22 470 28 Z', '#a9b3d966')}
  ${cloud('nuvem-direita', 1180, 120, 'M0 24 C20 18 44 16 64 18 C80 6 110 2 132 10 C150 2 182 4 200 12 C224 8 250 14 270 24 Z', '#a9b3d94d')}
</g>`;

/** Avião visto de baixo: só as luzes de navegação. */
export const airplane = `
<g id="aviao" aria-hidden="true">
  <rect x="4" y="6" width="28" height="3" rx="1.5" fill="#3a4677"/>
  <rect x="15" y="1" width="4" height="13" rx="1" fill="#3a4677"/>
  <circle class="aviao-luz aviao-luz--vermelha" cx="17" cy="1" r="2" fill="#ff5a5a"/>
  <circle class="aviao-luz aviao-luz--verde" cx="17" cy="14" r="2" fill="#5af59a"/>
  <circle class="aviao-strobo" cx="33.5" cy="7.5" r="2.5" fill="#fff"/>
</g>`;

/** Estrela cadente: o script define posição/ângulo e dispara a animação. */
export const shootingStar = `
<g id="cadente" aria-hidden="true">
  <g class="cadente-trilha">
    <linearGradient id="cadente-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="#ffe3a1" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#ffe3a1" stop-opacity="0"/>
    </linearGradient>
    <rect x="3" y="-1" width="137" height="2" rx="1" fill="url(#cadente-grad)"/>
    <circle cx="2.5" cy="0" r="2.5" fill="#fff"/>
  </g>
</g>`;

/** Raio de abdução: sai da base do disco e abre até abaixo da estrela. */
function beamPoints(): string {
  const cx = egg.hover.x + egg.ufo.width / 2;
  const top = egg.hover.y + egg.ufo.bottom;
  const bottom = egg.star.y + 20;
  return `${cx - 12},${top} ${cx + 12},${top} ${cx + 44},${bottom} ${cx - 44},${bottom}`;
}

/** Easter egg: disco voador com o ET, raio, estrela abduzida e portal. */
export const easterEgg = `
<g id="ovni-cena" aria-hidden="true" style="${eggCssVars}">
  <circle id="estrela-abduzida" cx="${egg.star.x}" cy="${egg.star.y}" r="3" fill="#ffe3a1"/>
  <polygon id="ovni-raio" points="${beamPoints()}" fill="url(#ovni-raio-grad)"/>
  <linearGradient id="ovni-raio-grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8ff5e0" stop-opacity="0.6"/><stop offset="1" stop-color="#8ff5e0" stop-opacity="0"/>
  </linearGradient>

  <g id="portal" transform="translate(${egg.portal.x} ${egg.portal.y})">
    <g class="portal-corpo">
      <ellipse cx="35" cy="50" rx="41" ry="56" fill="#9d7bff" opacity="0.25" class="portal-aura"/>
      <ellipse cx="35" cy="50" rx="23" ry="36" fill="url(#portal-nucleo)"/>
      <ellipse cx="35" cy="50" rx="31" ry="46" fill="none" stroke="#9d7bff" stroke-width="3"/>
      <ellipse class="portal-anel" cx="35" cy="50" rx="21" ry="34" fill="none" stroke="#8ff5e0" stroke-width="1.5" stroke-dasharray="10 6"/>
    </g>
    <radialGradient id="portal-nucleo"><stop offset="0.5" stop-color="#05071a"/><stop offset="1" stop-color="#3b2a7a"/></radialGradient>
    <g class="portal-faiscas" fill="#8ff5e0">
      <path d="M-20 10 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z"/>
      <path d="M86 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" fill="#9d7bff"/>
      <path d="M10 100 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 Z" fill="#ffe3a1"/>
    </g>
  </g>

  <g id="ovni">
    <g class="ovni-corpo">
      <ellipse cx="40" cy="37" rx="46" ry="11" fill="#8ff5e0" opacity="0.25"/>
      <!-- ET piloto: a cabeça olha em volta, as antenas balançam e ele acena ao pairar -->
      <g class="et">
        <g class="et-mao">
          <line x1="49" y1="17" x2="54" y2="9" stroke="#7fdc8e" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="54.5" cy="8" r="1.8" fill="#7fdc8e"/>
        </g>
        <g class="et-cabeca">
          <g class="et-antenas">
            <line x1="36" y1="6" x2="34" y2="1" stroke="#6fd58a" stroke-width="1.2"/>
            <line x1="45" y1="6" x2="47" y2="1" stroke="#6fd58a" stroke-width="1.2"/>
            <circle class="et-antena" cx="34" cy="1" r="1.5" fill="#ffe3a1"/>
            <circle class="et-antena" cx="47" cy="1" r="1.5" fill="#ffe3a1"/>
          </g>
          <ellipse cx="40.5" cy="10.5" rx="8" ry="7.5" fill="#7fdc8e"/>
          <g class="et-rosto">
            <g class="et-olhos" fill="#05071a">
              <ellipse cx="37.5" cy="9.5" rx="2.2" ry="3" transform="rotate(-12 37.5 9.5)"/>
              <ellipse cx="43.5" cy="9.5" rx="2.2" ry="3" transform="rotate(12 43.5 9.5)"/>
            </g>
            <circle cx="38" cy="8.5" r="0.7" fill="#fff"/><circle cx="44" cy="8.5" r="0.7" fill="#fff"/>
            <path d="M38.5 14 Q41 16 43.5 14" fill="none" stroke="#1e5a33" stroke-width="0.8"/>
          </g>
        </g>
      </g>
      <ellipse cx="40" cy="14" rx="18" ry="14" fill="#d8ecff" fill-opacity="0.3" stroke="#efe6d2" stroke-opacity="0.4"/>
      <ellipse cx="40" cy="26" rx="40" ry="10" fill="url(#ovni-metal)"/>
      <linearGradient id="ovni-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe6d2"/><stop offset="1" stop-color="#8c98c4"/></linearGradient>
      <ellipse cx="40" cy="26.5" rx="32" ry="4.5" fill="#18203f"/>
      <g class="ovni-luzes">
        <circle cx="16.5" cy="26.5" r="2.5" fill="#8ff5e0"/><circle cx="28.5" cy="27.5" r="2.5" fill="#ffe3a1"/>
        <circle cx="40.5" cy="27.5" r="2.5" fill="#8ff5e0"/><circle cx="52.5" cy="27.5" r="2.5" fill="#ffe3a1"/>
        <circle cx="64.5" cy="26.5" r="2.5" fill="#8ff5e0"/>
      </g>
    </g>
  </g>
</g>`;
