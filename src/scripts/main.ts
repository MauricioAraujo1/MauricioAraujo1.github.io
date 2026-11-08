import { initAmbient } from './ambient';
import { initBeacon } from './beacon';
import { initEasterEgg } from './easter-egg';
import { initHarbor } from './harbor';
import { initMorse } from './morse';
import { initSound } from './sound';
import { initCopy, initMenu, initReveal } from './ui';

initSound();
initBeacon();
initMorse();
initAmbient();
initEasterEgg();
initReveal();
initMenu();
initCopy();
initHarbor();
