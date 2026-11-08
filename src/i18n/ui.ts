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
      locale: 'pt_BR',
      image: '/og/pt.png',
      imageAlt: 'Maurício Araújo, Engenheiro de Software Backend, ao lado de um farol aceso à noite',
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
      description: 'Cinco barcos no feixe. Aponte para um deles ou entre no porto para ver todos de perto.',
      all: 'ver os {count} repositórios ↗',
      enter: 'Entrar no porto',
    },
    harbor: {
      trail: 'porto',
      section: 'projetos',
      title: 'Projetos atracados.',
      meta: '{projects} projetos  ·  {repos} repositórios no GitHub',
      close: 'sair do porto',
      live: 'ao vivo',
      code: 'código',
      more: 'outros repositórios no GitHub',
      closingTitle: 'Gostou de algum barco?',
      closingCaption: 'Vagas, projetos ou só um oi  ·  respondo todo sinal',
      signal: 'Enviar um sinal',
      back: 'Voltar ao farol',
    },
    sound: { on: 'Ligar som ambiente', off: 'Desligar som ambiente' },
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
      day: { one: '{count} contribuição em {date}', other: '{count} contribuições em {date}' },
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
      locale: 'en_US',
      image: '/og/en.png',
      imageAlt: 'Maurício Araújo, Backend Software Engineer, next to a lit lighthouse at night',
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
      description: 'Five boats in the beam. Point at one, or enter the harbor to see them all up close.',
      all: 'see all {count} repositories ↗',
      enter: 'Enter the harbor',
    },
    harbor: {
      trail: 'harbor',
      section: 'projects',
      title: 'Docked projects.',
      meta: '{projects} projects  ·  {repos} repositories on GitHub',
      close: 'leave the harbor',
      live: 'live',
      code: 'code',
      more: 'more repositories on GitHub',
      closingTitle: 'Spotted a boat you like?',
      closingCaption: 'Jobs, projects or just a hello  ·  every signal gets an answer',
      signal: 'Send a signal',
      back: 'Back to the lighthouse',
    },
    sound: { on: 'Turn ambient sound on', off: 'Turn ambient sound off' },
    github: {
      title: 'GitHub',
      description: 'Each star is a day with commits. The sky is drawn from my public profile data.',
      contributions: 'contributions in 12 months',
      repos: 'public repositories',
      followers: 'followers',
      weeks: 'last 52 weeks',
      less: 'less',
      more: 'more',
      day: { one: '{count} contribution on {date}', other: '{count} contributions on {date}' },
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

/** Formas no singular e no plural de um texto que depende de uma contagem. */
export type Plural = { one: string; other: string };

/** Escolhe a forma pela contagem: 1 é singular; 0 e o resto ficam no plural (pt e en). */
export function plural(forms: Plural, count: number): string {
  return count === 1 ? forms.one : forms.other;
}

/** Troca {chave} por valores: format('ver {count}', { count: 5 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
