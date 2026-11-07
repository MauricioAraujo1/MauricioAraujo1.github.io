# Farol · portfólio de Maurício Araújo

Portfólio pessoal com o tema **farol à noite**: cada seção é um *rumo* do feixe de luz. Ao rolar a página, o feixe gira até a seção visível.

- **Stack:** [Astro](https://astro.build) 7 + TypeScript, com CSS puro e animações em CSS/SVG
- **Idiomas:** PT em `/` e EN em `/en/`, pelo i18n nativo do Astro
- **Dados do GitHub:** buscados no build, sem token
- **Design:** `design/farol-portfolio.figcraft` (FigCraft) e `design/farol-cena.*` (VectorCraft)

## Rodando

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # gera dist/ (site estático)
pnpm preview    # serve o dist/
pnpm check      # checagem de tipos (astro check)
```

## Estrutura

```
src/
├── pages/              rotas: só escolhem o idioma
│   ├── index.astro     PT
│   └── en/index.astro  EN
├── layouts/            BaseLayout: <head>, fontes, SEO, hreflang
├── components/
│   ├── Portfolio.astro composição da página inteira
│   ├── layout/         Nav, Footer
│   ├── scene/          cena SVG fixa + camadas extras (nuvens, avião, estrela cadente, easter egg)
│   ├── sections/       Hero, Stack, Projects, GitHub, Journey, Contact
│   └── ui/             peças reutilizáveis (Buoy, Boat, ProjectCard, Port, ContributionSky, SectionHeader)
├── data/               conteúdo: perfil, stack, projetos, trajetória, seções/rumos
├── i18n/ui.ts          dicionário PT/EN, tipo Localized<T>, helpers
├── lib/                lógica sem DOM: github.ts (fetch + parser), morse.ts
├── scripts/            comportamento no navegador, um módulo por responsabilidade
│   ├── main.ts         ponto de entrada
│   ├── beacon.ts       seção visível → rumo do feixe, nav ativa e rodapé
│   ├── morse.ts        lâmpada piscando a palavra em Morse no contato
│   ├── ambient.ts      parallax, estrela cadente e avião
│   ├── easter-egg.ts   5 cliques na lua 🛸
│   └── ui.ts           revelar ao rolar, menu mobile, copiar e-mail
└── styles/
    ├── tokens.css      design tokens: cor (com color-mix), tipografia fluida, espaço, movimento, camadas
    ├── media.css       breakpoints nomeados (@custom-media), compilados pelo PostCSS
    ├── global.css      base, modos de layout, tipografia e botões compartilhados
    └── scene.css       posição e animações da cena
```

### Layout responsivo

O CSS é **mobile-first**, com dois modos de layout definidos em `styles/media.css`:

| Modo | Quando | Comportamento |
|---|---|---|
| fluxo (base) | celular e telas baixas | rolagem normal, cena reduzida e ancorada embaixo |
| `--stage` | `min-width: 56em` e `min-height: 38em` | cada seção é um passo de tela cheia (scroll snap), cena ajustada pela altura |

Outros breakpoints: `--tablet`, `--nav-full`, `--hover` (só aplica hover com mouse) e `--reduced-motion`. A grade de projetos usa **container query**, então responde ao espaço do próprio bloco e não à tela.

### Geometria da cena: uma única fonte

`components/scene/geometry.ts` guarda os pontos da ilustração: horizonte, lanterna, torre, lua, rota do avião e coreografia do disco. Esses valores viram variáveis CSS (`--scene-*`) no `<html>`, e o CSS deriva delas tudo o que depende da cena. Por exemplo, `--horizon` ancora as boias no mar e `--clear-of-lighthouse` limita o conteúdo ao espaço à esquerda da torre. Se a ilustração mudar, basta ajustar esse arquivo.

### Como as peças conversam

O estado visual vive em atributos do `<html>`, e o CSS reage a eles:

| Atributo / variável | Quem define | Efeito |
|---|---|---|
| `data-beacon="on\|off"` | `beacon.ts` | farol aceso ou apagado (início) |
| `data-section="<id>"` | `beacon.ts` | seção ativa (reflexo no mar, Morse etc.) |
| `--beam-rot` | `beacon.ts` | rotação do feixe (rumo − 270°) |
| `data-lamp="on\|off"` | `morse.ts` | lâmpada no contato |
| `--progress` | `ambient.ts` | parallax das montanhas |
| `data-egg="run"` | `easter-egg.ts` | coreografia do disco voador |

Os scripts não desenham nada: só mudam estado. Assim a aparência fica toda no CSS, e o conteúdo fica todo em `data/` e `i18n/`.

### Conteúdo

- **Textos da interface:** `src/i18n/ui.ts`
- **Projetos, trajetória e stack:** `src/data/*.ts`. Os campos traduzíveis usam `{ pt, en }`.
- **Rumos do feixe:** `src/data/sections.ts`

### GitHub

`src/lib/github.ts` busca, no build:
- o perfil (`api.github.com/users/:user`): repositórios e seguidores;
- o calendário de contribuições (`github.com/users/:user/contributions`): o céu de estrelas e o total.

Se a rede falhar, o build não quebra: usa os últimos números conhecidos e esconde o céu. Para manter os dados atualizados, configure um rebuild diário no deploy, por exemplo com Vercel Cron ou um GitHub Action agendado.

## Acessibilidade

- Com `prefers-reduced-motion`, o site desliga as animações, e a cena e o céu aparecem prontos.
- A cena é decorativa (`aria-hidden`). Todo o conteúdo está em HTML semântico.
- Há link "pular para o conteúdo", foco visível e menu mobile com `aria-expanded`.
