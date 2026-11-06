/** Pequenas interações de interface: revelar ao rolar, menu mobile e copiar e-mail. */

export function initReveal(): void {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }),
    { threshold: 0.2 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}

export function initMenu(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const toggle = nav?.querySelector<HTMLButtonElement>('.nav__toggle');
  if (!nav || !toggle) return;

  const setOpen = (open: boolean) => {
    nav.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '');
  };
  toggle.addEventListener('click', () => setOpen(!nav.hasAttribute('data-open')));
  nav.querySelectorAll('.nav__menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
}

export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const original = button.textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.textContent = button.dataset.copiedLabel ?? original;
        setTimeout(() => (button.textContent = original), 1800);
      } catch {
        window.location.href = `mailto:${button.dataset.copy}`;
      }
    });
  });
}
