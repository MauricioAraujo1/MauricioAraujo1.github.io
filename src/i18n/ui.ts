export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

/** Texto com versão em cada idioma. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Escolhe a versão do idioma atual de um valor localizado. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

const dictionary = {
  pt: {
    meta: {
      title: 'Maurício Araújo · Engenheiro de Software Backend',
      description:
        'Portfólio de Maurício Araújo, engenheiro de software backend (Node.js, TypeScript, NestJS) em Manaus.',
    },
    a11y: { skip: 'Pular para o conteúdo', nav: 'Seções', menu: 'Abrir menu', close: 'Fechar menu' },
    nav: {
      home: 'início',
      stack: 'stack',
      projects: 'projetos',
      github: 'github',
      journey: 'trajetória',
      contact: 'contato',
    },
    lang: { label: 'Idioma', current: 'PT', other: 'EN' },
    hero: {
      location: 'Manaus/AM, Brasil  ·  Remoto',
      role: 'Engenheiro de Software Backend',
      summary:
        'Node.js, TypeScript e NestJS. 5+ anos construindo sistemas de pagamento, cobrança e dados em escala.',
      cta: 'Acender o farol',
      hint: 'ou role para girar a luz ↓',
    },
    stack: {
      title: 'Stack',
      description:
        'As boias que marcam o meu canal: as ferramentas que uso todo dia para levar sistemas do zero à produção.',
    },
    projects: {
      title: 'Projetos',
      description: 'Barcos no feixe: cinco repositórios que mostram como eu construo, do backend ao app.',
      all: 'ver os {count} repositórios ↗',
      demo: 'demo',
    },
    github: {
      title: 'GitHub',
      description:
        'Cada estrela é um dia com commits. O céu é desenhado com os dados públicos do meu perfil.',
      contributions: 'contribuições em 12 meses',
      repos: 'repositórios públicos',
      followers: 'seguidores',
      weeks: 'últimas 52 semanas',
      less: 'menos',
      more: 'mais',
      day: '{count} contribuições em {date}',
    },
    journey: {
      title: 'Trajetória',
      description: 'Os portos por onde passei, do primeiro código ao porto atual.',
      current: 'porto atual',
      now: 'hoje',
      details: 'Ver detalhes de {org}',
    },
    contact: {
      title: 'Envie um sinal',
      description: 'Vagas, projetos ou só um oi: todo sinal que chega à costa recebe resposta.',
      copy: 'copiar',
      copied: 'copiado!',
      morseWord: 'OI',
      morseCaption: '“OI” em Morse',
    },
  },
  en: {
    meta: {
      title: 'Maurício Araújo · Backend Software Engineer',
      description:
        'Portfolio of Maurício Araújo, backend software engineer (Node.js, TypeScript, NestJS) based in Manaus, Brazil.',
    },
    a11y: { skip: 'Skip to content', nav: 'Sections', menu: 'Open menu', close: 'Close menu' },
    nav: {
      home: 'home',
      stack: 'stack',
      projects: 'projects',
      github: 'github',
      journey: 'journey',
      contact: 'contact',
    },
    lang: { label: 'Language', current: 'EN', other: 'PT' },
    hero: {
      location: 'Manaus, Brazil  ·  Remote',
      role: 'Backend Software Engineer',
      summary:
        'Node.js, TypeScript and NestJS. 5+ years building payment, billing and data-heavy systems.',
      cta: 'Light the beacon',
      hint: 'or scroll to turn the light ↓',
    },
    stack: {
      title: 'Stack',
      description:
        'The buoys that mark my channel: the tools I use every day to take systems from zero to production.',
    },
    projects: {
      title: 'Projects',
      description: 'Boats in the beam: five repositories that show how I build, from backend to app.',
      all: 'see all {count} repositories ↗',
      demo: 'demo',
    },
    github: {
      title: 'GitHub',
      description: 'Each star is a day with commits. The sky is drawn from my public profile data.',
      contributions: 'contributions in 12 months',
      repos: 'public repositories',
      followers: 'followers',
      weeks: 'last 52 weeks',
      less: 'less',
      more: 'more',
      day: '{count} contributions on {date}',
    },
    journey: {
      title: 'Journey',
      description: "The ports I've called at, from my first line of code to my current harbor.",
      current: 'current port',
      now: 'now',
      details: 'Show details for {org}',
    },
    contact: {
      title: 'Send a signal',
      description: 'Jobs, projects or just a hello: every signal that reaches the shore gets an answer.',
      copy: 'copy',
      copied: 'copied!',
      morseWord: 'HI',
      morseCaption: '“HI” in Morse',
    },
  },
} as const;

export type Dictionary = (typeof dictionary)[Locale];

export function useTranslations(locale: Locale): Dictionary {
  return dictionary[locale];
}

/** Troca {chave} por valores: format('ver {count}', { count: 5 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
