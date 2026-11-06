// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Troque pelo domínio final antes do deploy (usado em canonical/hreflang).
  site: 'https://mauricioaraujo1.github.io',
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false },
  },
});
