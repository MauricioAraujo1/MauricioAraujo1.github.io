import type { Localized } from '@/i18n/ui';

/**
 * Trajetória. Fonte: currículo (Downloads/Mauricio_Araujo_Resume_FullStack.pdf, 05/11/2026).
 * Não invente itens: o que não estiver no currículo não entra aqui.
 */
/**
 * Quantos bullets cada experiência mostra no site. Os bullets ficam
 * em ordem de relevância: os primeiros são os exibidos; os demais seguem
 * guardados aqui (fiéis ao currículo) para quando quiser trocar.
 */
export const BULLETS_PER_PORT = 5;

export interface Port {
  kind: 'work' | 'education';
  /** "AAAA-MM" */
  start: string;
  /** "AAAA-MM"; ausente = atual */
  end?: string;
  org: string;
  role: Localized;
  place?: Localized;
  bullets?: Localized<string[]>;
  stack?: string[];
}

export const journey: Port[] = [
  {
    kind: 'work',
    start: '2026-03',
    org: 'Tarkuss Brasil',
    role: { pt: 'Engenheiro de Software', en: 'Software Engineer' },
    place: { pt: 'Manaus · remoto', en: 'Manaus, Brazil · remote' },
    bullets: {
      pt: [
        'Reduzi em 97% o tempo de carregamento (de 30 s para 1 s) em telas de alto tráfego que consultam várias tabelas, em sistemas com mais de 17 milhões de linhas, usando DuckDB e cache em Redis.',
        'Reduzi erros de cobrança ao redesenhar o fluxo de pagamentos e assinaturas integrado ao gateway Asaas, com plano gratuito e descontos padronizados entre os ciclos mensal, semestral e anual (NestJS e PostgreSQL).',
        'Eliminei deploys manuais automatizando as publicações de backend e frontend na Oracle Cloud com Coolify.',
        'Reduzi o risco de regressão em fluxos críticos com cobertura de testes end-to-end (Jest, React Testing Library e Cypress).',
        'Entreguei uma funcionalidade de IA usada pelo time de vendas que automatiza cálculos de vendas brutas, margem, CMV, descontos e bônus, com tool calling, RAG, guardrails, MCP e LiteLLM sobre a API da OpenAI e AWS Bedrock.',
        'Montei um fluxo de desenvolvimento assistido por IA com Claude Code e Cursor: skills que entrevistam o dev para definir as regras de negócio, specs quebradas em pequenas tarefas em Markdown e testes automatizados validando cada etapa.',
        'Construí um app de gestão de vagas e recrutamento (vagas, candidaturas e fluxos de RH), com backend em Kotlin e Spring Boot.',
        'Construí os principais módulos de frontend do SaaS da empresa: dashboards com gráficos, formulários, filtros avançados e relatórios, em Angular e TypeScript.',
      ],
      en: [
        'Cut data load time by 97%, from 30 seconds to 1 second, on high-traffic screens querying multiple tables in systems with more than 17 million rows, using DuckDB and Redis caching.',
        'Reduced billing errors by redesigning the payments and subscriptions flow integrated with the Asaas gateway, adding a free plan and standardizing discount logic across monthly, semi-annual and annual cycles, using NestJS and PostgreSQL.',
        'Removed manual deployments by automating backend and frontend releases to Oracle Cloud, using Coolify.',
        'Reduced regression risk on critical flows by building end-to-end test coverage, using Jest, React Testing Library and Cypress.',
        'Shipped an AI feature used by the sales team that automates gross sales, margin, COGS, discount and bonus calculations, using tool calling, RAG, guardrails, MCP and LiteLLM on the OpenAI API and AWS Bedrock.',
        'Built an AI-assisted development workflow with Claude Code and Cursor: skills that interview the developer to define business rules, specs broken into small Markdown tasks, and automated tests validating each step.',
        'Built a job posting and recruitment management app (openings, applications and HR workflows), with the backend in Kotlin and Spring Boot.',
        "Built the main frontend modules of the company's SaaS product, including dashboards with charts, data entry forms, advanced filters and reports, using Angular and TypeScript.",
      ],
    },
    stack: ['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Next.js', 'Angular', 'Kotlin'],
  },
  {
    kind: 'work',
    start: '2024-10',
    end: '2026-03',
    org: 'Instituto Connecthus',
    role: { pt: 'Engenheiro de Software', en: 'Software Engineer' },
    place: { pt: 'Manaus · híbrido', en: 'Manaus, Brazil · hybrid' },
    bullets: {
      pt: [
        'Construí serviços de backend para projetos web industriais da Foxconn em Java e Spring Boot, integrando bancos relacionais e APIs REST.',
        'Reduzi a demanda de suporte manual com um chatbot de atendimento, agendamento e busca de unidades em três unidades de saúde, integrado a vários sistemas, usando a API da OpenAI.',
        'Construí um sistema de instrução de trabalho para um cliente industrial (Flex), guiando operadores pelas etapas de produção, com PHP e Angular.',
        'Reduzi falhas em importações em massa dos ERPs Protheus e TOTVS padronizando endpoints paginados e práticas de segurança de dados (NestJS e Python).',
        'Eliminei incidentes de acesso não autorizado integrando autenticação Microsoft AD com controle de acesso por papéis (RBAC) em todos os módulos e submódulos de um sistema crítico.',
        'Entreguei de ponta a ponta uma plataforma de treinamento de funcionários para a Foxconn, dos requisitos ao deploy, carregando grandes volumes de dados em 1 a 2 segundos.',
      ],
      en: [
        "Built backend services for Foxconn's industrial web projects in Java and Spring Boot, integrating with relational databases and REST APIs.",
        'Reduced manual support demand by building a chatbot for customer service, appointment scheduling and facility search across three healthcare units, integrated with multiple systems, using the OpenAI API.',
        'Built a work instruction system for an industrial client (Flex), guiding operators through production steps, using PHP and Angular.',
        'Reduced import failures in bulk data loads from the Protheus and TOTVS ERPs by standardizing paginated endpoints and data security practices, using NestJS and Python.',
        'Eliminated unauthorized access incidents by integrating Microsoft AD authentication with role-based access control across all modules and submodules of a business-critical system.',
        'Delivered an employee training platform for Foxconn end to end, from requirements to deploy, loading large datasets in 1 to 2 seconds.',
      ],
    },
    stack: ['Java', 'NestJS', 'TypeScript', 'Python', 'PHP', 'PostgreSQL', 'Angular'],
  },
  {
    kind: 'work',
    start: '2024-04',
    end: '2024-10',
    org: 'Digital View',
    role: { pt: 'Engenheiro de Software', en: 'Software Engineer' },
    place: { pt: 'Maputo, Moçambique · remoto', en: 'Maputo, Mozambique · remote' },
    bullets: {
      pt: [
        'Construí o frontend de um CRM para corretoras de seguros, com gestão de contratos, relatórios financeiros e dashboards interativos integrados a APIs REST (Next.js e TypeScript).',
        'Reduzi o risco de regressão em 30% com suítes de testes unitários e end-to-end (Jest e Cypress).',
        'Revisei e aprovei pull requests num time internacional 100% remoto, garantindo os padrões de arquitetura.',
      ],
      en: [
        'Built the frontend of a CRM for insurance brokers, covering contract management, financial reports and interactive dashboards, integrating with REST APIs, using Next.js and TypeScript.',
        'Reduced regression risk by 30% with unit and end-to-end test suites, using Jest and Cypress.',
        'Reviewed and approved pull requests across a fully remote international team, enforcing architectural standards.',
      ],
    },
    stack: ['Angular', 'Next.js', 'React', 'React Native', 'TypeScript'],
  },
  {
    kind: 'education',
    start: '2023-01',
    end: '2024-12',
    org: 'Uninorte',
    role: { pt: 'MBA em Engenharia de Software', en: 'MBA in Software Engineering' },
  },
  {
    kind: 'work',
    start: '2023-01',
    end: '2024-04',
    org: 'TCL SEMP',
    role: { pt: 'Engenheiro de Software', en: 'Software Engineer' },
    place: { pt: 'Manaus · híbrido', en: 'Manaus, Brazil · hybrid' },
    bullets: {
      pt: [
        'Construí serviços internos de backend para análise de negócio e gestão de linha de produção, com processamento assíncrono em filas e ingestão de dados em dashboards do Grafana (NestJS, PostgreSQL e RabbitMQ).',
        'Migrei a aplicação web do departamento de qualidade da fábrica de React para Angular, em TypeScript.',
        'Substituí relatórios manuais da linha de produção construindo o primeiro app mobile interno da empresa, com acesso em tempo real a dados operacionais (React Native e TypeScript).',
        'Reduzi em 30% o tempo de resolução de incidentes escrevendo documentação interna de troubleshooting para o time de engenharia.',
        'Melhorei a consistência de entrega entre squads híbridos conduzindo cerimônias ágeis: planejamento, reviews e retrospectivas.',
      ],
      en: [
        'Built internal backend services for business analytics and production line management, with queue-based async processing and data ingestion into Grafana dashboards, using NestJS, PostgreSQL and RabbitMQ.',
        "Migrated the factory's quality department web application from React to Angular, using TypeScript.",
        "Replaced manual production line reports by building the company's first internal mobile app, giving teams real-time access to operational data, using React Native and TypeScript.",
        'Reduced incident resolution time by 30% by writing internal troubleshooting documentation for the engineering team.',
        'Improved delivery consistency across hybrid squads by running agile ceremonies: sprint planning, reviews and retrospectives.',
      ],
    },
    stack: ['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'RabbitMQ', 'Angular'],
  },
  {
    kind: 'work',
    start: '2022-01',
    end: '2022-12',
    org: 'Musashi da Amazônia',
    role: { pt: 'Estagiário de Engenharia de Software', en: 'Software Engineering Intern' },
    place: { pt: 'Manaus · presencial', en: 'Manaus, Brazil · on-site' },
    bullets: {
      pt: [
        'Ampliei o canal de receita digital da empresa construindo do zero uma plataforma de e-commerce com login, carrinho, checkout via Pix e cartão, controle de estoque e backend do fluxo de vendas (Node.js, TypeScript e React).',
        'Desenvolvi páginas web e sistemas internos desde o início do estágio, com React, TypeScript e Node.js.',
        'Apliquei práticas de modelagem de dados em vários projetos simultâneos, com MySQL e MongoDB.',
        'Trabalhei com Scrum e Kanban durante todo o ciclo de desenvolvimento.',
      ],
      en: [
        "Expanded the company's digital revenue channel by building from scratch an e-commerce platform with login, cart, Pix and card checkout, inventory control and a sales flow backend, using Node.js, TypeScript and React.",
        'Developed web pages and internal systems from the start of the internship, using React, TypeScript and Node.js.',
        'Applied data modeling practices across multiple concurrent projects, using MySQL and MongoDB.',
        'Worked with Scrum and Kanban throughout the full development lifecycle.',
      ],
    },
    stack: ['Node.js', 'TypeScript', 'Angular', 'React', 'MySQL', 'MongoDB'],
  },
  {
    kind: 'work',
    start: '2021-04',
    end: '2022-04',
    org: 'Fiverr',
    role: { pt: 'Engenheiro de Software (freelance)', en: 'Software Engineer (Freelance)' },
    place: { pt: 'Remoto', en: 'Remote' },
    bullets: {
      pt: [
        'Construí uma API de gestão de entregas com autenticação JWT, hash de senhas e gestão de entregadores (NestJS, Prisma e PostgreSQL).',
        'Construí um app de gestão de eventos e convidados, com autenticação e interface personalizada para organizadores remotos (React Native e TypeScript).',
        'Entreguei aplicações web e mobile e APIs de ponta a ponta para clientes internacionais, com Node.js, NestJS, React e Prisma.',
        'Gerenciei projetos simultâneos para vários clientes internacionais cumprindo os prazos, usando Jira.',
      ],
      en: [
        'Built a delivery management API with JWT authentication, password hashing and courier relationship management, using NestJS, Prisma and PostgreSQL.',
        'Built an event and guest management app with authentication and custom UI for remote event organizers, using React Native and TypeScript.',
        'Delivered end-to-end web and mobile applications and APIs for international clients, using Node.js, NestJS, React and Prisma.',
        'Managed concurrent projects for multiple international clients while keeping delivery timelines, using Jira.',
      ],
    },
    stack: ['Node.js', 'NestJS', 'TypeScript', 'Prisma', 'PostgreSQL', 'Angular', 'React'],
  },
  {
    kind: 'education',
    start: '2019-01',
    end: '2022-12',
    org: 'Uninorte',
    role: { pt: 'Bacharelado em Ciência da Computação', en: "Bachelor's in Computer Science" },
  },
];
