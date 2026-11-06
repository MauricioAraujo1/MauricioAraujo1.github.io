/**
 * Geometria da cena (unidades do viewBox de farol-cena.svg).
 * É a única fonte desses números: vira variáveis CSS (`sceneCssVars`) e
 * é lida pelos scripts. Se a ilustração mudar, ajuste só aqui.
 */
export const scene = {
  width: 1440,
  height: 900,
  horizonY: 600,
  lantern: { x: 1120, y: 276 },
  tower: { left: 1058, top: 204 },
  moon: { x: 600, y: 100 },
  /** Bearing (graus náuticos) para o qual o feixe aponta sem rotação. */
  beamRestBearing: 270,
  /** Região do céu onde estrelas cadentes podem surgir. */
  sky: { minX: 380, maxX: 1300, minY: 40, maxY: 260 },
  /** No modo fluxo (celular) a cena é exibida nesta escala. */
  flowScale: 0.55,
  /** No modo fluxo a lua vem para perto da torre, com esta folga. */
  flowMoonGap: 120,
} as const;

/** Coreografia do easter egg (disco voador), em unidades da cena. */
export const egg = {
  enter: { x: -140, y: 40 },
  hover: { x: 320, y: 160 },
  ufo: { width: 80, bottom: 36 },
  star: { x: 360, y: 290 },
  portal: { x: 820, y: 70, width: 70, height: 100 },
} as const;

/** Caminho do avião: entra pela esquerda e sai pela direita. */
export const flight = { fromY: 190, toY: 120, margin: 80 } as const;

const px = (n: number) => `${n}px`;

/** Variáveis da coreografia, aplicadas no grupo do easter egg. */
export const eggCssVars: string = Object.entries({
  '--egg-enter': `${px(egg.enter.x)}, ${px(egg.enter.y)}`,
  '--egg-hover': `${px(egg.hover.x)}, ${px(egg.hover.y)}`,
  '--egg-approach': `${px(egg.portal.x - 5)}, ${px(egg.portal.y + 30)}`,
  '--egg-exit': `${px(egg.portal.x + egg.portal.width / 2 - 7)}, ${px(egg.portal.y + egg.portal.height / 2 - 6)}`,
  '--egg-rise': px(egg.hover.y + egg.ufo.bottom - egg.star.y),
})
  .map(([key, value]) => `${key}: ${value}`)
  .join('; ');

/** Rotação CSS do feixe para um rumo (270° = repouso, sentido horário). */
export const beamRotation = (bearing: number): number => bearing - scene.beamRestBearing;

/** Variáveis CSS (sem unidade: são unidades do viewBox). */
export const sceneCssVars: string = Object.entries({
  '--scene-w': scene.width,
  '--scene-h': scene.height,
  '--scene-horizon': scene.horizonY,
  '--scene-lantern-x': scene.lantern.x,
  '--scene-lantern-y': scene.lantern.y,
  '--scene-tower-left': scene.tower.left,
  '--scene-tower-top': scene.tower.top,
  '--scene-moon-x': scene.moon.x,
  '--scene-flow-scale': scene.flowScale,
  '--scene-flow-moon-shift': scene.tower.left - scene.moon.x - scene.flowMoonGap,
  '--flight-from': `${-flight.margin}px, ${flight.fromY}px`,
  '--flight-to': `${scene.width + flight.margin}px, ${flight.toY}px`,
})
  .map(([key, value]) => `${key}: ${value}`)
  .join('; ');
