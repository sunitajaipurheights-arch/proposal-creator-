import type {
  Highlight,
  ProposalData,
  PropertyOption,
  SpecRow,
} from './types'

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

const spec = (label: string, value = ''): SpecRow => ({ id: uid(), label, value })

/** The standard spec rows seen across the sample proposals. */
export const defaultSpecs = (): SpecRow[] => [
  spec('Proposed Company'),
  spec('Total Area'),
  spec('Offered Carpet Area'),
  spec('Rent'),
  spec('Floor'),
  spec('Security Deposit'),
  spec('Advance Rent'),
  spec('Tenure'),
  spec('Escalation'),
  spec('Lock-in Period'),
  spec('Fit-out Period'),
  spec('Consultation Charges'),
]

export const newOption = (index = 0): PropertyOption => ({
  id: uid(),
  title: `Option ${index + 1}`,
  specs: defaultSpecs(),
  scope: [],
  photos: [],
})

const defaultHighlights = (): Highlight[] => [
  { id: uid(), title: 'Strategic Location', text: 'Well connected to major roads & city hubs' },
  { id: uid(), title: 'Spacious & Functional', text: 'Ideal for your business operations' },
  { id: uid(), title: 'Secure & Reliable', text: 'Safe premises with trusted management' },
  { id: uid(), title: 'Built for Growth', text: 'Long term association with transparency' },
]

/** Company contact details, pre-filled from the Jaipur Heights brand. */
export const COMPANY = {
  contactName: 'Hitesh Arya',
  companyName: 'Jaipur Heights',
  address:
    '16, Ganpati Marg, Gurujambeshwar Nagar B, Near Utsav Garden, Gandhi Path, Vaishali Nagar, Jaipur-302021',
  phone: '7891011001',
  email: '',
}

/** Today's date as yyyy-mm-dd (for the date input's default). */
export const todayISO = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const emptyProposal = (): ProposalData => ({
  category: 'COMMERCIAL SPACE',
  clientName: '',
  location: '',
  date: todayISO(),
  contactName: COMPANY.contactName,
  companyName: COMPANY.companyName,
  address: COMPANY.address,
  phone: COMPANY.phone,
  email: COMPANY.email,
  heroPhoto: null,
  options: [newOption(0)],
  highlights: defaultHighlights(),
  tagline: "Let's build the future together.",
})
