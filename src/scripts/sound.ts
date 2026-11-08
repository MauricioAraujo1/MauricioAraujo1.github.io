/**
 * Som ambiente, gerado no navegador (Web Audio): nada é baixado.
 * - mar: ruído marrom filtrado, com o volume subindo e descendo como ondas;
 * - sinais curtos (`cue`): sino de boia ao abrir o porto e o clique da lente ao acender o farol.
 * Começa desligado; a escolha fica salva no navegador. O áudio só é criado
 * no primeiro clique em ligar (exigência dos navegadores).
 */

export type Cue = 'bell' | 'lens';

const STORAGE_KEY = 'farol:sound';
const SEA_VOLUME = 0.06;
const FADE_S = 1.2;

let ctx: AudioContext | undefined;
let master: GainNode | undefined;
let enabled = false;

const buttons = () => document.querySelectorAll<HTMLButtonElement>('[data-sound-toggle]');

export function initSound(): void {
  buttons().forEach((button) => button.addEventListener('click', () => setEnabled(!enabled)));
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    void (document.hidden ? ctx.suspend() : enabled && ctx.resume());
  });
  // Lembrar "ligado" não liga sozinho: o navegador exige um gesto. O botão já aparece aceso
  // e o som começa no primeiro clique em qualquer lugar.
  if (readPreference()) {
    sync(true);
    document.addEventListener('pointerdown', () => enabled && start(), { once: true });
    enabled = true;
  }
}

/** Toca um sinal curto, se o som estiver ligado. */
export function cue(name: Cue): void {
  if (!enabled || !ctx || !master) return;
  if (name === 'bell') bell(ctx, master);
  else lensClick(ctx, master);
}

function setEnabled(on: boolean): void {
  enabled = on;
  sync(on);
  writePreference(on);
  if (on) start();
  else fadeTo(0);
}

function sync(on: boolean): void {
  buttons().forEach((button) => {
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', (on ? button.dataset.labelOff : button.dataset.labelOn) ?? '');
  });
}

function start(): void {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    sea(ctx, master);
  }
  void ctx.resume();
  fadeTo(1);
}

function fadeTo(value: number): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(value, now + FADE_S);
}

/** Mar: ruído marrom → passa-baixa, com um LFO lento no volume (as ondas). */
function sea(audio: AudioContext, out: AudioNode): void {
  const seconds = 4;
  const buffer = audio.createBuffer(1, audio.sampleRate * seconds, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;

  const swell = audio.createGain();
  swell.gain.value = SEA_VOLUME;
  const lfo = audio.createOscillator();
  lfo.frequency.value = 0.09; // uma onda a cada ~11 s
  const depth = audio.createGain();
  depth.gain.value = SEA_VOLUME * 0.6;
  lfo.connect(depth).connect(swell.gain);

  noise.connect(filter).connect(swell).connect(out);
  noise.start();
  lfo.start();
}

/** Sino de boia: parciais inarmônicas com decaimento longo. */
function bell(audio: AudioContext, out: AudioNode): void {
  const now = audio.currentTime;
  for (const [freq, gain] of [
    [660, 0.05],
    [1580, 0.02],
    [2490, 0.01],
  ] as const) {
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.frequency.value = freq;
    env.gain.setValueAtTime(gain, now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
    osc.connect(env).connect(out);
    osc.start(now);
    osc.stop(now + 2.7);
  }
}

/** Clique da lente: um estalo curto e abafado. */
function lensClick(audio: AudioContext, out: AudioNode): void {
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
  env.gain.setValueAtTime(0.06, now);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(env).connect(out);
  osc.start(now);
  osc.stop(now + 0.14);
}

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function writePreference(on: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    /* navegação privada: só não lembra */
  }
}
