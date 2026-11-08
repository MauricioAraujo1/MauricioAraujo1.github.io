import type { ImageMetadata } from 'astro';
import type { Localized } from '@/i18n/ui';
import appNativeMaps from '@/assets/projects/app-native-maps.webp';
import devStore from '@/assets/projects/dev-store.webp';
import shopperApi from '@/assets/projects/shopper-api.webp';
import stargazer from '@/assets/projects/stargazer.webp';
import whenlock from '@/assets/projects/whenlock.webp';

export interface Project {
  /** Identificador estável (âncora do cartão na vitrine). */
  slug: string;
  name: string;
  /** Repositórios exibidos abaixo do nome. */
  repos: string[];
  url: string;
  demo?: string;
  description: Localized;
  tech: Localized<string[]> | string[];
  /** Imagem da vitrine (16:9), exportada do design. */
  image: ImageMetadata;
  featured?: boolean;
}

const gh = (repo: string) => `https://github.com/MauricioAraujo1/${repo}`;

export const projects: Project[] = [
  {
    slug: 'stargazer',
    name: 'Stargazer',
    repos: ['MauricioAraujo1/desafio-front'],
    url: gh('desafio-front'),
    demo: 'https://stargazer-gh.vercel.app',
    featured: true,
    image: stargazer,
    description: {
      pt: 'Explore os repositórios mais estrelados de qualquer usuário do GitHub, com ordenação, filtros e tema escuro.',
      en: "Explore any GitHub user's most-starred repositories, with sorting, filters and dark mode.",
    },
    tech: ['React 19', 'TypeScript', 'Vite', 'Jest'],
  },
  {
    slug: 'shopper-api',
    name: 'ShopperAPI',
    repos: ['MauricioAraujo1/ShopperAPI'],
    url: gh('ShopperAPI'),
    image: shopperApi,
    description: {
      pt: 'Backend que lê o consumo de água e gás a partir da foto do medidor, usando IA.',
      en: 'Backend that reads water and gas usage from a photo of the meter, using AI.',
    },
    tech: ['NestJS', 'Prisma', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'app-native-maps',
    name: 'App-NativeMaps',
    repos: ['MauricioAraujo1/app-native-maps'],
    url: gh('app-native-maps'),
    image: appNativeMaps,
    description: {
      pt: 'App mobile que traça rotas do ponto A ao B pela cidade, de restaurantes a shoppings.',
      en: 'Mobile app that plots routes from A to B around the city, from restaurants to malls.',
    },
    tech: {
      pt: ['React Native', 'Expo', 'Google Places e Directions'],
      en: ['React Native', 'Expo', 'Google Places & Directions'],
    },
  },
  {
    slug: 'dev-store',
    name: 'DevStore',
    repos: ['dev-store', 'dev-store-api'],
    url: gh('dev-store'),
    image: devStore,
    description: {
      pt: 'E-commerce de roupas e acessórios com carrinho e testes E2E.',
      en: 'Clothing and accessories store with a cart and E2E tests.',
    },
    tech: ['Next.js 14', 'TypeScript', 'Tailwind', 'Zod', 'Cypress'],
  },
  {
    slug: 'whenlock',
    name: 'Whenlock',
    repos: ['whenlock-frontend', 'whenlock-backend'],
    url: gh('whenlock-frontend'),
    image: whenlock,
    description: {
      pt: 'Painel full stack para cadastrar, editar e remover usuários.',
      en: 'Full-stack dashboard to create, edit and remove users.',
    },
    tech: ['NestJS', 'Prisma', 'PostgreSQL', 'React'],
  },
];

/** Stack do projeto no idioma da página. */
export const techOf = (project: Project, locale: keyof Localized): string[] =>
  Array.isArray(project.tech) ? project.tech : project.tech[locale];
