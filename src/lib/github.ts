/**
 * Dados públicos do GitHub, buscados no build (sem token).
 * - Perfil: REST `api.github.com/users/:user`
 * - Calendário de contribuições: a mesma página pública que o perfil usa
 *   (`github.com/users/:user/contributions`), lida como HTML.
 * Se a rede falhar, o site sai com o último snapshot conhecido.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: ContributionLevel;
}

export interface GitHubStats {
  user: string;
  publicRepos: number;
  followers: number;
  totalContributions: number;
  /** Semanas (domingo → sábado), da mais antiga para a mais recente. */
  weeks: ContributionDay[][];
  fetchedAt: string | null;
}

const FALLBACK: Omit<GitHubStats, 'user'> = {
  publicRepos: 50,
  followers: 30,
  totalContributions: 1791,
  weeks: [],
  fetchedAt: null,
};

const HEADERS = { 'User-Agent': 'farol-portfolio-build', Accept: 'text/html,application/json' };

let cache: Promise<GitHubStats> | undefined;

/** Memoizado: as duas páginas (PT e EN) compartilham um único fetch por build. */
export function getGitHubStats(user: string): Promise<GitHubStats> {
  cache ??= load(user);
  return cache;
}

async function load(user: string): Promise<GitHubStats> {
  const [profile, calendar] = await Promise.allSettled([fetchProfile(user), fetchCalendar(user)]);

  if (profile.status === 'rejected') console.warn(`[github] perfil indisponível: ${profile.reason}`);
  if (calendar.status === 'rejected') console.warn(`[github] calendário indisponível: ${calendar.reason}`);

  const days = calendar.status === 'fulfilled' ? calendar.value : [];
  return {
    user,
    publicRepos: profile.status === 'fulfilled' ? profile.value.public_repos : FALLBACK.publicRepos,
    followers: profile.status === 'fulfilled' ? profile.value.followers : FALLBACK.followers,
    totalContributions: days.length ? days.reduce((sum, d) => sum + d.count, 0) : FALLBACK.totalContributions,
    weeks: groupByWeek(days),
    fetchedAt: days.length ? new Date().toISOString() : null,
  };
}

async function fetchProfile(user: string): Promise<{ public_repos: number; followers: number }> {
  const res = await fetch(`https://api.github.com/users/${user}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchCalendar(user: string): Promise<ContributionDay[]> {
  const res = await fetch(`https://github.com/users/${user}/contributions`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseCalendar(await res.text());
}

/** Extrai dias do HTML do calendário. Exportado para teste. */
export function parseCalendar(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const match = /^(\d+)\s+contributions?/.exec(text.trim());
    counts.set(id, match ? Number(match[1]) : 0);
  }

  const days: ContributionDay[] = [];
  for (const [tag] of html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = /data-date="([^"]+)"/.exec(tag)?.[1];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0);
    if (!date) continue;
    days.push({ date, count: (id && counts.get(id)) || 0, level: clampLevel(level) });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function clampLevel(n: number): ContributionLevel {
  return Math.min(4, Math.max(0, n)) as ContributionLevel;
}

/** Agrupa em colunas de domingo a sábado, como o gráfico do GitHub. */
function groupByWeek(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1]!.push(day);
  }
  return weeks;
}
