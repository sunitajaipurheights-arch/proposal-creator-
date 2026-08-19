/* Minimal inline icon set used across the proposal document. */
type P = { size?: number }
const s = (n = 16) => ({ width: n, height: n, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })

export const IconPin = ({ size }: P) => (
  <svg {...s(size)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" /><circle cx="12" cy="10" r="3" /></svg>
)
export const IconPhone = ({ size }: P) => (
  <svg {...s(size)}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.4a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></svg>
)
export const IconShield = ({ size }: P) => (
  <svg {...s(size)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)
export const IconBuilding = ({ size }: P) => (
  <svg {...s(size)}><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></svg>
)
export const IconArea = ({ size }: P) => (
  <svg {...s(size)}><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 3v18" /></svg>
)
export const IconRupee = ({ size }: P) => (
  <svg {...s(size)}><path d="M6 3h12M6 8h12M9 3c3 0 5 2 5 5s-2 5-5 5H7l7 6" /></svg>
)
export const IconFloor = ({ size }: P) => (
  <svg {...s(size)}><path d="M3 21h18M6 21V8l6-4 6 4v13" /></svg>
)
export const IconLock = ({ size }: P) => (
  <svg {...s(size)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
)
export const IconCalendar = ({ size }: P) => (
  <svg {...s(size)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
)
export const IconTrend = ({ size }: P) => (
  <svg {...s(size)}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>
)
export const IconTool = ({ size }: P) => (
  <svg {...s(size)}><path d="M14.7 6.3a4 4 0 01-5 5L4 17v3h3l5.7-5.7a4 4 0 005-5l-2.4 2.4-2.3-2.3z" /></svg>
)
export const IconDoc = ({ size }: P) => (
  <svg {...s(size)}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
)
export const IconUser = ({ size }: P) => (
  <svg {...s(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>
)
export const IconHandshake = ({ size }: P) => (
  <svg {...s(size)}><path d="M11 17l2 2a1 1 0 001.4 0l3.6-3.6M3 12l4-4 5 5M13 8l3-3 5 5-4 4" /></svg>
)
export const IconStar = ({ size }: P) => (
  <svg {...s(size)}><path d="M12 2l3 6.5 7 .8-5 4.8 1.3 7L12 17.8 5.7 21l1.3-7-5-4.8 7-.8z" /></svg>
)
export const IconBox = ({ size }: P) => (
  <svg {...s(size)}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></svg>
)

/** Pick a spec-row icon based on the label text. */
export function specIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('company')) return <IconBuilding size={15} />
  if (l.includes('carpet') || l.includes('area')) return <IconArea size={15} />
  if (l.includes('rent') && !l.includes('advance')) return <IconRupee size={15} />
  if (l.includes('floor')) return <IconFloor size={15} />
  if (l.includes('deposit') || l.includes('security')) return <IconShield size={15} />
  if (l.includes('advance')) return <IconCalendar size={15} />
  if (l.includes('tenure')) return <IconDoc size={15} />
  if (l.includes('escalation')) return <IconTrend size={15} />
  if (l.includes('lock')) return <IconLock size={15} />
  if (l.includes('fit')) return <IconTool size={15} />
  if (l.includes('registration')) return <IconDoc size={15} />
  if (l.includes('consultation') || l.includes('charge')) return <IconUser size={15} />
  return <IconStar size={15} />
}

export function highlightIcon(i: number) {
  const set = [<IconPin size={17} />, <IconBox size={17} />, <IconShield size={17} />, <IconHandshake size={17} />]
  return set[i % set.length]
}
