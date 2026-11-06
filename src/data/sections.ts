/**
 * Cada seção é um "rumo" do feixe do farol (graus náuticos: 270° = oeste).
 * `null` = farol apagado (início) ou só a lâmpada piscando (contato).
 * Os rumos crescem na ordem das seções: como a lente só gira no sentido
 * horário, rolar para baixo dá sempre giros curtos.
 */
export const sections = [
  { id: 'home', bearing: null },
  { id: 'stack', bearing: 240 }, // feixe no mar, sobre as boias
  { id: 'projects', bearing: 270 }, // horizontal, nos barcos
  { id: 'github', bearing: 300 }, // sobre o céu de estrelas
  { id: 'journey', bearing: 330 },
  { id: 'contact', bearing: null },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function bearingOf(id: SectionId): number | null {
  return sections.find((s) => s.id === id)?.bearing ?? null;
}

/** Ordem "01 / 05" exibida acima dos títulos (o início não conta). */
export function sectionIndex(id: SectionId): string {
  const index = sections.findIndex((s) => s.id === id);
  const total = sections.length - 1;
  return `${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}
