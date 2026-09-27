/**
 * Desktop "staircase" map of the home page sections, in reading order.
 * Each section fills one viewport-sized cell of the grid:
 *
 *   Home
 *     ↓
 *   Skills → Projects → Experience
 *                           ↓
 *                        Contact → Resume
 *
 * The order is also the navigation order (Navbar indices, keyboard, wheel path).
 */
export const SECTIONS = [
  { id: 'home', col: 0, row: 0 },
  { id: 'skills', col: 0, row: 1 },
  { id: 'project', col: 1, row: 1 },
  { id: 'experience', col: 2, row: 1 },
  { id: 'contact', col: 2, row: 2 },
  { id: 'resume', col: 3, row: 2 },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id)

/** Direction the view travels from section i to section i + 1 */
export const legDirection = (i: number): 'down' | 'right' | null => {
  const from = SECTIONS[i]
  const to = SECTIONS[i + 1]
  if (!from || !to) return null
  return to.row !== from.row ? 'down' : 'right'
}
