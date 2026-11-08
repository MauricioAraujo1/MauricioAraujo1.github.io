/**
 * O porto (vitrine de projetos): abre pelo botão ou por um barco, com o sino de boia.
 * O endereço ganha #porto enquanto aberto, então recarregar ou trocar de idioma
 * reabre a vitrine. Esc e os botões de fechar usam o próprio <dialog>.
 */
import { cue } from './sound';

const HASH = '#porto';

export function initHarbor(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-harbor]');
  if (!dialog) return;

  const open = (slug?: string) => {
    if (!dialog.open) {
      dialog.showModal();
      cue('bell');
    }
    history.replaceState(history.state, '', HASH);
    const card = slug ? dialog.querySelector<HTMLElement>(`#porto-${slug}`) : null;
    if (card) {
      card.scrollIntoView({ block: 'center' });
      card.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    }
  };

  document.querySelectorAll<HTMLElement>('[data-open-harbor]').forEach((trigger) =>
    trigger.addEventListener('click', () => open(trigger.dataset.openHarbor || undefined)),
  );

  dialog.addEventListener('close', () => {
    if (location.hash === HASH) history.replaceState(history.state, '', location.pathname + location.search);
  });

  // "Enviar um sinal": fecha o porto e deixa o link seguir para o contato
  dialog.querySelectorAll('[data-harbor-leave]').forEach((link) => link.addEventListener('click', () => dialog.close()));

  if (location.hash === HASH) open();
}
