/**
 * Na seção de contato a lâmpada do farol pisca a palavra em Morse
 * (data-morse) e os sinais desenhados na página acendem junto.
 */
import { morseTimeline } from '@/lib/morse';
import { prefersReducedMotion, sleep } from './motion';

const UNIT_MS = 200;
const root = document.documentElement;

export function initMorse(): void {
  const section = document.querySelector<HTMLElement>('[data-morse]');
  if (!section || prefersReducedMotion()) {
    root.dataset.lamp = 'on';
    return;
  }

  const word = section.dataset.morse ?? 'OI';
  const timeline = morseTimeline(word);
  const signs = [...section.querySelectorAll<HTMLElement>('.contact__sign')];
  let running = false;

  const loop = async () => {
    running = true;
    while (root.dataset.section === 'contact') {
      let sign = 0;
      for (const [on, units] of timeline) {
        root.dataset.lamp = on ? 'on' : 'off';
        if (on) signs[sign]?.classList.add('is-on');
        await sleep(units * UNIT_MS);
        if (on) signs[sign++]?.classList.remove('is-on');
        if (root.dataset.section !== 'contact') break;
      }
    }
    root.dataset.lamp = 'off';
    running = false;
  };

  new MutationObserver(() => {
    if (root.dataset.section === 'contact' && !running) void loop();
  }).observe(root, { attributes: true, attributeFilter: ['data-section'] });
}
